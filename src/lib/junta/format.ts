/** Formato de moneda: soles peruanos, siempre con el símbolo S/ delante. */
export function soles(monto: number): string {
  const decimales = Number.isInteger(monto) ? 0 : 2;
  return `S/ ${monto.toLocaleString("es-PE", {
    minimumFractionDigits: decimales,
    maximumFractionDigits: 2,
  })}`;
}

export const ETIQUETA_CARGO: Record<string, string> = {
  presidente: "Presidente",
  tesorero: "Tesorero",
  secretario: "Secretario",
  vocal: "Vocal",
  otro: "Otro cargo",
};

/** Resuelve la etiqueta de un cargo, usando el título propio si es "otro". */
export function etiquetaCargo(cargo?: string, cargoPersonalizado?: string): string {
  if (cargo === "otro" && cargoPersonalizado?.trim()) return cargoPersonalizado.trim();
  return cargo ? (ETIQUETA_CARGO[cargo] ?? cargo) : "Directivo";
}

export const ETIQUETA_ESTADO_CUOTA: Record<string, string> = {
  pagado: "Al día",
  pendiente: "Pendiente",
  mora: "En mora",
};

export const ETIQUETA_ESTADO_PROPUESTA: Record<string, string> = {
  pendiente: "Esperando firmas",
  ejecutada: "Ejecutada",
  rechazada: "Rechazada",
};

/** Formatea un periodo "2026-08" como "agosto 2026". */
export function formatoPeriodo(periodo: string): string {
  const [anio, mes] = periodo.split("-").map(Number);
  const nombres = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  return `${nombres[mes - 1]} ${anio}`;
}
