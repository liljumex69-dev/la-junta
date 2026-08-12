"""Funciones puras auxiliares: ids, iniciales, código de invitación, hash simulado.

Sin dependencias de FastAPI ni SQLAlchemy a propósito, para que la lógica se
pueda leer y probar aislada de la capa HTTP/DB (separación en capas).
"""

import re
import secrets
import unicodedata
from datetime import date


def generar_id(prefijo: str) -> str:
    return f"{prefijo}-{secrets.token_hex(6)}"


def hoy_iso() -> str:
    return date.today().isoformat()


def limpiar_telefono(telefono: str) -> str:
    return re.sub(r"\D", "", telefono)


def generar_iniciales(nombre: str) -> str:
    partes = [p for p in nombre.strip().split() if p]
    if not partes:
        return "?"
    if len(partes) == 1:
        return partes[0][:2].upper()
    return (partes[0][0] + partes[1][0]).upper()


def codigo_desde_nombre(nombre: str) -> str:
    """Espejo de codigoDesdeNombre() en src/lib/junta/context.tsx."""
    normalizado = unicodedata.normalize("NFD", nombre.upper())
    sin_tildes = "".join(c for c in normalizado if unicodedata.category(c) != "Mn")
    solo_letras = re.sub(r"[^A-Z]", "", sin_tildes)[:6]
    base = solo_letras.ljust(4, "X")
    return f"{base}{date.today().year}"


def hash_simulado() -> str:
    # TODO-ARBITRUM: reemplazar por el hash real de la transacción en
    # Arbitrum (verificable en Arbiscan) una vez el movimiento se ejecute
    # de verdad en el Safe/contrato Stylus.
    return f"0x{secrets.token_hex(2)}…{secrets.token_hex(2)}"
