"""Despliegue real de un Safe multifirma en Arbitrum Sepolia — Capa 2.

Implementa con web3.py puro el mismo mecanismo que usa
@safe-global/protocol-kit: CREATE2 vía SafeProxyFactory.createProxyWithNonce()
contra los contratos oficiales de Safe v1.4.1. No se usa `safe-eth-py`
porque su dependencia `safe-pysha3` requiere compilar una extensión en C y
falla en Windows sin Visual C++ Build Tools.

Direcciones verificadas byte a byte (no de memoria) contra el JSON crudo de
https://github.com/safe-global/safe-deployments — confirmadas como
deployment "canonical" para chain 421614 (Arbitrum Sepolia):
- SafeProxyFactory v1.4.1: src/assets/v1.4.1/safe_proxy_factory.json
- SafeL2 v1.4.1 (singleton, para cadenas L2): src/assets/v1.4.1/safe_l2.json
- CompatibilityFallbackHandler v1.4.1: src/assets/v1.4.1/compatibility_fallback_handler.json

Se usa el singleton "SafeL2" (no "Safe" a secas) porque es la variante que
Safe recomienda para L2s: emite eventos explícitos que algunas L2 necesitan
para indexar transacciones correctamente.
"""

import secrets
from typing import NamedTuple

from eth_account import Account
from web3 import Web3

from .chain import CHAIN_ID, ZERO_ADDRESS, ChainConnectionError, conectar
from .config import requerir_deployer_private_key

SAFE_PROXY_FACTORY_ADDRESS = Web3.to_checksum_address(
    "0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67"
)
SAFE_SINGLETON_ADDRESS = Web3.to_checksum_address(
    "0x29fcB43b46531BcA003ddC8FCB67FFE91900C762"
)
FALLBACK_HANDLER_ADDRESS = Web3.to_checksum_address(
    "0xfd0732Dc9E303f09fCEf3a7388Ad10A83459Ec99"
)

# Margen sobre el gas estimado: los L2 a veces varían el componente de
# datos de L1 entre el estimate y el envío real.
GAS_BUFFER_MULTIPLIER = 1.2
RECEIPT_TIMEOUT_SEGUNDOS = 180

SAFE_SETUP_ABI = [
    {
        "type": "function",
        "name": "setup",
        "stateMutability": "nonpayable",
        "inputs": [
            {"type": "address[]", "name": "_owners"},
            {"type": "uint256", "name": "_threshold"},
            {"type": "address", "name": "to"},
            {"type": "bytes", "name": "data"},
            {"type": "address", "name": "fallbackHandler"},
            {"type": "address", "name": "paymentToken"},
            {"type": "uint256", "name": "payment"},
            {"type": "address", "name": "paymentReceiver"},
        ],
        "outputs": [],
    }
]

PROXY_FACTORY_ABI = [
    {
        "type": "function",
        "name": "createProxyWithNonce",
        "stateMutability": "nonpayable",
        "inputs": [
            {"type": "address", "name": "_singleton"},
            {"type": "bytes", "name": "initializer"},
            {"type": "uint256", "name": "saltNonce"},
        ],
        "outputs": [{"type": "address", "name": "proxy"}],
    },
    {
        "type": "event",
        "name": "ProxyCreation",
        "anonymous": False,
        "inputs": [
            # `proxy` es indexed en el contrato real (confirmado contra logs
            # on-chain reales: topic1 trae la dirección del proxy, `data`
            # trae solo `singleton`). Declararlo como no-indexed hacía que
            # process_receipt() no encontrara ninguna coincidencia.
            {"type": "address", "name": "proxy", "indexed": True},
            {"type": "address", "name": "singleton", "indexed": False},
        ],
    },
]


class SafeDeploymentError(Exception):
    """Cualquier fallo desplegando el Safe: direcciones inválidas, RPC
    caído, red equivocada, saldo insuficiente para gas, o transacción
    revertida/no confirmada."""


class SafeDeployResult(NamedTuple):
    safe_address: str
    tx_hash: str


def _validar_owners(owners: list[str], threshold: int) -> list[str]:
    if not owners:
        raise SafeDeploymentError("La asociación necesita al menos un firmante.")
    if not (1 <= threshold <= len(owners)):
        raise SafeDeploymentError(
            f"El umbral ({threshold}) debe estar entre 1 y el número de "
            f"firmantes ({len(owners)})."
        )
    checksummed = []
    for direccion in owners:
        if not Web3.is_address(direccion):
            raise SafeDeploymentError(f"Dirección de firmante inválida: {direccion!r}")
        checksummed.append(Web3.to_checksum_address(direccion))
    if len(set(checksummed)) != len(checksummed):
        raise SafeDeploymentError("Hay direcciones de firmantes duplicadas.")
    return checksummed


