"""Script para que un directivo firme una propuesta de gasto — Capa 2.

Uso (una sola línea, sin prompts interactivos):

    .venv\\Scripts\\python.exe firmar_propuesta.py <propuestaId> <clavePrivada>

Ejemplo:

    .venv\\Scripts\\python.exe firmar_propuesta.py pg-13a46ffdf6c2 0x620d...

El script consulta GET /propuestas/{id}/hash-para-firmar (no envía nada
tuyo al backend), deriva la dirección de tu clave, te avisa si esa
dirección NO está entre los owners pendientes de firmar, y genera la firma
para pegar en POST /propuestas/{id}/firmar junto con tu directivoId.

SOLO PARA CLAVES DE TESTNET DESCARTABLES: pasar la clave como argumento la
deja en el historial de la terminal y visible en la lista de procesos
mientras corre. Con una clave que custodie fondos reales esto jamás sería
aceptable — ahí lo correcto es getpass o un keystore, nunca un argumento.
"""

import argparse
import json
import urllib.error
import urllib.request

from eth_account import Account

BACKEND_URL = "http://127.0.0.1:8000"


def consultar_hash_para_firmar(propuesta_id: str) -> tuple[str, list[str]]:
    url = f"{BACKEND_URL}/propuestas/{propuesta_id}/hash-para-firmar"
    try:
        with urllib.request.urlopen(url, timeout=10) as resp:
            data = json.load(resp)
    except urllib.error.HTTPError as e:
        raise SystemExit(f"El backend respondió {e.code} para {url}: {e.read().decode(errors='replace')}")
    except Exception as e:
        raise SystemExit(f"No se pudo consultar {url}: {e}")
    return data["safeTxHash"], data["ownersPendientes"]


def main():
    parser = argparse.ArgumentParser(
        description="Genera la firma de un directivo para una propuesta de gasto (solo testnet)."
    )
    parser.add_argument("propuesta_id", help="Id de la propuesta, ej. pg-13a46ffdf6c2")
    parser.add_argument(
        "clave_privada",
        help="Clave privada de testnet del firmante (0x + 64 hex). Queda en el historial de la terminal: solo claves descartables.",
    )
    args = parser.parse_args()

    safe_tx_hash, owners_pendientes = consultar_hash_para_firmar(args.propuesta_id)
    print(f"safeTxHash: {safe_tx_hash}")
    print(f"owners que todavía no firmaron: {owners_pendientes}")

    clave_privada = args.clave_privada.strip()
    print(f"clave leída ({len(clave_privada)} caracteres): {clave_privada}")

    cuenta = Account.from_key(clave_privada)
    hash_bytes = bytes.fromhex(safe_tx_hash.removeprefix("0x"))
    if len(hash_bytes) != 32:
        raise SystemExit(f"safeTxHash debe tener 32 bytes (64 hex), tiene {len(hash_bytes)}.")

    print(f"dirección derivada: {cuenta.address}")
    if cuenta.address not in owners_pendientes:
        print(
            f"\n⚠️  ADVERTENCIA: {cuenta.address} no está en la lista de owners "
            "pendientes de firmar (arriba). O la clave no corresponde a un "
            "owner de este Safe, o ese owner ya firmó. La firma se genera "
            "igual, pero revisa antes de usarla.\n"
        )

    firmado = Account.unsafe_sign_hash(hash_bytes, cuenta.key)
    # HexBytes.hex() en esta versión NO trae el prefijo "0x" — se lo
    # agregamos a mano (mismo fix que ya se hizo en el backend).
    firma_hex = "0x" + firmado.signature.hex()
    assert len(firma_hex) == 132, f"firma con longitud inesperada: {len(firma_hex)}"
    assert len(cuenta.address) == 42, f"dirección con longitud inesperada: {len(cuenta.address)}"

    resultado = (
        f"propuestaId: {args.propuesta_id}\n"
        f"direccionFirmante: {cuenta.address}\n"
        f"  (longitud: {len(cuenta.address)} caracteres -- VERIFICADO 40 hex + 0x)\n"
        f"firma: {firma_hex}\n"
        f"  (longitud: {len(firma_hex)} caracteres -- VERIFICADO 130 hex + 0x)\n"
    )

    print("\n--- Pega esto en POST /propuestas/{id}/firmar ---")
    print(resultado)

    with open("firma_resultado.txt", "w", encoding="utf-8") as f:
        f.write(resultado)
    print("(también guardado en backend/firma_resultado.txt — cópialo de ahí, no de la terminal)")


if __name__ == "__main__":
    main()
