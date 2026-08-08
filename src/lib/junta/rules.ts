import type {
  Asociacion,
  ConfiguracionMora,
  CuotaComerciante,
  MovimientoFondo,
  PropuestaGasto,
  Usuario,
} from "./types";

/**
 * Reglas de negocio de Junta.
 *
 * Todos los cálculos aquí son una SIMULACIÓN local para el prototipo de interfaz.
 * En el producto real, el saldo del fondo y la ejecución de propuestas los determina
 * el Safe multifirma y el contrato Stylus — son la única fuente de verdad. Se
 * mantienen aquí para que las pantallas muestren números coherentes entre sí y el
 * equipo de blockchain vea exactamente qué espera la interfaz de cada función.
 */

export function esDirectivo(usuario: Usuario | null): boolean {
  return usuario?.rol === "directivo";
}

/** Saldo actual del fondo: cuotas pagadas menos gastos ejecutados. */
export function calcularSaldoFondo(movimientos: MovimientoFondo[]): number {
  // TODO: conectar a Safe/smart contract — leer el balance real del Safe de la
  // asociación en Arbitrum en vez de sumar movimientos simulados.
  return movimientos.reduce(
    (saldo, m) => saldo + (m.tipo === "cuota" ? m.monto : -m.monto),
    0
  );
}

export function totalIngresos(movimientos: MovimientoFondo[]): number {
  return movimientos
    .filter((m) => m.tipo === "cuota")
    .reduce((s, m) => s + m.monto, 0);
}

export function totalGastos(movimientos: MovimientoFondo[]): number {
  return movimientos
    .filter((m) => m.tipo === "gasto")
    .reduce((s, m) => s + m.monto, 0);
}

/** Desglose de gastos ejecutados por categoría, para el dashboard del directivo. */
export function gastosPorCategoria(
  movimientos: MovimientoFondo[]
): { categoria: string; monto: number }[] {
  const mapa = new Map<string, number>();
  for (const m of movimientos) {
    if (m.tipo !== "gasto" || !m.categoria) continue;
    mapa.set(m.categoria, (mapa.get(m.categoria) ?? 0) + m.monto);
  }
  return Array.from(mapa.entries())
    .map(([categoria, monto]) => ({ categoria, monto }))
    .sort((a, b) => b.monto - a.monto);
}

/** Cuánto falta para completar el umbral de firmas de una propuesta. */
export function firmasFaltantes(propuesta: PropuestaGasto): number {
  return Math.max(0, propuesta.umbralRequerido - propuesta.firmas.length);
}

export function puedeEjecutarse(propuesta: PropuestaGasto): boolean {
  return propuesta.firmas.length >= propuesta.umbralRequerido;
}

export function yaFirmo(propuesta: PropuestaGasto, usuarioId: string): boolean {
  return propuesta.firmas.some((f) => f.directivoId === usuarioId);
}

/** Texto legible del umbral, ej. "3 de 5". */
export function formatoUmbral(asociacion: Asociacion): string {
  return `${asociacion.configuracion.umbralFirmas} de ${asociacion.configuracion.totalFirmantes}`;
}

/**
 * Recargo por mora sobre una cuota vencida, si la asociación tiene la mora activa.
 * Cada asociación decide su propia tasa — nunca una regla fija de la plataforma.
 */
export function calcularRecargoMora(
  cuota: CuotaComerciante,
  mora: ConfiguracionMora
): number {
  if (!mora.activa || cuota.estado !== "mora") return 0;
  return Math.round(cuota.monto * (mora.porcentaje / 100) * 100) / 100;
}

export function montoTotalConMora(
  cuota: CuotaComerciante,
  mora: ConfiguracionMora
): number {
  return cuota.monto + calcularRecargoMora(cuota, mora);
}

/** Porcentaje de puestos con cuotas al día, para el dashboard del directivo. */
export function tasaDeCumplimiento(cuotas: CuotaComerciante[]): number {
  if (cuotas.length === 0) return 100;
  const alDia = cuotas.filter((c) => c.estado === "pagado").length;
  return Math.round((alDia / cuotas.length) * 100);
}

export const CATEGORIAS_GASTO_SUGERIDAS = [
  "Seguridad",
  "Mantenimiento",
  "Mejoras",
  "Otras",
];

export const CATEGORIAS_AHORRO_SUGERIDAS = [
  "Salud",
  "Capital de trabajo",
  "Familia",
  "Otros",
];
