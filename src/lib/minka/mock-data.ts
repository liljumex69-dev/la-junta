import type { Junta, SolicitudAval, Usuario } from "./types";

/**
 * Datos de prueba del prototipo.
 *
 * TODO: conectar a smart contract — reemplazar este módulo completo por lecturas
 * del contrato en Arbitrum. Nada de lo que hay aquí debe sobrevivir a la integración:
 * juntas, participantes, estados de pago, score e historial son todos estado on-chain.
 */

export const USUARIO_ACTUAL: Usuario = {
  id: "u-rosa",
  nombre: "Rosa Quispe",
  telefono: "987 654 321",
  iniciales: "RQ",
  score: 78,
  juntasCompletadas: 3,
  personasDistintas: 14,
  puntualidad: 96,
  cuotasPagadas: 34,
  avalesDados: 2,
  avalesRecibidos: 1,
  deudaConFondo: 0,
  plan: "gratuito",
  historial: [
    {
      id: "h-1",
      tipo: "junta_completada",
      descripcion: "Terminaste la junta “Puesto 14 — Frutas”",
      fecha: "12 de julio, 2026",
      impactoScore: 8,
    },
    {
      id: "h-2",
      tipo: "aval_dado",
      descripcion: "Avalaste a Miguel Ramos en “Ahorro del mercado”",
      fecha: "28 de junio, 2026",
      impactoScore: 3,
    },
    {
      id: "h-3",
      tipo: "turno_cobrado",
      descripcion: "Cobraste tu turno en “Puesto 14 — Frutas”",
      fecha: "3 de junio, 2026",
      impactoScore: 0,
    },
    {
      id: "h-4",
      tipo: "cuota_pagada",
      descripcion: "Pagaste tu cuota a tiempo en “Ahorro del mercado”",
      fecha: "1 de junio, 2026",
      impactoScore: 2,
    },
    {
      id: "h-5",
      tipo: "cuota_tarde",
      descripcion: "Pagaste con 2 días de atraso en “Ahorro del mercado”",
      fecha: "3 de mayo, 2026",
      impactoScore: -1,
    },
    {
      id: "h-6",
      tipo: "junta_completada",
      descripcion: "Terminaste la junta “Vecinas de Comas”",
      fecha: "20 de marzo, 2026",
      impactoScore: 8,
    },
  ],
};

