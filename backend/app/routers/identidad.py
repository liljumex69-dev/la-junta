"""POST /identidad — crear identidad de usuario.

Espejo de `registrar()` en src/lib/junta/context.tsx: si ya existe un
usuario con ese teléfono, lo devuelve tal cual en vez de duplicarlo — con
una extensión de Capa 2: si el usuario existente aún no tiene wallet y el
payload trae una, se la vincula en ese momento (permite completar la wallet
de usuarios creados antes de este campo, sin endpoint nuevo).

La wallet registrada es contra la que se verifica el REMITENTE de los pagos
de cuota (ver app/pago_verificacion.py). Vincularla al registro es
confianza-en-el-registro: suficiente para la Capa 2 de demo; en producción
la vinculación requeriría prueba de control de la wallet (firma de un
mensaje de desafío).
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from web3 import Web3

from .. import models, schemas, serializers
from ..database import get_db
from ..utils import generar_id, generar_iniciales, limpiar_telefono

router = APIRouter(prefix="/identidad", tags=["identidad"])


def _validar_wallet(db: Session, direccion: str, usuario_id_actual: str | None) -> str:
    if not Web3.is_address(direccion):
        raise HTTPException(
            status_code=422, detail=f"direccionWallet inválida: {direccion!r}"
        )
    checksum = Web3.to_checksum_address(direccion)
    dueno = (
        db.query(models.Usuario)
        .filter(models.Usuario.direccion_wallet == checksum)
        .first()
    )
    if dueno and dueno.id != usuario_id_actual:
        raise HTTPException(
            status_code=409,
            detail="Esa wallet ya está vinculada a otro usuario.",
        )
    return checksum


@router.post("", response_model=schemas.Usuario)
def crear_identidad(
    payload: schemas.CrearIdentidadPayload, db: Session = Depends(get_db)
):
    telefono_limpio = limpiar_telefono(payload.telefono)

    existente = (
        db.query(models.Usuario)
        .filter(models.Usuario.telefono == telefono_limpio)
        .first()
    )
    if existente:
        # Vinculación tardía: completa la wallet de un usuario pre-Capa 2,
        # pero nunca sobreescribe una ya registrada (cambiarla requeriría
        # prueba de control, no un simple re-registro por teléfono).
        if payload.direccion_wallet and not existente.direccion_wallet:
            existente.direccion_wallet = _validar_wallet(
                db, payload.direccion_wallet, existente.id
            )
            db.commit()
            db.refresh(existente)
        return serializers.usuario_a_schema(existente)

    wallet = (
        _validar_wallet(db, payload.direccion_wallet, None)
        if payload.direccion_wallet
        else None
    )

    # TODO-ARBITRUM: crear en segundo plano el firmante o beneficiario
    # correspondiente en el Safe cuando este usuario se una a una
    # asociación. Nunca se expone clave privada ni frase semilla desde
    # este backend.
    nuevo = models.Usuario(
        id=generar_id("u"),
        nombre=payload.nombre.strip(),
        dni=payload.dni.strip(),
        telefono=telefono_limpio,
        iniciales=generar_iniciales(payload.nombre),
        rol="comerciante",
        direccion_wallet=wallet,
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return serializers.usuario_a_schema(nuevo)
