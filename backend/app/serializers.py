"""Convierte modelos ORM (columnas planas) en los schemas de app/schemas.py,
reconstruyendo los objetos anidados (ConfiguracionAsociacion, firmas) que sí
exige el tipo del frontend.
"""

from . import models, schemas


def usuario_a_schema(u: models.Usuario) -> schemas.Usuario:
    return schemas.Usuario(
        id=u.id,
        nombre=u.nombre,
        dni=u.dni,
        telefono=u.telefono,
        iniciales=u.iniciales,
        color_avatar=u.color_avatar,
        foto_url=u.foto_url,
        rol=u.rol,
        cargo=u.cargo,
        cargo_personalizado=u.cargo_personalizado,
        asociacion_id=u.asociacion_id,
        asociaciones_ids=[a.id for a in u.asociaciones],
        numero_puesto=u.numero_puesto,
        direccion_wallet=u.direccion_wallet,
    )


def asociacion_a_schema(a: models.Asociacion) -> schemas.Asociacion:
    return schemas.Asociacion(
        id=a.id,
        nombre_mercado=a.nombre_mercado,
        numero_puestos=a.numero_puestos,
        codigo_invitacion=a.codigo_invitacion,
        configuracion=schemas.ConfiguracionAsociacion(
            umbral_firmas=a.umbral_firmas,
            total_firmantes=a.total_firmantes,
            mora=schemas.ConfiguracionMora(
                activa=a.mora_activa,
                porcentaje=a.mora_porcentaje,
                dias_gracia=a.mora_dias_gracia,
            ),
            notificaciones_activas=a.notificaciones_activas,
        ),
        categorias=list(a.categorias),
        directivos_iniciales=[
            schemas.DirectivoInicial(**d) for d in a.directivos_iniciales
        ],
        creada_en=a.creada_en,
        safe_address=a.safe_address,
        safe_deploy_tx_hash=a.safe_deploy_tx_hash,
    )


def cuota_a_schema(c: models.CuotaComerciante) -> schemas.CuotaComerciante:
    return schemas.CuotaComerciante(
        id=c.id,
        asociacion_id=c.asociacion_id,
        comerciante_id=c.comerciante_id,
        periodo=c.periodo,
        monto=c.monto,
        monto_wei=c.monto_wei,
        estado=c.estado,
        fecha_pago=c.fecha_pago,
        fecha_vencimiento=c.fecha_vencimiento,
    )


def propuesta_a_schema(p: models.PropuestaGasto) -> schemas.PropuestaGasto:
    return schemas.PropuestaGasto(
        id=p.id,
        asociacion_id=p.asociacion_id,
        propuesto_por_id=p.propuesto_por_id,
        propuesto_por_nombre=p.propuesto_por_nombre,
        monto=p.monto,
        motivo=p.motivo,
        categoria=p.categoria,
        fecha=p.fecha,
        firmas=[
            schemas.FirmaPropuesta(
                directivo_id=f.directivo_id,
                directivo_nombre=f.directivo_nombre,
                fecha=f.fecha,
            )
            for f in p.firmas
        ],
        umbral_requerido=p.umbral_requerido,
        estado=p.estado,
        fecha_ejecucion=p.fecha_ejecucion,
    )


def movimiento_a_schema(m: models.MovimientoFondo) -> schemas.MovimientoFondo:
    return schemas.MovimientoFondo(
        id=m.id,
        asociacion_id=m.asociacion_id,
        tipo=m.tipo,
        monto=m.monto,
        fecha=m.fecha,
        descripcion=m.descripcion,
        categoria=m.categoria,
        referencia_id=m.referencia_id,
        hash_simulado=m.hash_simulado,
    )
