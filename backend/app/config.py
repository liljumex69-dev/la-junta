"""Config del backend — variables de entorno, cargadas desde backend/.env.

La Capa 1 (identidad, asociaciones, cuotas, propuestas) no depende de nada
de este módulo: corre entera sobre SQLite sin ninguna variable de entorno.
Este loader existe para preparar la Capa 2 (Safe Protocol Kit).

DEPLOYER_PRIVATE_KEY es la cuenta que despliega el Safe y firma en nombre
del backend contra Arbitrum Sepolia — nunca se expone en respuestas HTTP ni
en logs. Ver TODO-ARBITRUM en app/routers/ para los puntos donde se usará.
"""

import os
import re
from pathlib import Path

from dotenv import load_dotenv

# Ruta explícita a backend/.env, para que cargue igual sin importar desde
# qué directorio se invoque uvicorn.
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

DEPLOYER_PRIVATE_KEY = os.getenv("DEPLOYER_PRIVATE_KEY") or None
# Normaliza con prefijo "0x": algunos wallets exportan la clave sin él, pero
# el Safe Protocol Kit (ethers.js) lo espera siempre presente.
if DEPLOYER_PRIVATE_KEY and not DEPLOYER_PRIVATE_KEY.startswith("0x"):
    DEPLOYER_PRIVATE_KEY = f"0x{DEPLOYER_PRIVATE_KEY}"

# Orígenes permitidos por CORS (ver app/main.py). Configurable por entorno
# para poder agregar el dominio real de Vercel en producción sin tocar
# código — solo la variable de entorno en el panel de Render. Por defecto,
# los puertos de desarrollo local.
ALLOWED_ORIGINS = [
    origen.strip()
    for origen in os.getenv(
        "ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001"
    ).split(",")
    if origen.strip()
]


def requerir_deployer_private_key() -> str:
    """Usar desde el código de integración Safe: falla explícito y con un
    mensaje claro si falta la clave, o si no tiene el formato correcto, en
    vez de dejar que Protocol Kit reviente más abajo con un error críptico."""
    if not DEPLOYER_PRIVATE_KEY:
        raise RuntimeError(
            "DEPLOYER_PRIVATE_KEY no está definida. Crea backend/.env con "
            "DEPLOYER_PRIVATE_KEY=0x... antes de usar la integración Safe."
        )
    if not re.fullmatch(r"0x[0-9a-fA-F]{64}", DEPLOYER_PRIVATE_KEY):
        raise RuntimeError(
            "DEPLOYER_PRIVATE_KEY tiene un formato inválido: debe ser 0x "
            "seguido de 64 caracteres hexadecimales."
        )
    return DEPLOYER_PRIVATE_KEY
