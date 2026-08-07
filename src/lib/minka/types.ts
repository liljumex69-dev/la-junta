/**
 * Modelo de dominio de Minka.
 *
 * Este prototipo es solo interfaz: todo lo que aquí se representa como estado local
 * de React será, en el producto real, estado leído del smart contract en Arbitrum.
 * Los puntos exactos de conexión están marcados con `// TODO: conectar a smart contract`.
 */

/** Un turno es la posición en la que a un participante le toca recibir el pozo. */
export type NumeroTurno = number;

/**
 * Modo de junta.
 * - `tradicional`: sin garantía ni prima. Igual que una junta de papel: si alguien
 *   no paga, el grupo lo resuelve entre ellos. Solo permitido en juntas privadas.
 * - `protegido`: prima decreciente + garantía bloqueada antes de cobrar. Obligatorio
 *   en juntas públicas.
 */
export type ModoJunta = "tradicional" | "protegido";

/** Privada: invitas a quien conoces. Pública: requiere historial del organizador. */
export type VisibilidadJunta = "privada" | "publica";

/** Cómo se asignan los turnos. `manual` solo está disponible en juntas privadas. */
export type AsignacionTurnos = "sorteo" | "manual";

export type FrecuenciaCuota = "semanal" | "quincenal" | "mensual";

export type EstadoPagoCuota =
  /** Aportó dentro de la fecha */
  | "pagado"
  /** Aportó, pero después de la fecha. Advertencia leve, no incumplimiento. */
  | "tarde"
  /** Aún no aporta y la fecha no ha vencido */
  | "pendiente"
  /** No aportó y la fecha venció: la garantía y el fondo cubren a los demás */
  | "incumplido"
  /** Incumplimiento aceptado como fuerza mayor por votación del grupo */
  | "fuerza_mayor";

export type EstadoJunta = "formandose" | "activa" | "completada";

export type NivelConfianza =
  | "nuevo"
  | "en_construccion"
  | "confiable"
  | "muy_confiable";

export interface Participante {
  id: string;
  nombre: string;
  /** Iniciales para el avatar. El prototipo no usa fotos de participantes. */
  iniciales: string;
  /** Posición en la que le toca cobrar el pozo. */
  turno: NumeroTurno;
  /** Estado de su aporte en el ciclo que se está mostrando. */
  estadoPago: EstadoPagoCuota;
  /** Score de reputación 0-100 de este participante. */
  score: number;
  /** Si ya cobró su turno en algún ciclo anterior. */
  yaCobro: boolean;
  /** Nombre de quien lo avala, si alguien lo respalda para un turno temprano. */
  avaladoPor?: string;
}

export interface Junta {
  id: string;
  nombre: string;
  /** Monto fijo que cada participante aporta por ciclo, en soles. */
  cuota: number;
  frecuencia: FrecuenciaCuota;
  /** Número total de participantes = número total de turnos. */
  totalParticipantes: number;
  modo: ModoJunta;
  visibilidad: VisibilidadJunta;
  asignacionTurnos: AsignacionTurnos;
  /** Ciclo en curso, 1-indexado. En el ciclo N cobra quien tiene el turno N. */
  cicloActual: number;
  estado: EstadoJunta;
  /** Código corto para compartir e invitar. */
  codigoInvitacion: string;
  participantes: Participante[];
  /** Id del participante que organizó la junta. No tiene control sobre el dinero. */
  organizadorId: string;
  /** Fecha límite del aporte del ciclo actual, en texto legible. */
  proximoPago: string;
  /** Monto acumulado del fondo de seguro colectivo de esta junta, en soles. */
  fondoSeguro: number;
}

export interface RegistroHistorial {
  id: string;
  tipo:
    | "cuota_pagada"
    | "cuota_tarde"
    | "turno_cobrado"
    | "junta_completada"
    | "incumplimiento"
    | "aval_dado"
    | "aval_recibido"
    | "reembolso";
  descripcion: string;
  fecha: string;
  /** Cuánto movió el score este evento. Positivo o negativo. */
  impactoScore: number;
}

export interface SolicitudAval {
  id: string;
  juntaId: string;
  juntaNombre: string;
  solicitanteNombre: string;
  solicitanteIniciales: string;
  solicitanteScore: number;
  /** Monto de garantía que el avalador tendría que bloquear, en soles. */
  montoGarantia: number;
  turnoSolicitado: NumeroTurno;
  estado: "pendiente" | "aceptado" | "rechazado";
}

export interface Usuario {
  id: string;
  nombre: string;
  telefono: string;
  iniciales: string;
  /** Score de reputación 0-100. Un usuario nuevo parte en 50: neutral. */
  score: number;
  juntasCompletadas: number;
  /** Cuántas personas distintas — no cuántas juntas. Es la señal real de confianza. */
  personasDistintas: number;
  /** Porcentaje de cuotas pagadas a tiempo. */
  puntualidad: number;
  cuotasPagadas: number;
  avalesDados: number;
  avalesRecibidos: number;
  /** Monto que el fondo colectivo cubrió por este usuario y aún no ha reembolsado. */
  deudaConFondo: number;
  plan: "gratuito" | "pro";
  historial: RegistroHistorial[];
}
