/** Formato de moneda: soles peruanos, siempre con el símbolo S/ delante. */
export function soles(monto: number): string {
  const decimales = Number.isInteger(monto) ? 0 : 2;
  return `S/ ${monto.toLocaleString("es-PE", {
    minimumFractionDigits: decimales,
    maximumFractionDigits: 2,
  })}`;
}

export const ETIQUETA_FRECUENCIA: Record<string, string> = {
  semanal: "Cada semana",
  quincenal: "Cada quincena",
  mensual: "Cada mes",
};

export const ETIQUETA_FRECUENCIA_CORTA: Record<string, string> = {
  semanal: "semanal",
  quincenal: "quincenal",
  mensual: "mensual",
};

/** Ordinal en femenino para turnos: "1.ª", "2.ª"… Se lee mejor que "turno #3". */
export function turnoOrdinal(turno: number): string {
  return `${turno}.º`;
}
