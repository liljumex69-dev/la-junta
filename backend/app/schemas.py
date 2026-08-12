"""Schemas Pydantic — calzan campo a campo con src/lib/junta/types.ts.

Cada modelo de dominio (Usuario, Asociacion, ConfiguracionAsociacion,
CuotaComerciante, PropuestaGasto, FirmaPropuesta, MovimientoFondo) usa los
mismos nombres de campo que su interfaz TypeScript equivalente. Internamente
se escriben en snake_case (convención Python) pero se serializan a JSON en
camelCase vía `alias_generator`, para que el frontend los consuma sin
remapear nada.
"""

from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field, model_validator
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


Rol = Literal["comerciante", "directivo"]
CargoDirectivo = Literal["presidente", "tesorero", "secretario", "vocal", "otro"]
EstadoCuota = Literal["pagado", "pendiente", "mora"]
EstadoPropuesta = Literal["pendiente", "ejecutada", "rechazada"]
TipoMovimientoFondo = Literal["cuota", "gasto"]


# --- Entidades de dominio (respuestas) ---------------------------------


class Usuario(CamelModel):
    id: str
    nombre: str
    dni: str
    telefono: str
    iniciales: str
    color_avatar: Optional[str] = None
    foto_url: Optional[str] = None
    rol: Rol
    cargo: Optional[CargoDirectivo] = None
    cargo_personalizado: Optional[str] = None
    asociacion_id: Optional[str] = None
    asociaciones_ids: list[str] = Field(default_factory=list)
    numero_puesto: Optional[str] = None
    # Capa 2 — wallet registrada del usuario; los pagos de cuota deben
    # provenir de esta dirección.
    direccion_wallet: Optional[str] = None


class ConfiguracionMora(CamelModel):
    activa: bool
    porcentaje: float
    dias_gracia: int


class ConfiguracionAsociacion(CamelModel):
    umbral_firmas: int
    total_firmantes: int
    mora: ConfiguracionMora
    notificaciones_activas: bool


class DirectivoInicial(CamelModel):
    nombre: str
    cargo: CargoDirectivo
    cargo_personalizado: Optional[str] = None


class Asociacion(CamelModel):
    id: str
    nombre_mercado: str
    numero_puestos: int
    codigo_invitacion: str
    configuracion: ConfiguracionAsociacion
    categorias: list[str]
    directivos_iniciales: list[DirectivoInicial]
    creada_en: str
    # Capa 2 — Safe real desplegado en Arbitrum Sepolia. None si el
    # despliegue no se ha hecho (no debería pasar: crear_asociacion() no
    # guarda la fila si el despliegue falla).
    safe_address: Optional[str] = None
    safe_deploy_tx_hash: Optional[str] = None


class CuotaComerciante(CamelModel):
    id: str
    asociacion_id: str
    comerciante_id: str
    periodo: str
    monto: float
    # None solo en cuotas creadas antes de la Capa 2 — esas ya no se pueden pagar.
    monto_wei: Optional[int] = None
    estado: EstadoCuota
    fecha_pago: Optional[str] = None
    fecha_vencimiento: str


class FirmaPropuesta(CamelModel):
    directivo_id: str
    directivo_nombre: str
    fecha: str


class PropuestaGasto(CamelModel):
    id: str
    asociacion_id: str
    propuesto_por_id: str
    propuesto_por_nombre: str
    monto: float
    motivo: str
    categoria: str
    fecha: str
    firmas: list[FirmaPropuesta]
    umbral_requerido: int
    estado: EstadoPropuesta
    fecha_ejecucion: Optional[str] = None


class MovimientoFondo(CamelModel):
    id: str
    asociacion_id: str
    tipo: TipoMovimientoFondo
    monto: float
    fecha: str
    descripcion: str
    categoria: Optional[str] = None
    referencia_id: str
    hash_simulado: str


# --- Payloads de entrada -------------------------------------------------


class CrearIdentidadPayload(CamelModel):
    nombre: str = Field(min_length=1)
    dni: str = Field(min_length=1)
    telefono: str = Field(min_length=1)
    # Capa 2 — wallet del usuario (opcional al registrarse, pero necesaria
    # para poder pagar cuotas: el pago debe salir de esta dirección).
    direccion_wallet: Optional[str] = Field(
        default=None,
        description="Dirección Ethereum/Arbitrum del usuario, desde la que pagará sus cuotas.",
    )


