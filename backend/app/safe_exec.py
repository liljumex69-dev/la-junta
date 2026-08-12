"""Ejecución real de transacciones en un Safe ya desplegado — Capa 2.

Cubre firmar_propuesta(): calcula el hash exacto que cada directivo debe
firmar (leyendo getTransactionHash() del propio contrato, nunca
recalculado a mano), recupera criptográficamente quién firmó de verdad, y
ejecuta execTransaction() una vez juntado el umbral — el deployer paga el
gas como relayer, la autorización viene 100% de las firmas reales de los
owners.

Firmas verificadas contra el contrato real (safe-smart-account/Safe.sol,
función checkNSignatures): deben ir ordenadas ascendentemente por dirección
del firmante (si no, revierte "GS026"), y una firma con v en {27,28} se
valida con ecrecover directo sobre el hash crudo, sin prefijo eth_sign —
exactamente lo que produce Account.unsafe_sign_hash().
"""

from typing import NamedTuple

from eth_account import Account
from web3 import Web3

from .chain import ZERO_ADDRESS, ChainConnectionError, conectar
from .config import requerir_deployer_private_key

GAS_BUFFER_MULTIPLIER = 1.2
RECEIPT_TIMEOUT_SEGUNDOS = 180

# Parámetros fijos para una transferencia simple sin reembolso de gas al
# relayer — el deployer paga el gas, sin que el Safe se lo devuelva.
OPERATION_CALL = 0
SAFE_TX_GAS = 0
BASE_GAS = 0
GAS_PRICE = 0
GAS_TOKEN = ZERO_ADDRESS
REFUND_RECEIVER = ZERO_ADDRESS

SAFE_ABI = [
    {
        "type": "function",
        "name": "nonce",
        "stateMutability": "view",
        "inputs": [],
        "outputs": [{"type": "uint256"}],
    },
    {
        "type": "function",
        "name": "getOwners",
        "stateMutability": "view",
        "inputs": [],
        "outputs": [{"type": "address[]"}],
    },
    {
        "type": "function",
        "name": "getTransactionHash",
        "stateMutability": "view",
        "inputs": [
            {"type": "address", "name": "to"},
            {"type": "uint256", "name": "value"},
            {"type": "bytes", "name": "data"},
            {"type": "uint8", "name": "operation"},
            {"type": "uint256", "name": "safeTxGas"},
            {"type": "uint256", "name": "baseGas"},
            {"type": "uint256", "name": "gasPrice"},
            {"type": "address", "name": "gasToken"},
            {"type": "address", "name": "refundReceiver"},
            {"type": "uint256", "name": "_nonce"},
        ],
        "outputs": [{"type": "bytes32"}],
    },
    {
        "type": "function",
        "name": "execTransaction",
        "stateMutability": "payable",
        "inputs": [
            {"type": "address", "name": "to"},
            {"type": "uint256", "name": "value"},
            {"type": "bytes", "name": "data"},
            {"type": "uint8", "name": "operation"},
            {"type": "uint256", "name": "safeTxGas"},
            {"type": "uint256", "name": "baseGas"},
            {"type": "uint256", "name": "gasPrice"},
            {"type": "address", "name": "gasToken"},
            {"type": "address", "name": "refundReceiver"},
            {"type": "bytes", "name": "signatures"},
        ],
        "outputs": [{"type": "bool"}],
    },
]


class SafeExecError(Exception):
    """Cualquier fallo leyendo el Safe, verificando firmas, o ejecutando la
    transacción."""


class ParametrosSafeTx(NamedTuple):
    to: str
    value: int
    data: bytes
    operation: int
    safe_tx_gas: int
    base_gas: int
    gas_price: int
    gas_token: str
    refund_receiver: str
    nonce: int


class SafeExecResult(NamedTuple):
    tx_hash: str


def _contrato_safe(w3: Web3, safe_address: str):
    return w3.eth.contract(address=Web3.to_checksum_address(safe_address), abi=SAFE_ABI)


def obtener_owners(safe_address: str) -> list[str]:
    try:
        w3 = conectar()
    except ChainConnectionError as e:
        raise SafeExecError(str(e)) from e
    try:
        return _contrato_safe(w3, safe_address).functions.getOwners().call()
    except Exception as e:
        raise SafeExecError(f"Error leyendo los owners del Safe {safe_address}: {e}") from e


def preparar_transaccion(safe_address: str, to: str, value_wei: int) -> tuple[ParametrosSafeTx, str]:
    """Congela los parámetros de una transferencia simple de ETH (sin
    `data`) al proponer un gasto: lee el nonce actual del Safe y calcula el
    hash exacto a firmar vía getTransactionHash() on-chain — nunca
    recalculado a mano localmente."""
    if not Web3.is_address(to):
        raise SafeExecError(f"Dirección de destino inválida: {to!r}")
    if value_wei <= 0:
        raise SafeExecError("El monto en wei debe ser mayor a 0.")

    try:
        w3 = conectar()
    except ChainConnectionError as e:
        raise SafeExecError(str(e)) from e

    contrato = _contrato_safe(w3, safe_address)
    to_checksum = Web3.to_checksum_address(to)
    try:
        nonce = contrato.functions.nonce().call()
        safe_tx_hash = contrato.functions.getTransactionHash(
            to_checksum,
            value_wei,
            b"",
            OPERATION_CALL,
            SAFE_TX_GAS,
            BASE_GAS,
            GAS_PRICE,
            GAS_TOKEN,
            REFUND_RECEIVER,
            nonce,
        ).call()
    except Exception as e:
        raise SafeExecError(f"Error leyendo el Safe {safe_address}: {e}") from e

    params = ParametrosSafeTx(
        to=to_checksum,
        value=value_wei,
        data=b"",
        operation=OPERATION_CALL,
        safe_tx_gas=SAFE_TX_GAS,
        base_gas=BASE_GAS,
        gas_price=GAS_PRICE,
        gas_token=GAS_TOKEN,
        refund_receiver=REFUND_RECEIVER,
        nonce=nonce,
    )
    return params, "0x" + safe_tx_hash.hex()


