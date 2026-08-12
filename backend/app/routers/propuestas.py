"""Endpoints de propuestas de gasto: proponer, consultar hash a firmar, y
firmar.

Espejo de `proponerGasto()` y `firmarPropuesta()` en
src/lib/junta/context.tsx, con el TODO-ARBITRUM resuelto: firmar_propuesta
exige una firma criptográfica real de un owner del Safe (recuperada y
verificada contra getOwners() on-chain), no un PIN. Al llegar al umbral, se
ejecuta execTransaction() de verdad — ver app/safe_exec.py.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from web3 import Web3

from .. import models, schemas, serializers
from ..database import get_db
from ..rules import puede_ejecutarse
from ..safe_exec import (
    BASE_GAS,
    GAS_PRICE,
    GAS_TOKEN,
    OPERATION_CALL,
    REFUND_RECEIVER,
    SAFE_TX_GAS,
    ParametrosSafeTx,
    SafeExecError,
    ejecutar_transaccion,
    obtener_owners,
    preparar_transaccion,
    recuperar_firmante,
)
from ..utils import generar_id, hoy_iso

router = APIRouter(prefix="/propuestas", tags=["propuestas"])


@router.post("", response_model=schemas.PropuestaGasto)
def proponer_gasto(
    payload: schemas.ProponerGastoPayload, db: Session = Depends(get_db)
):
    asociacion = db.get(models.Asociacion, payload.asociacion_id)
    if not asociacion:
        raise HTTPException(status_code=404, detail="Asociación no encontrada")
    if not asociacion.safe_address:
        raise HTTPException(
            status_code=400,
            detail="Esta asociación no tiene un Safe desplegado todavía",
        )
    propuesto_por = db.get(models.Usuario, payload.propuesto_por_id)
    if not propuesto_por:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    # Hallazgo crítico de la revisión de seguridad: sin este chequeo,
    # cualquier usuario registrado podía proponer gastos del fondo de una
    # asociación a la que no pertenece.
    if asociacion not in propuesto_por.asociaciones:
        raise HTTPException(
            status_code=403,
            detail="El usuario no pertenece a esta asociación",
        )

    # Congela ahora los parámetros exactos de la transacción del Safe (to,
    # value, nonce) y el hash que los directivos deberán firmar — deben
    # quedar fijos: si cambiaran después, las firmas dejarían de servir.
    try:
        params, safe_tx_hash = preparar_transaccion(
            asociacion.safe_address, payload.destino_direccion, payload.monto_wei
        )
    except SafeExecError as e:
        raise HTTPException(
            status_code=502, detail=f"No se pudo preparar la transacción: {e}"
        )

    propuesta = models.PropuestaGasto(
        id=generar_id("pg"),
        asociacion_id=asociacion.id,
        propuesto_por_id=propuesto_por.id,
        propuesto_por_nombre=propuesto_por.nombre,
        monto=payload.monto,
        motivo=payload.motivo,
        categoria=payload.categoria,
        fecha=hoy_iso(),
        # Umbral vigente al proponer: congelado, no cambia si luego se
        # reconfigura la asociación.
        umbral_requerido=asociacion.umbral_firmas,
        estado="pendiente",
        destino_direccion=params.to,
        monto_wei=params.value,
        safe_nonce=params.nonce,
        safe_tx_hash=safe_tx_hash,
    )
    db.add(propuesta)
    db.commit()
    db.refresh(propuesta)
    return serializers.propuesta_a_schema(propuesta)


@router.get(
    "/{propuesta_id}/hash-para-firmar", response_model=schemas.HashParaFirmarResponse
)
def hash_para_firmar(propuesta_id: str, db: Session = Depends(get_db)):
    propuesta = db.get(models.PropuestaGasto, propuesta_id)
    if not propuesta:
        raise HTTPException(status_code=404, detail="Propuesta no encontrada")
    asociacion = db.get(models.Asociacion, propuesta.asociacion_id)

    try:
        owners = obtener_owners(asociacion.safe_address)
    except SafeExecError as e:
        raise HTTPException(status_code=502, detail=f"No se pudo leer el Safe: {e}")

    ya_firmaron = {f.direccion_firmante for f in propuesta.firmas}
    pendientes = [o for o in owners if o not in ya_firmaron]

    return schemas.HashParaFirmarResponse(
        propuesta_id=propuesta.id,
        safe_address=asociacion.safe_address,
        to=propuesta.destino_direccion,
        value=str(propuesta.monto_wei),
        data="0x",
        operation=OPERATION_CALL,
        safe_tx_gas=SAFE_TX_GAS,
        base_gas=BASE_GAS,
        gas_price=GAS_PRICE,
        gas_token=GAS_TOKEN,
        refund_receiver=REFUND_RECEIVER,
        nonce=propuesta.safe_nonce,
        safe_tx_hash=propuesta.safe_tx_hash,
        owners_pendientes=pendientes,
    )


@router.post("/{propuesta_id}/firmar", response_model=schemas.FirmarPropuestaResponse)
def firmar_propuesta(
    propuesta_id: str,
    payload: schemas.FirmarPropuestaPayload,
    db: Session = Depends(get_db),
):
    propuesta = db.get(models.PropuestaGasto, propuesta_id)
    if not propuesta:
        raise HTTPException(status_code=404, detail="Propuesta no encontrada")
    directivo = db.get(models.Usuario, payload.directivo_id)
    if not directivo:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    asociacion = db.get(models.Asociacion, propuesta.asociacion_id)

    if not Web3.is_address(payload.direccion_firmante):
        return schemas.FirmarPropuestaResponse(
            ok=False,
            error=f"direccionFirmante inválida: {payload.direccion_firmante!r}",
        )
    direccion_declarada = Web3.to_checksum_address(payload.direccion_firmante)

    # Nunca confía en lo que el cliente afirme: recupera quién firmó de
    # verdad a partir de la firma criptográfica.
    try:
        firmante_recuperado = recuperar_firmante(propuesta.safe_tx_hash, payload.firma)
    except SafeExecError as e:
        return schemas.FirmarPropuestaResponse(ok=False, error=str(e))

    if firmante_recuperado != direccion_declarada:
        return schemas.FirmarPropuestaResponse(
            ok=False,
            error=(
                f"La firma no corresponde a {direccion_declarada} "
                f"(se recuperó {firmante_recuperado})."
            ),
        )

    try:
        owners = obtener_owners(asociacion.safe_address)
    except SafeExecError as e:
        raise HTTPException(status_code=502, detail=f"No se pudo leer el Safe: {e}")
    if direccion_declarada not in owners:
        return schemas.FirmarPropuestaResponse(
            ok=False,
            error=f"{direccion_declarada} no es firmante (owner) real de este Safe.",
        )

    ya_firmo = any(
        f.direccion_firmante == direccion_declarada for f in propuesta.firmas
    )
    if propuesta.estado != "pendiente" or ya_firmo:
        # No-op silencioso: mismo comportamiento que el frontend cuando la
        # propuesta ya no está pendiente o este owner ya firmó antes.
        return schemas.FirmarPropuestaResponse(
            ok=True,
            ejecutada=False,
            propuesta=serializers.propuesta_a_schema(propuesta),
        )

    # La firma ya está criptográficamente verificada — se guarda pase lo
    # que pase después con el intento de ejecución.
    fecha = hoy_iso()
    propuesta.firmas.append(
        models.FirmaPropuesta(
            directivo_id=directivo.id,
            directivo_nombre=directivo.nombre,
            fecha=fecha,
            direccion_firmante=direccion_declarada,
            firma=payload.firma,
        )
    )
    db.commit()
    db.refresh(propuesta)

    if not puede_ejecutarse(len(propuesta.firmas), propuesta.umbral_requerido):
        return schemas.FirmarPropuestaResponse(
            ok=True,
            ejecutada=False,
            propuesta=serializers.propuesta_a_schema(propuesta),
        )

    params = ParametrosSafeTx(
        to=propuesta.destino_direccion,
        value=propuesta.monto_wei,
        data=b"",
        operation=OPERATION_CALL,
        safe_tx_gas=SAFE_TX_GAS,
        base_gas=BASE_GAS,
        gas_price=GAS_PRICE,
        gas_token=GAS_TOKEN,
        refund_receiver=REFUND_RECEIVER,
        nonce=propuesta.safe_nonce,
    )
    firmas_por_direccion = {
        f.direccion_firmante: bytes.fromhex(f.firma.removeprefix("0x"))
        for f in propuesta.firmas
    }
    try:
        resultado = ejecutar_transaccion(
            asociacion.safe_address, params, firmas_por_direccion
        )
    except SafeExecError as e:
        # La firma que acaba de llegar ya quedó guardada (commit arriba);
        # solo falló el intento de ejecución. Por ahora no hay un endpoint
        # para reintentar la ejecución sin pedir una firma nueva.
        raise HTTPException(
            status_code=502,
            detail=(
                f"Tu firma quedó registrada, pero no se pudo ejecutar la "
                f"transacción todavía: {e}"
            ),
        )

    propuesta.estado = "ejecutada"
    propuesta.fecha_ejecucion = hoy_iso()
    db.add(
        models.MovimientoFondo(
            id=generar_id("mf"),
            asociacion_id=propuesta.asociacion_id,
            tipo="gasto",
            monto=propuesta.monto,
            fecha=propuesta.fecha_ejecucion,
            descripcion=propuesta.motivo,
            categoria=propuesta.categoria,
            referencia_id=propuesta.id,
            hash_simulado=resultado.tx_hash,
        )
    )
    db.commit()
    db.refresh(propuesta)
    return schemas.FirmarPropuestaResponse(
        ok=True,
        ejecutada=True,
        tx_hash=resultado.tx_hash,
        propuesta=serializers.propuesta_a_schema(propuesta),
    )
