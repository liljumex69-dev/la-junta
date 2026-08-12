"""Conexión compartida a Arbitrum Sepolia.

Usada tanto por el despliegue de Safes (app/safe_deploy.py, escritura) como
por la verificación de pagos (app/pago_verificacion.py, solo lectura).
Centralizado acá para no tener RPC_URL/CHAIN_ID duplicados en dos archivos.
"""

from web3 import Web3

RPC_URL = "https://sepolia-rollup.arbitrum.io/rpc"
CHAIN_ID = 421614
ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"


class ChainConnectionError(Exception):
    """No se pudo conectar al RPC, o respondió con la cadena equivocada."""


def conectar() -> Web3:
    w3 = Web3(Web3.HTTPProvider(RPC_URL))
    if not w3.is_connected():
        raise ChainConnectionError(
            f"No se pudo conectar al RPC de Arbitrum Sepolia ({RPC_URL})."
        )
    chain_id = w3.eth.chain_id
    if chain_id != CHAIN_ID:
        raise ChainConnectionError(
            f"El RPC respondió con chain_id {chain_id}, se esperaba "
            f"{CHAIN_ID} (Arbitrum Sepolia)."
        )
    return w3
