"""Verificación on-chain de pagos de cuota — Capa 2.

El comerciante paga con SU PROPIA wallet directo al Safe de la asociación
(fuera del backend — por ejemplo escaneando el QR, tal como ya describía el
TODO-ARBITRUM original). Este backend nunca origina el pago ni tiene
ninguna clave privada de comerciante: solo verifica, leyendo la cadena, que
una transacción real y exitosa llegó al Safe correcto antes de marcar la
cuota como pagada.

Qué se verifica (endurecido tras la revisión de seguridad):
1. El hash tiene formato canónico (0x + 64 hex, minúsculas) — así el mismo
   pago no puede registrarse dos veces variando el casing.
2. La transacción existe, está confirmada y no se revirtió.
3. El destino es exactamente el Safe de la asociación.
4. El REMITENTE es la wallet registrada del comerciante que debe la cuota —
   nadie puede reclamar crédito por el pago público de otro.
5. El valor transferido cubre el montoWei congelado de la cuota — 1 wei ya
   no paga nada.

`monto` en soles sigue siendo solo para mostrar: la equivalencia on-chain
es el montoWei fijado al crear la cuota (no hay puente fiat-stablecoin con
tasa real todavía).
"""

import re

from web3 import Web3

from .chain import ChainConnectionError, conectar


class VerificacionPagoError(Exception):
    """El tx_hash dado no corresponde a un pago válido para esta cuota."""


def normalizar_tx_hash(tx_hash: str) -> str:
    """Forma canónica del hash: 0x + 64 hex en minúsculas. Rechaza cualquier
    otra cosa — el dedup en base de datos compara strings exactos, así que
    todos los hashes deben guardarse ya normalizados."""
    limpio = tx_hash.strip().lower()
    if not re.fullmatch(r"0x[0-9a-f]{64}", limpio):
        raise VerificacionPagoError(
            f"txHash con formato inválido: se espera 0x seguido de 64 "
            f"caracteres hexadecimales, llegó {tx_hash!r}."
        )
    return limpio


def verificar_pago(
    tx_hash: str,
    safe_address: str,
    monto_minimo_wei: int,
    direccion_pagador: str,
) -> int:
    """Verifica on-chain que `tx_hash` es una transacción confirmada y
    exitosa, enviada POR `direccion_pagador`, con destino `safe_address`, y
    con valor >= `monto_minimo_wei`. Devuelve el valor transferido en wei.
    """
    tx_hash = normalizar_tx_hash(tx_hash)

    if not Web3.is_address(safe_address):
        raise VerificacionPagoError(f"safeAddress inválido: {safe_address!r}")
    safe_checksum = Web3.to_checksum_address(safe_address)

    if not Web3.is_address(direccion_pagador):
        raise VerificacionPagoError(
            f"Dirección de pagador inválida: {direccion_pagador!r}"
        )
    pagador_checksum = Web3.to_checksum_address(direccion_pagador)

    if monto_minimo_wei <= 0:
        raise VerificacionPagoError(
            "El monto mínimo en wei de la cuota debe ser mayor a 0."
        )

    try:
        w3 = conectar()
    except ChainConnectionError as e:
        raise VerificacionPagoError(str(e)) from e

    try:
        tx = w3.eth.get_transaction(tx_hash)
    except Exception as e:
        raise VerificacionPagoError(
            f"No se encontró la transacción {tx_hash} en Arbitrum Sepolia: {e}"
        ) from e

    try:
        receipt = w3.eth.get_transaction_receipt(tx_hash)
    except Exception as e:
        raise VerificacionPagoError(
            f"La transacción {tx_hash} existe pero no tiene recibo "
            f"todavía (¿sigue pendiente de confirmar?): {e}"
        ) from e

    if receipt.status != 1:
        raise VerificacionPagoError(
            f"La transacción {tx_hash} falló on-chain (revertida)."
        )

    if tx["to"] is None or Web3.to_checksum_address(tx["to"]) != safe_checksum:
        raise VerificacionPagoError(
            f"La transacción {tx_hash} no fue enviada al Safe de esta "
            f"asociación ({safe_checksum})."
        )

    if Web3.to_checksum_address(tx["from"]) != pagador_checksum:
        raise VerificacionPagoError(
            f"La transacción {tx_hash} no fue enviada desde la wallet "
            f"registrada del comerciante que debe esta cuota "
            f"({pagador_checksum}). Solo el dueño de la cuota puede "
            "reclamar su pago."
        )

    if tx["value"] < monto_minimo_wei:
        raise VerificacionPagoError(
            f"El pago transfirió {tx['value']} wei, pero la cuota requiere "
            f"al menos {monto_minimo_wei} wei."
        )

    return tx["value"]
