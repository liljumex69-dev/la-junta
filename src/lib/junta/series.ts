import type { MovimientoAhorro, MovimientoFondo } from "./types";

/**
 * Series mensuales para los dashboards interactivos.
 *
 * El saldo acumulado de cada punto siempre se calcula sobre el historial
 * completo, aunque después se recorte la serie a los últimos N meses — así el
 * filtro de periodo cambia lo que se ve, nunca lo que significa el número.
 */
export interface PuntoSerie {
  /** "2026-08" */
  periodo: string;
  /** "ago 2026" */
  etiqueta: string;
  entradas: number;
  salidas: number;
  saldo: number;
}

const MESES_CORTOS = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

export function etiquetaPeriodoCorta(periodo: string): string {
  const [anio, mes] = periodo.split("-").map(Number);
  return `${MESES_CORTOS[mes - 1]} ${String(anio).slice(2)}`;
}

function agruparPorMes<T>(
  items: T[],
  obtenerPeriodo: (item: T) => string,
  obtenerMonto: (item: T) => number,
  esEntrada: (item: T) => boolean
): PuntoSerie[] {
  const porMes = new Map<string, { entradas: number; salidas: number }>();
  for (const item of items) {
    const periodo = obtenerPeriodo(item);
    const actual = porMes.get(periodo) ?? { entradas: 0, salidas: 0 };
    if (esEntrada(item)) {
      actual.entradas += obtenerMonto(item);
    } else {
      actual.salidas += obtenerMonto(item);
    }
    porMes.set(periodo, actual);
  }

  const periodos = Array.from(porMes.keys()).sort();
  let acumulado = 0;
  return periodos.map((periodo) => {
    const { entradas, salidas } = porMes.get(periodo)!;
    acumulado += entradas - salidas;
    return {
      periodo,
      etiqueta: etiquetaPeriodoCorta(periodo),
      entradas,
      salidas,
      saldo: acumulado,
    };
  });
}

export function serieMensualFondo(movimientos: MovimientoFondo[]): PuntoSerie[] {
  return agruparPorMes(
    movimientos,
    (m) => m.fecha.slice(0, 7),
    (m) => m.monto,
    (m) => m.tipo === "cuota"
  );
}

export function serieMensualAhorro(movimientos: MovimientoAhorro[]): PuntoSerie[] {
  return agruparPorMes(
    movimientos,
    (m) => m.fecha.slice(0, 7),
    (m) => m.monto,
    (m) => m.tipo === "ingreso"
  );
}
