import type {
  Junta,
  ModoJunta,
  NivelConfianza,
  NumeroTurno,
  Participante,
} from "./types";

/**
 * Reglas de negocio de Minka.
 *
 * Todos los cálculos aquí son una SIMULACIÓN local para el prototipo de interfaz.
 * En el producto real cada uno de estos valores lo determina el smart contract,
 * que es la única fuente de verdad. Se mantienen aquí para que las pantallas
 * muestren números coherentes entre sí y el equipo de blockchain vea exactamente
 * qué espera la interfaz de cada función del contrato.
 */

/** Porcentaje máximo de prima, aplicado al turno 1. Decrece hasta 0 en el último turno. */
const PRIMA_MAXIMA_PCT = 0.08;

/** Comisión de Minka sobre la prima recaudada. El resto va al fondo de seguro colectivo. */
export const FEE_PLATAFORMA_PCT = 0.25;

/**
 * Prima decreciente por turno temprano.
 *
 * Es mayor en el primer turno y exactamente cero en el último: quien cobra primero
 * usa el dinero del grupo durante más tiempo, así que paga por ese privilegio.
 * Lo recaudado financia el fondo de seguro colectivo y el fee de la plataforma.
 *
 * En modo tradicional NO hay prima: el pozo es siempre completo.
 *
 * @param turno posición del participante, 1-indexada
 * @param totalTurnos número total de participantes
 * @param cuota monto de la cuota base en soles
 */
export function calcularPrima(
  turno: NumeroTurno,
  totalTurnos: number,
  cuota: number,
  modo: ModoJunta
): number {
  // TODO: conectar a smart contract — leer la prima exacta del contrato para este
  // turno en vez de recalcularla en el cliente. El contrato es la fuente de verdad.
  if (modo === "tradicional") return 0;
  if (totalTurnos <= 1) return 0;

  const proporcion = (totalTurnos - turno) / (totalTurnos - 1);
  return Math.round(cuota * PRIMA_MAXIMA_PCT * proporcion * 100) / 100;
}

/**
 * Factor de garantía según el score de reputación.
 *
 * Un score alto reduce cuánta garantía externa necesitas bloquear para cobrar un
 * turno temprano. Es el incentivo central del producto: la reputación tiene un
 * valor económico concreto y medible.
 *
 * Nunca baja de 0.3 — ni el mejor historial elimina la garantía por completo.
 */
export function factorGarantiaPorScore(score: number): number {
  if (score >= 85) return 0.3;
  if (score >= 70) return 0.5;
  if (score >= 55) return 0.7;
  if (score >= 40) return 0.9;
  return 1;
}

/**
 * Garantía externa que un participante debe tener bloqueada ANTES de cobrar su turno.
 *
 * Es proporcional a las cuotas que aún le quedan por aportar — es decir, a lo que
 * el grupo arriesga si esa persona desaparece después de cobrar — y se reduce según
 * su score. Puede ser propia o aportada por un aval.
 *
 * En modo tradicional no se exige garantía.
 */
export function calcularGarantia(
  turno: NumeroTurno,
  totalTurnos: number,
  cuota: number,
  score: number,
  modo: ModoJunta
): number {
  // TODO: conectar a smart contract — consultar la garantía requerida al contrato
  // (`garantiaRequerida(juntaId, participante)`), incluyendo el score on-chain.
  if (modo === "tradicional") return 0;

  const cuotasRestantes = Math.max(0, totalTurnos - turno);
  const base = cuotasRestantes * cuota;
  return Math.round(base * factorGarantiaPorScore(score));
}

/** Monto total del pozo que recibe quien cobra su turno. Se libera completo, sin retenciones. */
export function calcularPozo(junta: Junta): number {
  // TODO: conectar a smart contract — leer el balance real del pozo del ciclo actual.
  return junta.cuota * junta.totalParticipantes;
}

/** Lo que un participante paga este ciclo: cuota base + prima si le corresponde turno temprano. */
export function calcularAporteDelCiclo(
  junta: Junta,
  participante: Participante
): { cuota: number; prima: number; total: number } {
  const prima = calcularPrima(
    participante.turno,
    junta.totalParticipantes,
    junta.cuota,
    junta.modo
  );
  return {
    cuota: junta.cuota,
    prima,
    total: Math.round((junta.cuota + prima) * 100) / 100,
  };
}

/** Traduce el score numérico a un nivel con nombre, que es lo que ve el usuario. */
export function nivelDeConfianza(score: number): NivelConfianza {
  if (score >= 85) return "muy_confiable";
  if (score >= 70) return "confiable";
  if (score >= 55) return "en_construccion";
  return "nuevo";
}

export const ETIQUETA_NIVEL: Record<NivelConfianza, string> = {
  nuevo: "Historial nuevo",
  en_construccion: "Historial en construcción",
  confiable: "Historial confiable",
  muy_confiable: "Historial muy confiable",
};

/**
 * Si el organizador puede crear juntas públicas.
 *
 * Regla no negociable: esto se gana SOLO con historial (2-3 juntas completas).
 * Ningún plan pagado lo desbloquea nunca.
 */
export function puedeCrearJuntaPublica(juntasCompletadas: number): boolean {
  return juntasCompletadas >= 2;
}

/**
 * Si un participante puede cobrar su turno.
 *
 * Regla no negociable: la elegibilidad de turno temprano depende solo de garantía
 * y reputación. Ningún plan pagado la otorga.
 */
export function puedeCobrarTurno(params: {
  modo: ModoJunta;
  garantiaRequerida: number;
  garantiaBloqueada: number;
}): boolean {
  // TODO: conectar a smart contract — el contrato valida esta condición antes de
  // liberar el pozo. La interfaz solo la refleja, nunca la decide.
  if (params.modo === "tradicional") return true;
  return params.garantiaBloqueada >= params.garantiaRequerida;
}

/** Cuánto del monto recaudado por primas va al fondo colectivo vs. a la plataforma. */
export function repartoDePrima(primaTotal: number): {
  fondoColectivo: number;
  plataforma: number;
} {
  const plataforma = Math.round(primaTotal * FEE_PLATAFORMA_PCT * 100) / 100;
  return {
    plataforma,
    fondoColectivo: Math.round((primaTotal - plataforma) * 100) / 100,
  };
}

/** Participante al que le toca cobrar en el ciclo actual. */
export function participanteDelTurno(junta: Junta): Participante | undefined {
  return junta.participantes.find((p) => p.turno === junta.cicloActual);
}

/** Cuántos ya aportaron su cuota en el ciclo actual. */
export function progresoDelCiclo(junta: Junta): {
  aportaron: number;
  total: number;
  faltan: number;
} {
  // TODO: conectar a smart contract — leer los aportes confirmados on-chain del ciclo.
  const aportaron = junta.participantes.filter(
    (p) => p.estadoPago === "pagado" || p.estadoPago === "tarde"
  ).length;
  return {
    aportaron,
    total: junta.totalParticipantes,
    faltan: junta.totalParticipantes - aportaron,
  };
}