class CrearAsociacionPayload(CamelModel):
    fundador_id: str = Field(min_length=1)
    nombre_mercado: str = Field(min_length=1)
    numero_puestos: int = Field(gt=0)
    umbral_firmas: int = Field(gt=0)
    cargo: CargoDirectivo
    cargo_personalizado: Optional[str] = None
    directivos_iniciales: list[DirectivoInicial] = Field(default_factory=list)
    mora_activa: bool = False
    mora_porcentaje: float = Field(default=0, ge=0)
    # Capa 2 — una dirección Ethereum/Arbitrum por firmante real del Safe,
    # en el mismo orden que "fundador + directivosIniciales": primero la
    # del fundador, luego la de cada directivo inicial en el orden en que
    # aparecen en la lista. El backend no tiene wallets propias todavía
    # (Usuario no las guarda), así que quien llama el endpoint las provee.
    direcciones_firmantes: list[str] = Field(
        min_length=1,
        description=(
            "Una dirección por firmante, en el mismo orden que "
            "fundador + directivosIniciales."
        ),
    )

    @model_validator(mode="after")
    def _validar_cantidad_direcciones(self) -> "CrearAsociacionPayload":
        esperado = 1 + len(self.directivos_iniciales)
        if len(self.direcciones_firmantes) != esperado:
            raise ValueError(
                f"direccionesFirmantes debe tener exactamente {esperado} "
                "direcciones (1 por el fundador + 1 por cada directivo "
                "inicial, en ese orden) — llegaron "
                f"{len(self.direcciones_firmantes)}."
            )
        return self


class UnirseAsociacionPayload(CamelModel):
    usuario_id: str = Field(min_length=1)
    codigo_invitacion: str = Field(min_length=1)
    numero_puesto: str = Field(min_length=1)


class CrearCuotaPayload(CamelModel):
    """No pedida explícitamente, pero necesaria: sin ella no hay cuota que
    pagar. Ver nota en app/routers/cuotas.py."""

    asociacion_id: str = Field(min_length=1)
    comerciante_id: str = Field(min_length=1)
    periodo: str = Field(min_length=1)
    monto: float = Field(gt=0)
    # Capa 2 — equivalente on-chain de la cuota, congelado al crearla; el
    # pago debe transferir al menos esto (mismo patrón que PropuestaGasto).
    monto_wei: int = Field(
        gt=0, description="Cuánto debe transferir el pago, en wei."
    )
    fecha_vencimiento: str = Field(min_length=1)


class PagarCuotaPayload(CamelModel):
    usuario_id: str = Field(min_length=1)
    # Capa 2 — hash de la transacción real en Arbitrum Sepolia con la que el
    # comerciante pagó, desde SU PROPIA wallet, directo al safeAddress de la
    # asociación. El backend no origina el pago, solo lo verifica on-chain.
    tx_hash: str = Field(
        min_length=1,
        description=(
            "Hash de la transacción real en Arbitrum Sepolia que envió el "
            "pago al Safe de la asociación."
        ),
    )


class ProponerGastoPayload(CamelModel):
    asociacion_id: str = Field(min_length=1)
    propuesto_por_id: str = Field(min_length=1)
    monto: float = Field(gt=0)
    motivo: str = Field(min_length=1)
    categoria: str = Field(min_length=1)
    # Capa 2 — parámetros reales de la transacción a ejecutar en el Safe al
    # llegar al umbral de firmas. `monto` sigue siendo la cifra en soles
    # para mostrar; monto_wei es lo que de verdad se transfiere on-chain
    # (no hay todavía un puente fiat-stablecoin con tasa de cambio real).
    destino_direccion: str = Field(
        min_length=1, description="Wallet que recibe el pago del gasto, on-chain."
    )
    monto_wei: int = Field(
        gt=0, description="Cantidad de ETH de prueba a transferir, en wei."
    )


class FirmarPropuestaPayload(CamelModel):
    directivo_id: str = Field(min_length=1)
    # Capa 2 — firma criptográfica real sobre el safeTxHash de la
    # propuesta (ver GET /propuestas/{id}/hash-para-firmar), en vez de PIN.
    direccion_firmante: str = Field(min_length=1)
    firma: str = Field(
        min_length=1,
        description="Firma de 65 bytes (r+s+v, hex) sobre el safeTxHash, producida con la clave del firmante.",
    )


# --- Respuestas compuestas -----------------------------------------------


class PagarCuotaResponse(CamelModel):
    cuota: CuotaComerciante
    movimiento: MovimientoFondo


class FirmarPropuestaResponse(CamelModel):
    ok: bool
    ejecutada: bool = False
    error: Optional[str] = None
    tx_hash: Optional[str] = None
    propuesta: Optional[PropuestaGasto] = None


class HashParaFirmarResponse(CamelModel):
    """Parámetros congelados de la transacción del Safe para una propuesta,
    más el hash exacto que cada directivo debe firmar."""

    propuesta_id: str
    safe_address: str
    to: str
    value: str  # wei, como string para evitar problemas de precisión numérica
    data: str
    operation: int
    safe_tx_gas: int
    base_gas: int
    gas_price: int
    gas_token: str
    refund_receiver: str
    nonce: int
    safe_tx_hash: str
    owners_pendientes: list[str]
