"""Modelos ORM (SQLAlchemy) de Junta — Capa 1.

Reflejan uno a uno las entidades de src/lib/junta/types.ts (frontend). Los
objetos anidados del dominio (ConfiguracionAsociacion, ConfiguracionMora) se
guardan aplanados en columnas propias porque SQLite no tiene tipos
compuestos nativos; se reconstruyen como objetos anidados al serializar
hacia la API en app/serializers.py, de modo que la respuesta HTTP sí calce
exactamente con los tipos del frontend.
"""

from sqlalchemy import JSON, Boolean, Column, Float, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship

from .database import Base

# Un usuario puede pertenecer a varias asociaciones (Usuario.asociacionesIds
# en el frontend); solo una es la activa (Usuario.asociacionId).
usuario_asociacion = Table(
    "usuario_asociacion",
    Base.metadata,
    Column("usuario_id", String, ForeignKey("usuarios.id"), primary_key=True),
    Column("asociacion_id", String, ForeignKey("asociaciones.id"), primary_key=True),
)


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(String, primary_key=True)
    nombre = Column(String, nullable=False)
    dni = Column(String, nullable=False)
    telefono = Column(String, nullable=False, unique=True, index=True)
    iniciales = Column(String, nullable=False)
    color_avatar = Column(String, nullable=True)
    foto_url = Column(String, nullable=True)
    rol = Column(String, nullable=False, default="comerciante")
    cargo = Column(String, nullable=True)
    cargo_personalizado = Column(String, nullable=True)
    # Asociación activa. Nullable: un comerciante recién registrado aún no
    # se unió a ninguna.
    asociacion_id = Column(String, ForeignKey("asociaciones.id"), nullable=True)
    numero_puesto = Column(String, nullable=True)
    # Capa 2 — wallet del usuario, usada para verificar que el remitente de
    # un pago de cuota sea realmente el comerciante que la debe (checksum
    # EIP-55). Nullable: sin wallet registrada no se pueden verificar pagos.
    # UNIQUE: una wallet no puede pertenecer a dos usuarios.
    direccion_wallet = Column(String, nullable=True, unique=True)

    asociaciones = relationship(
        "Asociacion", secondary=usuario_asociacion, back_populates="miembros"
    )


class Asociacion(Base):
    __tablename__ = "asociaciones"

    id = Column(String, primary_key=True)
    nombre_mercado = Column(String, nullable=False)
    numero_puestos = Column(Integer, nullable=False)
    codigo_invitacion = Column(String, nullable=False, unique=True, index=True)

    # --- ConfiguracionAsociacion, aplanada ---
    umbral_firmas = Column(Integer, nullable=False)
    total_firmantes = Column(Integer, nullable=False)
    mora_activa = Column(Boolean, nullable=False, default=False)
    mora_porcentaje = Column(Float, nullable=False, default=0)
    mora_dias_gracia = Column(Integer, nullable=False, default=5)
    notificaciones_activas = Column(Boolean, nullable=False, default=True)

    categorias = Column(JSON, nullable=False, default=list)
    # Lista de dicts {nombre, cargo, cargoPersonalizado}: solo texto
    # informativo hasta que cada directivo tenga su propio registro (ver
    # DirectivoInicial en types.ts).
    directivos_iniciales = Column(JSON, nullable=False, default=list)
    creada_en = Column(String, nullable=False)

    # Capa 2 — Safe real desplegado en Arbitrum Sepolia (ver app/safe_deploy.py).
    # Nullable porque nada más los crea todavía: cada asociación queda con su
    # Safe en el momento de fundarse, no después.
    safe_address = Column(String, nullable=True)
    safe_deploy_tx_hash = Column(String, nullable=True)

    miembros = relationship(
        "Usuario", secondary=usuario_asociacion, back_populates="asociaciones"
    )


