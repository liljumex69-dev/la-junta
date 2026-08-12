"""Endpoints de cuotas: crear (soporte necesario para poder pagar) y pagar.

`pagar_cuota` es espejo de `pagarCuota()` en src/lib/junta/context.tsx, con
el TODO-ARBITRUM resuelto y endurecido tras la revisión de seguridad: el
comerciante paga con su wallet REGISTRADA directo al Safe de la asociación,
y este endpoint verifica on-chain (app/pago_verificacion.py) que el pago
llegó, que lo envió esa wallet, y que cubre el montoWei de la cuota. No
origina ninguna transacción ni mueve fondos.

`crear_cuota` no está en el pedido original, pero es necesaria: el frontend
parte de cuotas ya sembradas (CUOTAS_SEED) y esta Capa 1 todavía no tiene un
proceso que las genere mensualmente por comerciante.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas, serializers
from ..database import get_db
from ..pago_verificacion import (
    VerificacionPagoError,
    normalizar_tx_hash,
    verificar_pago,
)
from ..utils import generar_id, hoy_iso

router = APIRouter(prefix="/cuotas", tags=["cuotas"])


@router.post("", response_model=schemas.CuotaComerciante)
def crear_cuota(payload: schemas.CrearCuotaPayload, db: Session = Depends(get_db)):
    if not db.get(models.Asociacion, payload.asociacion_id):
        raise HTTPException(status_code=404, detail="Asociación no encontrada")
    if not db.get(models.Usuario, payload.comerciante_id):
        raise HTTPException(status_code=404, detail="Comerciante no encontrado")

    cuota = models.CuotaComerciante(
        id=generar_id("cc"),
        asociacion_id=payload.asociacion_id,
        comerciante_id=payload.comerciante_id,
        periodo=payload.periodo,
        monto=payload.monto,
        monto_wei=payload.monto_wei,
        estado="pendiente",
        fecha_vencimiento=payload.fecha_vencimiento,
    )
    db.add(cuota)
    db.commit()
    db.refresh(cuota)
    return serializers.cuota_a_schema(cuota)


@router.post("/{cuota_id}/pagar", response_model=schemas.PagarCuotaResponse)
def pagar_cuota(
    cuota_id: str, payload: schemas.PagarCuotaPayload, db: Session = Depends(get_db)
):
    cuota = db.get(models.CuotaComerciante, cuota_id)
    if not cuota:
        raise HTTPException(status_code=404, detail="Cuota no encontrada")
    if cuota.estado == "pagado":
        raise HTTPException(status_code=400, detail="Esta cuota ya está pagada")

    usuario = db.get(models.Usuario, payload.usuario_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    asociacion = db.get(models.Asociacion, cuota.asociacion_id)
    if not asociacion or not asociacion.safe_address:
        raise HTTPException(
            status_code=400,
            detail="Esta asociación no tiene un Safe desplegado todavía",
        )

    # El crédito del pago es para el dueño de la cuota: el remitente debe
    # ser SU wallet registrada, no la de quien llama al endpoint.
    comerciante = db.get(models.Usuario, cuota.comerciante_id)
    if not comerciante or not comerciante.direccion_wallet:
        raise HTTPException(
            status_code=400,
            detail=(
                "El comerciante de esta cuota no tiene una wallet registrada. "
                "Regístrala vía POST /identidad (direccionWallet) antes de pagar."
            ),
        )

    if cuota.monto_wei is None:
        raise HTTPException(
            status_code=400,
            detail=(
                "Esta cuota fue creada antes de que existiera montoWei y ya "
                "no puede pagarse — créala de nuevo con montoWei."
            ),
        )

    # Forma canónica ANTES del chequeo de reuso: '0xAB…' y '0xab…' son el
    # mismo pago. El índice UNIQUE en la base cierra además la ventana de
    # carrera de dos requests simultáneos.
    try:
        tx_hash = normalizar_tx_hash(payload.tx_hash)
    except VerificacionPagoError as e:
        raise HTTPException(status_code=400, detail=str(e))

    ya_usado = (
        db.query(models.MovimientoFondo).filter_by(hash_simulado=tx_hash).first()
    )
    if ya_usado:
        raise HTTPException(
            status_code=400,
            detail="Esta transacción ya se usó para registrar otro movimiento",
        )

    try:
        verificar_pago(
            tx_hash,
            asociacion.safe_address,
            monto_minimo_wei=cuota.monto_wei,
            direccion_pagador=comerciante.direccion_wallet,
        )
    except VerificacionPagoError as e:
        raise HTTPException(
            status_code=400, detail=f"No se pudo verificar el pago: {e}"
        )

    fecha = hoy_iso()
    cuota.estado = "pagado"
    cuota.fecha_pago = fecha

    movimiento = models.MovimientoFondo(
        id=generar_id("mf"),
        asociacion_id=cuota.asociacion_id,
        tipo="cuota",
        monto=cuota.monto,
        fecha=fecha,
        descripcion=f"Cuota {cuota.periodo} — Puesto {comerciante.numero_puesto or '?'}",
        referencia_id=comerciante.id,
        # Hash real del pago, verificado on-chain y en forma canónica.
        hash_simulado=tx_hash,
    )
    db.add(movimiento)
    db.commit()
    db.refresh(cuota)
    db.refresh(movimiento)

    return schemas.PagarCuotaResponse(
        cuota=serializers.cuota_a_schema(cuota),
        movimiento=serializers.movimiento_a_schema(movimiento),
    )
