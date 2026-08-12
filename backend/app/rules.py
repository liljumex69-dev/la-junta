"""Reglas de negocio — espejo de src/lib/junta/rules.ts.

Igual que en el frontend, esta es la única lógica real de la Capa 1: decide
cuándo una propuesta alcanza su umbral de firmas. Se mantiene sin
dependencias de FastAPI/SQLAlchemy para poder probarse aislada.
"""


def puede_ejecutarse(num_firmas: int, umbral_requerido: int) -> bool:
    return num_firmas >= umbral_requerido


def firmas_faltantes(num_firmas: int, umbral_requerido: int) -> int:
    return max(0, umbral_requerido - num_firmas)


def calcular_recargo_mora(
    monto: float, estado: str, mora_activa: bool, mora_porcentaje: float
) -> float:
    """Recargo por mora, solo si la asociación la tiene activa. Cada
    asociación decide su propia tasa — nunca una regla fija de la plataforma."""
    if not mora_activa or estado != "mora":
        return 0.0
    return round(monto * (mora_porcentaje / 100), 2)
