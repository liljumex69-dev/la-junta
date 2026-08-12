"""Junta API — Capa 1.

Backend en FastAPI con la lógica de negocio real de Junta (identidad,
asociaciones, cuotas, propuestas de gasto y movimientos del fondo) sobre
SQLite, SIN integración con Arbitrum/Safe todavía. Los schemas de
app/schemas.py calzan campo a campo con los tipos de src/lib/junta/types.ts
(frontend) para que ambos lados compartan el mismo modelo de dominio.

Cada punto donde en producción se conectaría un Safe multifirma real está
marcado con `TODO-ARBITRUM` (ver app/routers/*.py y app/utils.py) — a
propósito no están implementados aquí: eso es la "Capa 2" de este proyecto.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import ALLOWED_ORIGINS
from .database import Base, engine
from .routers import asociaciones, cuotas, identidad, propuestas

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Junta API — Capa 1", version="0.1.0")

# CORS: orígenes configurables vía la variable de entorno ALLOWED_ORIGINS
# (ver app/config.py) — en Render, agregar ahí el dominio real de Vercel,
# separado por comas si hace falta más de uno. Sin esa variable, cae en los
# puertos de desarrollo local.
#
# PENDIENTE-PRODUCCIÓN: /docs y /openapi.json quedan públicos por defecto —
# protegerlos con autenticación o deshabilitarlos (docs_url=None,
# openapi_url=None) antes de un uso real más allá de la demo del hackathon.
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(identidad.router)
app.include_router(asociaciones.router)
app.include_router(cuotas.router)
app.include_router(propuestas.router)


@app.get("/salud", tags=["salud"])
def salud():
    return {"estado": "ok"}