export const JUNTAS: Junta[] = [
  {
    id: "j-mercado",
    nombre: "Ahorro del mercado",
    cuota: 200,
    frecuencia: "mensual",
    totalParticipantes: 8,
    modo: "protegido",
    visibilidad: "privada",
    asignacionTurnos: "sorteo",
    cicloActual: 3,
    estado: "activa",
    codigoInvitacion: "MERCADO8",
    organizadorId: "u-rosa",
    proximoPago: "15 de agosto",
    fondoSeguro: 96,
    participantes: [
      {
        id: "u-rosa",
        nombre: "Rosa Quispe",
        iniciales: "RQ",
        turno: 5,
        estadoPago: "pendiente",
        score: 78,
        yaCobro: false,
      },
      {
        id: "u-miguel",
        nombre: "Miguel Ramos",
        iniciales: "MR",
        turno: 1,
        estadoPago: "pagado",
        score: 62,
        yaCobro: true,
        avaladoPor: "Rosa Quispe",
      },
      {
        id: "u-carmen",
        nombre: "Carmen Loayza",
        iniciales: "CL",
        turno: 2,
        estadoPago: "pagado",
        score: 88,
        yaCobro: true,
      },
      {
        id: "u-julio",
        nombre: "Julio Mamani",
        iniciales: "JM",
        turno: 3,
        estadoPago: "pagado",
        score: 74,
        yaCobro: false,
      },
      {
        id: "u-elena",
        nombre: "Elena Chávez",
        iniciales: "EC",
        turno: 4,
        estadoPago: "tarde",
        score: 58,
        yaCobro: false,
      },
      {
        id: "u-victor",
        nombre: "Víctor Huamán",
        iniciales: "VH",
        turno: 6,
        estadoPago: "pendiente",
        score: 81,
        yaCobro: false,
      },
      {
        id: "u-sonia",
        nombre: "Sonia Paredes",
        iniciales: "SP",
        turno: 7,
        estadoPago: "pagado",
        score: 69,
        yaCobro: false,
      },
      {
        id: "u-luis",
        nombre: "Luis Tapia",
        iniciales: "LT",
        turno: 8,
        estadoPago: "pendiente",
        score: 45,
        yaCobro: false,
      },
    ],
  },
  {
    id: "j-vecinas",
    nombre: "Vecinas de Comas",
    cuota: 100,
    frecuencia: "quincenal",
    totalParticipantes: 6,
    modo: "tradicional",
    visibilidad: "privada",
    asignacionTurnos: "manual",
    cicloActual: 2,
    estado: "activa",
    codigoInvitacion: "COMAS06",
    organizadorId: "u-carmen",
    proximoPago: "10 de agosto",
    fondoSeguro: 0,
    participantes: [
      {
        id: "u-rosa",
        nombre: "Rosa Quispe",
        iniciales: "RQ",
        turno: 2,
        estadoPago: "pendiente",
        score: 78,
        yaCobro: false,
      },
      {
        id: "u-carmen",
        nombre: "Carmen Loayza",
        iniciales: "CL",
        turno: 1,
        estadoPago: "pagado",
        score: 88,
        yaCobro: true,
      },
      {
        id: "u-tere",
        nombre: "Teresa Ríos",
        iniciales: "TR",
        turno: 3,
        estadoPago: "pagado",
        score: 71,
        yaCobro: false,
      },
      {
        id: "u-nora",
        nombre: "Nora Salas",
        iniciales: "NS",
        turno: 4,
        estadoPago: "pagado",
        score: 66,
        yaCobro: false,
      },
      {
        id: "u-ines",
        nombre: "Inés Calle",
        iniciales: "IC",
        turno: 5,
        estadoPago: "pendiente",
        score: 52,
        yaCobro: false,
      },
      {
        id: "u-marta",
        nombre: "Marta Yupanqui",
        iniciales: "MY",
        turno: 6,
        estadoPago: "pagado",
        score: 79,
        yaCobro: false,
      },
    ],
  },
  {
    id: "j-transporte",
    nombre: "Transportistas Line 21",
    cuota: 500,
    frecuencia: "mensual",
    totalParticipantes: 10,
    modo: "protegido",
    visibilidad: "publica",
    asignacionTurnos: "sorteo",
    cicloActual: 1,
    estado: "activa",
    codigoInvitacion: "LINE21X",
    organizadorId: "u-victor",
    proximoPago: "20 de agosto",
    fondoSeguro: 340,
    participantes: [
      {
        id: "u-rosa",
        nombre: "Rosa Quispe",
        iniciales: "RQ",
        turno: 7,
        estadoPago: "pagado",
        score: 78,
        yaCobro: false,
      },
      {
        id: "u-victor",
        nombre: "Víctor Huamán",
        iniciales: "VH",
        turno: 1,
        estadoPago: "pagado",
        score: 81,
        yaCobro: false,
      },
      {
        id: "u-pedro",
        nombre: "Pedro Aliaga",
        iniciales: "PA",
        turno: 2,
        estadoPago: "pagado",
        score: 77,
        yaCobro: false,
      },
      {
        id: "u-rosa2",
        nombre: "Rosario Vega",
        iniciales: "RV",
        turno: 3,
        estadoPago: "pendiente",
        score: 64,
        yaCobro: false,
      },
      {
        id: "u-hugo",
        nombre: "Hugo Peralta",
        iniciales: "HP",
        turno: 4,
        estadoPago: "pagado",
        score: 90,
        yaCobro: false,
      },
      {
        id: "u-ana",
        nombre: "Ana Solís",
        iniciales: "AS",
        turno: 5,
        estadoPago: "pagado",
        score: 73,
        yaCobro: false,
      },
      {
        id: "u-raul",
        nombre: "Raúl Ccama",
        iniciales: "RC",
        turno: 6,
        estadoPago: "pendiente",
        score: 55,
        yaCobro: false,
      },
      {
        id: "u-nelly",
        nombre: "Nelly Ortiz",
        iniciales: "NO",
        turno: 8,
        estadoPago: "pagado",
        score: 84,
        yaCobro: false,
      },
      {
        id: "u-jose",
        nombre: "José Bautista",
        iniciales: "JB",
        turno: 9,
        estadoPago: "pagado",
        score: 68,
        yaCobro: false,
      },
      {
        id: "u-flor",
        nombre: "Flor Ninahuanca",
        iniciales: "FN",
        turno: 10,
        estadoPago: "pagado",
        score: 76,
        yaCobro: false,
      },
    ],
  },
];

/** Solicitudes de aval que otras personas le han hecho a la usuaria actual. */
export const SOLICITUDES_AVAL: SolicitudAval[] = [
  {
    id: "sa-1",
    juntaId: "j-mercado",
    juntaNombre: "Ahorro del mercado",
    solicitanteNombre: "Luis Tapia",
    solicitanteIniciales: "LT",
    solicitanteScore: 45,
    montoGarantia: 900,
    turnoSolicitado: 2,
    estado: "pendiente",
  },
];