def recuperar_firmante(safe_tx_hash: str, firma: str) -> str:
    """Recupera, sin tocar la red, la dirección que produjo `firma` sobre
    `safe_tx_hash` (firma cruda, sin prefijo eth_sign — v en 27/28)."""
    try:
        hash_bytes = bytes.fromhex(safe_tx_hash.removeprefix("0x"))
        firma_bytes = bytes.fromhex(firma.removeprefix("0x"))
    except ValueError as e:
        raise SafeExecError(f"safeTxHash o firma con formato hex inválido: {e}") from e
    if len(hash_bytes) != 32:
        raise SafeExecError(f"safeTxHash debe tener 32 bytes, llegaron {len(hash_bytes)}.")
    if len(firma_bytes) != 65:
        raise SafeExecError(
            f"La firma debe tener 65 bytes (r+s+v), llegaron {len(firma_bytes)}."
        )
    try:
        return Account._recover_hash(hash_bytes, signature=firma_bytes)
    except Exception as e:
        raise SafeExecError(f"No se pudo recuperar el firmante de la firma dada: {e}") from e


def ejecutar_transaccion(
    safe_address: str,
    params: ParametrosSafeTx,
    firmas_por_direccion: dict[str, bytes],
) -> SafeExecResult:
    """Ejecuta execTransaction() en el Safe real, concatenando las firmas
    ordenadas ascendentemente por dirección (obligatorio: Safe.sol
    revierte con GS026 si no vienen en ese orden). El deployer paga el
    gas; la autorización viene 100% de `firmas_por_direccion`.

    Nunca deja una transacción "a medias": si algo falla antes de
    enviarla (incluida una simulación .call() que detecta que revertiría),
    no se envía nada; si falla después de enviarla, el error incluye el
    tx hash para verificar manualmente en Arbiscan.
    """
    if not firmas_por_direccion:
        raise SafeExecError("No hay firmas para ejecutar la transacción.")

    try:
        w3 = conectar()
    except ChainConnectionError as e:
        raise SafeExecError(str(e)) from e

    try:
        deployer = Account.from_key(requerir_deployer_private_key())
    except RuntimeError as e:
        raise SafeExecError(str(e)) from e

    direcciones_ordenadas = sorted(firmas_por_direccion.keys(), key=lambda d: int(d, 16))
    signatures_blob = b"".join(firmas_por_direccion[d] for d in direcciones_ordenadas)

    contrato = _contrato_safe(w3, safe_address)
    fn = contrato.functions.execTransaction(
        params.to,
        params.value,
        params.data,
        params.operation,
        params.safe_tx_gas,
        params.base_gas,
        params.gas_price,
        params.gas_token,
        params.refund_receiver,
        signatures_blob,
    )

    try:
        fn.call({"from": deployer.address})
    except Exception as e:
        raise SafeExecError(
            f"La transacción se revertiría on-chain (simulada, no enviada — "
            f"no se gastó gas): {e}"
        ) from e

    try:
        balance = w3.eth.get_balance(deployer.address)
        gas_estimate = fn.estimate_gas({"from": deployer.address})
        tx = fn.build_transaction(
            {
                "from": deployer.address,
                "nonce": w3.eth.get_transaction_count(deployer.address),
                "chainId": w3.eth.chain_id,
                "gas": int(gas_estimate * GAS_BUFFER_MULTIPLIER),
            }
        )
    except Exception as e:
        raise SafeExecError(f"Error preparando la transacción de ejecución: {e}") from e

    costo_maximo = tx["gas"] * tx["maxFeePerGas"]
    if balance < costo_maximo:
        raise SafeExecError(
            f"Saldo insuficiente en la wallet deployer "
            f"({w3.from_wei(balance, 'ether')} ETH) para cubrir el gas."
        )

    signed = deployer.sign_transaction(tx)

    try:
        tx_hash_bytes = w3.eth.send_raw_transaction(signed.raw_transaction)
    except Exception as e:
        raise SafeExecError(f"Error enviando la transacción de ejecución: {e}") from e
    # HexBytes.hex() en esta versión NO trae el prefijo "0x" — normalizamos
    # una sola vez acá (mismo fix que en safe_deploy.py).
    tx_hash = "0x" + tx_hash_bytes.hex()

    try:
        receipt = w3.eth.wait_for_transaction_receipt(
            tx_hash_bytes, timeout=RECEIPT_TIMEOUT_SEGUNDOS
        )
    except Exception as e:
        raise SafeExecError(
            f"La transacción {tx_hash} se envió pero no se pudo "
            f"confirmar a tiempo ({e}). Revisa su estado en "
            f"https://sepolia.arbiscan.io/tx/{tx_hash} antes de "
            "reintentar — puede haberse confirmado igual."
        ) from e

    if receipt.status != 1:
        raise SafeExecError(f"La transacción se revirtió on-chain (tx {tx_hash}).")

    return SafeExecResult(tx_hash=tx_hash)