def desplegar_safe(owners: list[str], threshold: int) -> SafeDeployResult:
    """Despliega un Safe multifirma real en Arbitrum Sepolia y devuelve su
    dirección y el hash de la transacción de despliegue.

    Nunca deja una transacción "a medias": si algo falla antes de enviarla,
    no se envía nada; si falla después de enviarla (ej. timeout esperando
    confirmación), el error incluye el tx hash para verificar manualmente
    en Arbiscan antes de reintentar.
    """
    owners_checksummed = _validar_owners(owners, threshold)

    try:
        w3 = conectar()
    except ChainConnectionError as e:
        raise SafeDeploymentError(str(e)) from e

    try:
        deployer = Account.from_key(requerir_deployer_private_key())
    except RuntimeError as e:
        raise SafeDeploymentError(str(e)) from e

    safe_contract = w3.eth.contract(address=SAFE_SINGLETON_ADDRESS, abi=SAFE_SETUP_ABI)
    initializer = safe_contract.encode_abi(
        abi_element_identifier="setup",
        args=[
            owners_checksummed,
            threshold,
            ZERO_ADDRESS,
            b"",
            FALLBACK_HANDLER_ADDRESS,
            ZERO_ADDRESS,
            0,
            ZERO_ADDRESS,
        ],
    )

    factory_contract = w3.eth.contract(
        address=SAFE_PROXY_FACTORY_ADDRESS, abi=PROXY_FACTORY_ABI
    )
    salt_nonce = int.from_bytes(secrets.token_bytes(32), "big")
    fn = factory_contract.functions.createProxyWithNonce(
        SAFE_SINGLETON_ADDRESS, initializer, salt_nonce
    )

    try:
        balance = w3.eth.get_balance(deployer.address)
        gas_estimate = fn.estimate_gas({"from": deployer.address})
        tx = fn.build_transaction(
            {
                "from": deployer.address,
                "nonce": w3.eth.get_transaction_count(deployer.address),
                "chainId": CHAIN_ID,
                "gas": int(gas_estimate * GAS_BUFFER_MULTIPLIER),
            }
        )
    except Exception as e:
        raise SafeDeploymentError(
            f"Error preparando la transacción de despliegue: {e}"
        ) from e

    costo_maximo = tx["gas"] * tx["maxFeePerGas"]
    if balance < costo_maximo:
        raise SafeDeploymentError(
            f"Saldo insuficiente en la wallet deployer "
            f"({w3.from_wei(balance, 'ether')} ETH) para cubrir el gas "
            f"estimado del despliegue."
        )

    signed = deployer.sign_transaction(tx)

    try:
        tx_hash_bytes = w3.eth.send_raw_transaction(signed.raw_transaction)
    except Exception as e:
        raise SafeDeploymentError(
            f"Error enviando la transacción de despliegue: {e}"
        ) from e
    # HexBytes.hex() en esta versión NO trae el prefijo "0x" — normalizamos
    # una sola vez acá para no repetir el error en cada mensaje/retorno.
    tx_hash = "0x" + tx_hash_bytes.hex()

    try:
        receipt = w3.eth.wait_for_transaction_receipt(
            tx_hash_bytes, timeout=RECEIPT_TIMEOUT_SEGUNDOS
        )
    except Exception as e:
        raise SafeDeploymentError(
            f"La transacción {tx_hash} se envió pero no se pudo "
            f"confirmar a tiempo ({e}). Revisa su estado en "
            f"https://sepolia.arbiscan.io/tx/{tx_hash} antes de "
            "reintentar — puede haberse confirmado igual."
        ) from e

    if receipt.status != 1:
        raise SafeDeploymentError(
            f"La transacción de despliegue se revirtió on-chain "
            f"(tx {tx_hash})."
        )

    eventos = factory_contract.events.ProxyCreation().process_receipt(receipt)
    if not eventos:
        raise SafeDeploymentError(
            f"La transacción {tx_hash} se confirmó pero no emitió el "
            "evento ProxyCreation esperado — no se pudo determinar la "
            "dirección del Safe desplegado."
        )

    safe_address = Web3.to_checksum_address(eventos[0]["args"]["proxy"])
    return SafeDeployResult(safe_address=safe_address, tx_hash=tx_hash)
