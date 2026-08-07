import { factorGarantiaPorScore } from "./rules";

/**
 * Niveles de confianza.
 *
 * Decisión de diseño no cubierta en los documentos: el score numérico 0-100 no le dice
 * nada por sí solo a alguien que nunca ha visto un puntaje crediticio. Un nombre de
 * nivel es legible de inmediato y da una meta concreta ("me falta poco para Plata"),
 * que es justo lo que el producto necesita incentivar.
 *
 * Las bandas NO son arbitrarias: cada una corresponde exactamente a un tramo de
 * `factorGarantiaPorScore`, así que subir de nivel siempre significa una rebaja real y
 * verificable de la garantía. Nunca es una insignia decorativa.
 *
 * Un usuario nuevo entra con score 50, que cae en "Nuevo". Por debajo de 40 solo se
 * llega incumpliendo, por eso ese tramo se llama distinto y tiene su propio camino
 * de vuelta (ver la pantalla de historial).
 *
 * Regla que NO depende del nivel: organizar juntas públicas se gana con juntas
 * completadas, no con score. Son dos ejes distintos a propósito, y la pantalla de
 * niveles lo dice explícitamente.
 */
export type IdNivel = "danado" | "nuevo" | "bronce" | "plata" | "oro";

export interface Nivel {
  id: IdNivel;
  nombre: string;
  /** Score mínimo para alcanzarlo. */
  desde: number;
  /** Qué porcentaje de la garantía base te piden en este nivel. */
  porcentajeGarantia: number;
  color: string;
  fondo: string;
  /** Qué significa, en lenguaje del usuario. */
  beneficio: string;
}

export const NIVELES: Nivel[] = [
  {
    id: "danado",
    nombre: "Historial dañado",
    desde: 0,
    porcentajeGarantia: 100,
    color: "#9C3232",
    fondo: "#f4e0e0",
    beneficio:
      "Quedó un incumplimiento sin resolver. Puedes recuperarte devolviendo lo que el fondo cubrió por ti.",
  },
  {
    id: "nuevo",
    nombre: "Nuevo",
    desde: 40,
    porcentajeGarantia: 90,
    color: "#8A7A6D",
    fondo: "#ece4d8",
    beneficio:
      "Recién empiezas, sin nada en contra. Para cobrar temprano te piden guardar casi todo lo que te falta aportar.",
  },
  {
    id: "bronce",
    nombre: "Bronce",
    desde: 55,
    porcentajeGarantia: 70,
    color: "#8a5810",
    fondo: "#fbeed8",
    beneficio:
      "Ya cumpliste varias cuotas seguidas. Te piden bastante menos garantía para cobrar temprano.",
  },
  {
    id: "plata",
    nombre: "Plata",
    desde: 70,
    porcentajeGarantia: 50,
    color: "#5c6670",
    fondo: "#e8ecef",
    beneficio:
      "Eres de confianza en tu grupo. Te piden la mitad de garantía y puedes avalar a otras personas.",
  },
  {
    id: "oro",
    nombre: "Oro",
    desde: 85,
    porcentajeGarantia: 30,
    color: "#8a6510",
    fondo: "#f9eed3",
    beneficio:
      "El nivel más alto. La garantía que te piden es la mínima posible y tu aval vale mucho para otros.",
  },
];

/** Score con el que entra alguien recién registrado: neutral, ni bien ni mal. */
export const SCORE_INICIAL = 50;

export function nivelDe(score: number): Nivel {
  return [...NIVELES].reverse().find((n) => score >= n.desde) ?? NIVELES[0];
}

export function siguienteNivel(score: number): Nivel | null {
  return NIVELES.find((n) => n.desde > score) ?? null;
}

/**
 * Progreso hacia el siguiente nivel, para la barra del panel de inicio.
 * Devuelve `null` cuando ya se está en el nivel más alto.
 */
export function progresoAlSiguiente(score: number): {
  actual: Nivel;
  siguiente: Nivel;
  puntosQueFaltan: number;
  porcentaje: number;
} | null {
  const actual = nivelDe(score);
  const siguiente = siguienteNivel(score);
  if (!siguiente) return null;

  const tramo = siguiente.desde - actual.desde;
  const avance = score - actual.desde;

  return {
    actual,
    siguiente,
    puntosQueFaltan: siguiente.desde - score,
    porcentaje: Math.max(0, Math.min(100, Math.round((avance / tramo) * 100))),
  };
}

/**
 * Cuántas juntas completas faltan, aproximadamente, para el siguiente nivel.
 * Terminar una junta sube el score unos 8 puntos en el historial simulado.
 */
export function juntasParaSiguienteNivel(score: number): number | null {
  const progreso = progresoAlSiguiente(score);
  if (!progreso) return null;
  return Math.max(1, Math.ceil(progreso.puntosQueFaltan / 8));
}

/** El nivel siempre refleja el factor real de garantía que aplica el contrato. */
export function garantiaDelNivel(score: number): number {
  return Math.round(factorGarantiaPorScore(score) * 100);
}