class CuotaComerciante(Base):
    __tablename__ = "cuotas_comerciante"

    id = Column(String, primary_key=True)
    asociacion_id = Column(String, ForeignKey("asociaciones.id"), nullable=False, index=True)
    comerciante_id = Column(String, ForeignKey("usuarios.id"), nullable=False, index=True)
    periodo = Column(String, nullable=False)
    monto = Column(Float, nullable=False)
    # Capa 2 — cuánto vale esta cuota en wei, congelado al crearla (mismo
    # patrón que PropuestaGasto.monto_wei): `monto` sigue siendo la cifra en
    # soles para mostrar; no hay puente fiat-stablecoin con tasa real, así
    # que el equivalente on-chain se fija explícitamente. Nullable solo por
    # compatibilidad con cuotas creadas antes de este campo — esas ya no se
    # pueden pagar (el endpoint las rechaza con mensaje claro).
    monto_wei = Column(Integer, nullable=True)
    estado = Column(String, nullable=False, default="pendiente")
    fecha_pago = Column(String, nullable=True)
    fecha_vencimiento = Column(String, nullable=False)


class PropuestaGasto(Base):
    __tablename__ = "propuestas_gasto"

    id = Column(String, primary_key=True)
    asociacion_id = Column(String, ForeignKey("asociaciones.id"), nullable=False, index=True)
    propuesto_por_id = Column(String, ForeignKey("usuarios.id"), nullable=False)
    propuesto_por_nombre = Column(String, nullable=False)
    monto = Column(Float, nullable=False)
    motivo = Column(String, nullable=False)
    categoria = Column(String, nullable=False)
    fecha = Column(String, nullable=False)
    # Umbral vigente al momento de proponer — congelado, no se recalcula si
    # luego se reconfigura la asociación.
    umbral_requerido = Column(Integer, nullable=False)
    estado = Column(String, nullable=False, default="pendiente")
    fecha_ejecucion = Column(String, nullable=True)

    # Capa 2 — parámetros de la transacción real del Safe, congelados al
    # proponer (ver app/safe_exec.py). Deben quedar fijos: si cambiaran
    # después, el hash que los directivos firmaron dejaría de coincidir con
    # lo que se ejecuta.
    destino_direccion = Column(String, nullable=False)
    monto_wei = Column(Integer, nullable=False)
    safe_nonce = Column(Integer, nullable=False)
    safe_tx_hash = Column(String, nullable=False)

    firmas = relationship(
        "FirmaPropuesta", back_populates="propuesta", cascade="all, delete-orphan"
    )


class FirmaPropuesta(Base):
    __tablename__ = "firmas_propuesta"

    id = Column(Integer, primary_key=True, autoincrement=True)
    propuesta_id = Column(String, ForeignKey("propuestas_gasto.id"), nullable=False, index=True)
    directivo_id = Column(String, ForeignKey("usuarios.id"), nullable=False)
    directivo_nombre = Column(String, nullable=False)
    fecha = Column(String, nullable=False)

    # Capa 2 — prueba criptográfica real. direccion_firmante es el owner
    # recuperado de `firma` vía ecrecover, no un dato que el cliente afirme
    # sin verificar (ver recuperar_firmante() en app/safe_exec.py).
    direccion_firmante = Column(String, nullable=False)
    firma = Column(String, nullable=False)

    propuesta = relationship("PropuestaGasto", back_populates="firmas")


class MovimientoFondo(Base):
    __tablename__ = "movimientos_fondo"

    id = Column(String, primary_key=True)
    asociacion_id = Column(String, ForeignKey("asociaciones.id"), nullable=False, index=True)
    tipo = Column(String, nullable=False)  # "cuota" | "gasto"
    monto = Column(Float, nullable=False)
    fecha = Column(String, nullable=False)
    descripcion = Column(String, nullable=False)
    categoria = Column(String, nullable=True)
    referencia_id = Column(String, nullable=False)
    # Hash real de la transacción en Arbitrum (los flujos de pago y gasto ya
    # lo llenan con hashes verificables en Arbiscan; el nombre quedó de la
    # Capa 1). UNIQUE + siempre en minúsculas (ver normalizar_tx_hash):
    # cierra tanto el reuso del mismo pago con distinto casing como la
    # ventana de carrera de dos requests simultáneos con el mismo hash.
    hash_simulado = Column(String, nullable=False, unique=True)