/** Miembros con buen historial que podrían avalar a la usuaria actual. */
export const POSIBLES_AVALES = [
  {
    id: "u-carmen",
    nombre: "Carmen Loayza",
    iniciales: "CL",
    score: 88,
    juntasJuntos: 3,
    disponible: true,
  },
  {
    id: "u-victor",
    nombre: "Víctor Huamán",
    iniciales: "VH",
    score: 81,
    juntasJuntos: 1,
    disponible: true,
  },
  {
    id: "u-sonia",
    nombre: "Sonia Paredes",
    iniciales: "SP",
    score: 69,
    juntasJuntos: 2,
    disponible: true,
  },
  {
    id: "u-elena",
    nombre: "Elena Chávez",
    iniciales: "EC",
    score: 58,
    juntasJuntos: 1,
    // Su score no alcanza el mínimo para respaldar a otra persona
    disponible: false,
  },
];

/** Contactos de confianza configurados para recuperar la cuenta. */
export const CONTACTOS_RECUPERACION = [
  { id: "u-carmen", nombre: "Carmen Loayza", iniciales: "CL", confirmado: false },
  { id: "u-victor", nombre: "Víctor Huamán", iniciales: "VH", confirmado: false },
  { id: "u-sonia", nombre: "Sonia Paredes", iniciales: "SP", confirmado: false },
];

/**
 * Juntas a las que la usuaria todavía NO pertenece, buscadas por código de invitación.
 *
 * Hay una de cada modo a propósito, para poder recorrer los dos caminos de "unirse":
 * el consentimiento explícito del modo tradicional y la vista de garantía del protegido.
 *
 * TODO: conectar a smart contract — resolver el código de invitación contra el
 * contrato y leer las reglas ya fijadas de esa junta.
 */
export const JUNTAS_POR_CODIGO: Record<string, Junta> = {
  PANADEROS: {
    id: "j-panaderos",
    nombre: "Panaderos de Lince",
    cuota: 150,
    frecuencia: "mensual",
    totalParticipantes: 7,
    modo: "protegido",
    visibilidad: "privada",
    asignacionTurnos: "sorteo",
    cicloActual: 0,
    estado: "formandose",
    codigoInvitacion: "PANADEROS",
    organizadorId: "u-hugo",
    proximoPago: "cuando se complete el grupo",
    fondoSeguro: 0,
    participantes: [
      { id: "u-hugo", nombre: "Hugo Peralta", iniciales: "HP", turno: 1, estadoPago: "pendiente", score: 90, yaCobro: false },
      { id: "u-ana", nombre: "Ana Solís", iniciales: "AS", turno: 2, estadoPago: "pendiente", score: 73, yaCobro: false },
      { id: "u-pedro", nombre: "Pedro Aliaga", iniciales: "PA", turno: 3, estadoPago: "pendiente", score: 77, yaCobro: false },
      { id: "u-nelly", nombre: "Nelly Ortiz", iniciales: "NO", turno: 4, estadoPago: "pendiente", score: 84, yaCobro: false },
      { id: "u-jose", nombre: "José Bautista", iniciales: "JB", turno: 5, estadoPago: "pendiente", score: 68, yaCobro: false },
    ],
  },
  TIALUCHA: {
    id: "j-tialucha",
    nombre: "La junta de tía Lucha",
    cuota: 80,
    frecuencia: "quincenal",
    totalParticipantes: 6,
    modo: "tradicional",
    visibilidad: "privada",
    asignacionTurnos: "manual",
    cicloActual: 0,
    estado: "formandose",
    codigoInvitacion: "TIALUCHA",
    organizadorId: "u-marta",
    proximoPago: "cuando se complete el grupo",
    fondoSeguro: 0,
    participantes: [
      { id: "u-marta", nombre: "Marta Yupanqui", iniciales: "MY", turno: 1, estadoPago: "pendiente", score: 79, yaCobro: false },
      { id: "u-tere", nombre: "Teresa Ríos", iniciales: "TR", turno: 2, estadoPago: "pendiente", score: 71, yaCobro: false },
      { id: "u-nora", nombre: "Nora Salas", iniciales: "NS", turno: 3, estadoPago: "pendiente", score: 66, yaCobro: false },
      { id: "u-ines", nombre: "Inés Calle", iniciales: "IC", turno: 4, estadoPago: "pendiente", score: 52, yaCobro: false },
    ],
  },
};

export function buscarPorCodigo(codigo: string): Junta | undefined {
  return JUNTAS_POR_CODIGO[codigo.trim().toUpperCase()];
}

export function buscarJunta(id: string): Junta | undefined {
  return JUNTAS.find((j) => j.id === id);
}

export function miParticipacion(junta: Junta) {
  return junta.participantes.find((p) => p.id === USUARIO_ACTUAL.id);
}
