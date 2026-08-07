"use client";

import {
  CONTACTOS_RECUPERACION,
  JUNTAS,
  JUNTAS_POR_CODIGO,
  USUARIO_ACTUAL,
  USUARIO_CON_DEUDA,
} from "../mock-data";
import { SCORE_INICIAL } from "../niveles";
import type { Junta, Participante, Usuario } from "../types";

/**
 * ============================================================================
 * BACKEND PROVISIONAL DEL PROTOTIPO — SE BORRA COMPLETO AL INTEGRAR
 * ============================================================================
 *
 * Simula, en el navegador, las tres cosas que en producción vive cada una en su
 * sitio: la sesión del usuario, el directorio de usuarios y el estado de las juntas.
 *
 * Está deliberadamente aislado en este archivo y detrás de las acciones de
 * `useSesion()`, para que el equipo de desarrollo pueda reemplazarlo por la
 * arquitectura que elija sin tocar ni una sola pantalla:
 *
 *   - Sesión y directorio de usuarios  → su solución de auth (Supabase, Privy,
 *     Dynamic, cuentas propias… lo que decidan)
 *   - Juntas, aportes, turnos, garantía → el smart contract en Arbitrum
 *
 * Todo lo que hay aquí es estado en `localStorage`. No hay servidor, no hay
 * validación real y nada de esto es seguro: es una maqueta para recorrer flujos.
 */

const CLAVE = "minka:prototipo:v2";

export interface EstadoPrototipo {
  usuarios: Usuario[];
  juntas: Junta[];
  /** Id del usuario con sesión iniciada. `null` = sin sesión. */
  sesionUsuarioId: string | null;
  /** Contactos de confianza por usuario, para la recuperación de cuenta. */
  contactos: Record<string, { id: string; nombre: string; iniciales: string }[]>;
  /** Solicitudes de turno enviadas a organizadores, por junta. */
  solicitudesTurno: {
    id: string;
    juntaId: string;
    usuarioId: string;
    turno: number;
    estado: "pendiente" | "aceptada" | "rechazada";
  }[];
}

/** Estado de arranque: los perfiles de demo y las juntas de ejemplo. */
function estadoInicial(): EstadoPrototipo {
  return {
    usuarios: [USUARIO_ACTUAL, USUARIO_CON_DEUDA],
    juntas: JUNTAS.map((j) => ({ ...j })),
    // Arranca en Rosa para que la demo abra con contenido, no en una pantalla vacía.
    sesionUsuarioId: USUARIO_ACTUAL.id,
    contactos: { [USUARIO_ACTUAL.id]: [...CONTACTOS_RECUPERACION] },
    solicitudesTurno: [],
  };
}

export function leerEstado(): EstadoPrototipo {
  if (typeof window === "undefined") return estadoInicial();
  try {
    const crudo = window.localStorage.getItem(CLAVE);
    if (!crudo) return estadoInicial();
    return { ...estadoInicial(), ...JSON.parse(crudo) };
  } catch {
    return estadoInicial();
  }
}

export function guardarEstado(estado: EstadoPrototipo) {
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(estado));
    // Avisa a las demás pestañas y a los componentes suscritos del mismo documento.
    window.dispatchEvent(new CustomEvent("minka:estado"));
  } catch {
    // Si localStorage está bloqueado, el prototipo sigue funcionando en memoria.
  }
}

export function reiniciarEstado() {
  try {
    window.localStorage.removeItem(CLAVE);
  } catch {
    /* ignorado */
  }
  window.dispatchEvent(new CustomEvent("minka:estado"));
}

/* ---------------------------------------------------------------------------
   Utilidades de dominio
   --------------------------------------------------------------------------- */

export function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[1][0]).toUpperCase();
}

export function nuevoId(prefijo: string): string {
  return `${prefijo}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Crea un usuario recién registrado: score neutral y todo el historial en cero. */
export function crearUsuario(datos: {
  nombre: string;
  telefono: string;
}): Usuario {
  return {
    id: nuevoId("u"),
    nombre: datos.nombre.trim(),
    telefono: datos.telefono,
    iniciales: iniciales(datos.nombre),
    // TODO: conectar a smart contract — registrar al usuario on-chain con score neutral.
    score: SCORE_INICIAL,
    juntasCompletadas: 0,
    personasDistintas: 0,
    puntualidad: 0,
    cuotasPagadas: 0,
    avalesDados: 0,
    avalesRecibidos: 0,
    deudaConFondo: 0,
    plan: "gratuito",
    historial: [],
  };
}

/** Genera un código de invitación legible a partir del nombre de la junta. */
export function codigoDesdeNombre(nombre: string, participantes: number): string {
  const base = nombre
    .toUpperCase()
    .normalize("NFD")
    .replace(/[^A-Z]/g, "")
    .slice(0, 6);
  return `${base.padEnd(4, "X")}${participantes}`;
}

/** Turnos que todavía no tomó nadie en una junta en formación. */
export function turnosLibres(junta: Junta): number[] {
  const tomados = new Set(junta.participantes.map((p) => p.turno));
  return Array.from({ length: junta.totalParticipantes }, (_, i) => i + 1).filter(
    (t) => !tomados.has(t)
  );
}

/** Busca una junta por código entre las de ejemplo y las creadas en la demo. */
export function juntaPorCodigo(
  estado: EstadoPrototipo,
  codigo: string
): Junta | undefined {
  const buscado = codigo.trim().toUpperCase();
  return (
    estado.juntas.find((j) => j.codigoInvitacion === buscado) ??
    JUNTAS_POR_CODIGO[buscado]
  );
}

export function participanteDe(junta: Junta, usuarioId: string): Participante | undefined {
  return junta.participantes.find((p) => p.id === usuarioId);
}
