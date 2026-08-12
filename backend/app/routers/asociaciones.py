"""Endpoints de asociación: crear, unirse con código, listar movimientos.

Espejo de `crearAsociacion`, `unirseAsociacion` y `buscarAsociacionPorCodigo`
en src/lib/junta/context.tsx.
"""

import secrets

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas, serializers
from ..database import get_db
from ..safe_deploy import SafeDeploymentError, desplegar_safe
from ..utils import codigo_desde_nombre, generar_id, hoy_iso

router = APIRouter(prefix="/asociaciones", tags=["asociaciones"])

CATEGORIAS_POR_DEFECTO = ["Seguridad", "Mantenimiento", "Mejoras", "Otras"]


def _obtener_usuario_o_404(db: Session, usuario_id: str) -> models.Usuario:
    usuario = db.get(models.Usuario, usuario_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario


def _generar_codigo_unico(db: Session, nombre_mercado: str) -> str:
    """codigo_desde_nombre() es determinístico (mismo mercado + año => mismo
    código); a diferencia del prototipo de frontend, aquí sí persiste entre
    asociaciones, así que se reintenta con un sufijo random ante colisión."""
    codigo = codigo_desde_nombre(nombre_mercado)
    intentos = 0
    while db.query(models.Asociacion).filter_by(codigo_invitacion=codigo).first():
        intentos += 1
        if intentos > 5:
            raise HTTPException(
                status_code=500,
                detail="No se pudo generar un código de invitación único",
            )
        codigo = f"{codigo[:4]}{secrets.token_hex(2).upper()}"
    return codigo


@router.post("", response_model=schemas.Asociacion)
def crear_asociacion(
    payload: schemas.CrearAsociacionPayload, db: Session = Depends(get_db)
):
    fundador = _obtener_usuario_o_404(db, payload.fundador_id)

    # El fundador es un firmante más, sin poder especial sobre los demás —
    # el total de firmantes es él más el directorio que acaba de nombrar.
    total_firmantes = 1 + len(payload.directivos_iniciales)
    umbral_firmas = min(payload.umbral_firmas, total_firmantes)

    # Despliegue real del Safe en Arbitrum Sepolia, ANTES de tocar la base:
    # si esto falla, no debe quedar ninguna asociación a medias guardada.
    # direcciones_firmantes ya viene validado (mismo largo que
    # total_firmantes) por CrearAsociacionPayload.
    try:
        resultado_safe = desplegar_safe(
            owners=payload.direcciones_firmantes, threshold=umbral_firmas
        )
    except SafeDeploymentError as e:
        raise HTTPException(
            status_code=502, detail=f"No se pudo desplegar el Safe: {e}"
        )

    nueva = models.Asociacion(
        id=generar_id("a"),
        nombre_mercado=payload.nombre_mercado.strip(),
        numero_puestos=payload.numero_puestos,
        codigo_invitacion=_generar_codigo_unico(db, payload.nombre_mercado),
        umbral_firmas=umbral_firmas,
        total_firmantes=total_firmantes,
        mora_activa=payload.mora_activa,
        mora_porcentaje=payload.mora_porcentaje,
        mora_dias_gracia=5,
        notificaciones_activas=True,
        categorias=list(CATEGORIAS_POR_DEFECTO),
        directivos_iniciales=[
            d.model_dump(mode="json") for d in payload.directivos_iniciales
        ],
        creada_en=hoy_iso(),
        safe_address=resultado_safe.safe_address,
        safe_deploy_tx_hash=resultado_safe.tx_hash,
    )
    db.add(nueva)

    fundador.asociacion_id = nueva.id
    fundador.rol = "directivo"
    fundador.cargo = payload.cargo
    fundador.cargo_personalizado = payload.cargo_personalizado
    fundador.asociaciones.append(nueva)

    db.commit()
    db.refresh(nueva)
    return serializers.asociacion_a_schema(nueva)


@router.post("/unirse", response_model=schemas.Asociacion)
def unirse_asociacion(
    payload: schemas.UnirseAsociacionPayload, db: Session = Depends(get_db)
):
    usuario = _obtener_usuario_o_404(db, payload.usuario_id)

    codigo = payload.codigo_invitacion.strip().upper()
    asociacion = (
        db.query(models.Asociacion)
        .filter(models.Asociacion.codigo_invitacion == codigo)
        .first()
    )
    if not asociacion:
        raise HTTPException(
            status_code=404,
            detail="No existe ninguna asociación con ese código de invitación",
        )

    # TODO-ARBITRUM: registrar al comerciante como beneficiario del fondo
    # de esta asociación en el Safe correspondiente.
    usuario.asociacion_id = asociacion.id
    usuario.numero_puesto = payload.numero_puesto
    usuario.rol = "comerciante"
    if asociacion not in usuario.asociaciones:
        usuario.asociaciones.append(asociacion)

    db.commit()
    db.refresh(asociacion)
    return serializers.asociacion_a_schema(asociacion)


@router.get("/{asociacion_id}/movimientos", response_model=list[schemas.MovimientoFondo])
def listar_movimientos(asociacion_id: str, db: Session = Depends(get_db)):
    if not db.get(models.Asociacion, asociacion_id):
        raise HTTPException(status_code=404, detail="Asociación no encontrada")

    # TODO-ARBITRUM: leer estos movimientos desde los eventos indexables
    # del Safe/contrato Stylus en Arbitrum (verificables en Arbiscan) en
    # vez de la tabla local, una vez exista la integración on-chain.
    movimientos = (
        db.query(models.MovimientoFondo)
        .filter(models.MovimientoFondo.asociacion_id == asociacion_id)
        .order_by(models.MovimientoFondo.fecha.desc())
        .all()
    )
    return [serializers.movimiento_a_schema(m) for m in movimientos]
