import type {
  Anuncio,
  Asociacion,
  CuotaComerciante,
  MovimientoAhorro,
  MovimientoFondo,
  Notificacion,
  PropuestaGasto,
  Usuario,
} from "./types";

/**
 * Datos de prueba de Junta.
 *
 * Todo en memoria, nada persistente — a propósito. El estado vive en el Context de
 * React (`src/lib/junta/context.tsx`) y se reinicia limpio en cada recarga de página.
 *
 * TODO: conectar a Safe/smart contract — reemplazar este módulo completo por lecturas
 * del Safe y del contrato Stylus en Arbitrum. Nada de lo que hay aquí debe sobrevivir
 * a la integración: la asociación, los movimientos del fondo, las propuestas y las
 * firmas son todos estado on-chain (o del Safe) en el producto real.
 *
 * El caso de "Mercado Villa El Salvador" referenciado aquí es el mismo que motiva el
 * producto: un fondo colectivo expuesto en efectivo por trámites de firma lentos.
 */

export const ASOCIACION_DEMO: Asociacion = {
  id: "a-ves",
  nombreMercado: "Mercado Villa El Salvador",
  numeroPuestos: 84,
  codigoInvitacion: "VES2026",
  configuracion: {
    umbralFirmas: 3,
    totalFirmantes: 5,
    mora: { activa: true, porcentaje: 5, diasGracia: 5 },
    notificacionesActivas: true,
  },
  categorias: ["Seguridad", "Mantenimiento", "Mejoras", "Otras"],
  directivosIniciales: [
    { nombre: "Rosario Fernández Paredes", cargo: "presidente" },
    { nombre: "Julio Bautista Campos", cargo: "secretario" },
    { nombre: "Carmen Salazar Díaz", cargo: "vocal" },
    { nombre: "Teodoro Quinteros Vega", cargo: "vocal" },
  ],
  creadaEn: "2026-01-15",
};

/** Directorio completo — solo Marco y Rosario tienen cuenta logueable en la demo. */
export const DIRECTIVOS_DEMO = [
  { id: "u-marco", nombre: "Marco Huamán Torres", cargo: "tesorero" as const },
  { id: "u-rosario", nombre: "Rosario Fernández Paredes", cargo: "presidente" as const },
  { id: "u-julio", nombre: "Julio Bautista Campos", cargo: "secretario" as const },
  { id: "u-carmen", nombre: "Carmen Salazar Díaz", cargo: "vocal" as const },
  { id: "u-teodoro", nombre: "Teodoro Quinteros Vega", cargo: "vocal" as const },
];

export const USUARIO_COMERCIANTE: Usuario = {
  id: "u-elena",
  nombre: "Elena Vásquez Rojas",
  dni: "45678912",
  telefono: "987 111 222",
  iniciales: "EV",
  colorAvatar: "#1F5C3D",
  rol: "comerciante",
  asociacionId: "a-ves",
  asociacionesIds: ["a-ves"],
  numeroPuesto: "A-14",
};

export const USUARIO_DIRECTIVO: Usuario = {
  id: "u-marco",
  nombre: "Marco Huamán Torres",
  dni: "41234567",
  telefono: "998 333 444",
  iniciales: "MH",
  colorAvatar: "#B8863B",
  rol: "directivo",
  cargo: "tesorero",
  asociacionId: "a-ves",
  asociacionesIds: ["a-ves"],
};

export const USUARIOS_SEED: Usuario[] = [USUARIO_COMERCIANTE, USUARIO_DIRECTIVO];

export const MOVIMIENTOS_FONDO_SEED: MovimientoFondo[] = [
  // Acumulado de meses previos (febrero-mayo), agrupado por mes en vez de por
  // puesto individual: son 84 puestos pagando desde enero, y desglosarlos uno a
  // uno aquí no aportaría nada a la demo. Sin este acumulado el fondo quedaba en
  // números rojos con solo los movimientos de junio en adelante, lo cual
  // contradice la idea central del producto — un fondo protegido, no uno en deuda.
  {
    id: "mf-h1",
    asociacionId: "a-ves",
    tipo: "cuota",
    monto: 3900,
    fecha: "2026-02-10",
    descripcion: "Cuotas de febrero — 78 puestos",
    referenciaId: "acumulado-2026-02",
    hashSimulado: "0x4a19…20e6",
  },
  {
    id: "mf-h2",
    asociacionId: "a-ves",
    tipo: "cuota",
    monto: 4000,
    fecha: "2026-03-10",
    descripcion: "Cuotas de marzo — 80 puestos",
    referenciaId: "acumulado-2026-03",
    hashSimulado: "0x6d02…8f3c",
  },
  {
    id: "mf-h3",
    asociacionId: "a-ves",
    tipo: "cuota",
    monto: 3950,
    fecha: "2026-04-10",
    descripcion: "Cuotas de abril — 79 puestos",
    referenciaId: "acumulado-2026-04",
    hashSimulado: "0x1e77…b459",
  },
  {
    id: "mf-h4",
    asociacionId: "a-ves",
    tipo: "cuota",
    monto: 3850,
    fecha: "2026-05-10",
    descripcion: "Cuotas de mayo — 77 puestos",
    referenciaId: "acumulado-2026-05",
    hashSimulado: "0xc890…3d17",
  },
  {
    id: "mf-1",
    asociacionId: "a-ves",
    tipo: "cuota",
    monto: 50,
    fecha: "2026-08-03",
    descripcion: "Cuota agosto — Puesto A-14",
    referenciaId: "u-elena",
    hashSimulado: "0x8a41…c9f2",
  },
  {
    id: "mf-2",
    asociacionId: "a-ves",
    tipo: "cuota",
    monto: 50,
    fecha: "2026-08-02",
    descripcion: "Cuota agosto — Puesto B-07",
    referenciaId: "u-desconocido-1",
    hashSimulado: "0x1b7e…44a0",
  },
  {
    id: "mf-3",
    asociacionId: "a-ves",
    tipo: "cuota",
    monto: 50,
    fecha: "2026-08-01",
    descripcion: "Cuota agosto — Puesto C-22",
    referenciaId: "u-desconocido-2",
    hashSimulado: "0x9d02…7b31",
  },
  {
    id: "mf-4",
    asociacionId: "a-ves",
    tipo: "gasto",
    monto: 850,
    fecha: "2026-07-22",
    descripcion: "Refuerzo de cámaras de seguridad",
    categoria: "Seguridad",
    referenciaId: "pg-2",
    hashSimulado: "0x5f6c…a812",
  },
  {
    id: "mf-5",
    asociacionId: "a-ves",
    tipo: "cuota",
    monto: 50,
    fecha: "2026-07-05",
    descripcion: "Cuota julio — Puesto A-14",
    referenciaId: "u-elena",
    hashSimulado: "0x2c90…de47",
  },
  {
    id: "mf-6",
    asociacionId: "a-ves",
    tipo: "gasto",
    monto: 420,
    fecha: "2026-06-18",
    descripcion: "Pintado de fachada principal",
    categoria: "Mejoras",
    referenciaId: "pg-0",
    hashSimulado: "0x77a1…f003",
  },
  {
    id: "mf-7",
    asociacionId: "a-ves",
    tipo: "cuota",
    monto: 50,
    fecha: "2026-06-04",
    descripcion: "Cuota junio — Puesto A-14",
    referenciaId: "u-elena",
    hashSimulado: "0x3e88…19bc",
  },
];

export const CUOTAS_SEED: CuotaComerciante[] = [
  {
    id: "cc-1",
    asociacionId: "a-ves",
    comercianteId: "u-elena",
    periodo: "2026-08",
    monto: 50,
    estado: "pagado",
    fechaPago: "2026-08-03",
    fechaVencimiento: "2026-08-10",
  },
  {
    id: "cc-2",
    asociacionId: "a-ves",
    comercianteId: "u-elena",
    periodo: "2026-07",
    monto: 50,
    estado: "pagado",
    fechaPago: "2026-07-05",
    fechaVencimiento: "2026-07-10",
  },
  {
    id: "cc-3",
    asociacionId: "a-ves",
    comercianteId: "u-elena",
    periodo: "2026-06",
    monto: 50,
    estado: "pagado",
    fechaPago: "2026-06-04",
    fechaVencimiento: "2026-06-10",
  },
  {
    id: "cc-4",
    asociacionId: "a-ves",
    comercianteId: "u-elena",
    periodo: "2026-05",
    monto: 50,
    estado: "mora",
    fechaVencimiento: "2026-05-10",
  },
];

export const PROPUESTAS_SEED: PropuestaGasto[] = [
  {
    id: "pg-1",
    asociacionId: "a-ves",
    propuestoPorId: "u-marco",
    propuestoPorNombre: "Marco Huamán Torres",
    monto: 1200,
    motivo: "Reparación del techo del pabellón C, tiene filtraciones desde las lluvias de julio",
    categoria: "Mantenimiento",
    fecha: "2026-08-05",
    firmas: [
      { directivoId: "u-marco", directivoNombre: "Marco Huamán Torres", fecha: "2026-08-05" },
      { directivoId: "u-rosario", directivoNombre: "Rosario Fernández Paredes", fecha: "2026-08-05" },
    ],
    umbralRequerido: 3,
    estado: "pendiente",
  },
  {
    id: "pg-2",
    asociacionId: "a-ves",
    propuestoPorId: "u-marco",
    propuestoPorNombre: "Marco Huamán Torres",
    monto: 850,
    motivo: "Refuerzo de cámaras de seguridad en el ingreso principal",
    categoria: "Seguridad",
    fecha: "2026-07-20",
    firmas: [
      { directivoId: "u-marco", directivoNombre: "Marco Huamán Torres", fecha: "2026-07-20" },
      { directivoId: "u-rosario", directivoNombre: "Rosario Fernández Paredes", fecha: "2026-07-21" },
      { directivoId: "u-julio", directivoNombre: "Julio Bautista Campos", fecha: "2026-07-22" },
    ],
    umbralRequerido: 3,
    estado: "ejecutada",
    fechaEjecucion: "2026-07-22",
  },
  {
    id: "pg-0",
    asociacionId: "a-ves",
    propuestoPorId: "u-rosario",
    propuestoPorNombre: "Rosario Fernández Paredes",
    monto: 420,
    motivo: "Pintado de la fachada principal del mercado",
    categoria: "Mejoras",
    fecha: "2026-06-15",
    firmas: [
      { directivoId: "u-rosario", directivoNombre: "Rosario Fernández Paredes", fecha: "2026-06-15" },
      { directivoId: "u-marco", directivoNombre: "Marco Huamán Torres", fecha: "2026-06-16" },
      { directivoId: "u-carmen", directivoNombre: "Carmen Salazar Díaz", fecha: "2026-06-17" },
    ],
    umbralRequerido: 3,
    estado: "ejecutada",
    fechaEjecucion: "2026-06-18",
  },
];

export const AHORRO_SEED: MovimientoAhorro[] = [
  {
    id: "ma-1",
    comercianteId: "u-elena",
    tipo: "ingreso",
    monto: 120,
    categoria: "Capital de trabajo",
    fecha: "2026-08-01",
    descripcion: "Ahorro de la semana",
  },
  {
    id: "ma-2",
    comercianteId: "u-elena",
    tipo: "egreso",
    monto: 45,
    categoria: "Salud",
    fecha: "2026-07-28",
    descripcion: "Consulta médica",
  },
  {
    id: "ma-3",
    comercianteId: "u-elena",
    tipo: "ingreso",
    monto: 80,
    categoria: "Capital de trabajo",
    fecha: "2026-07-15",
    descripcion: "Ahorro de la semana",
  },
  {
    id: "ma-4",
    comercianteId: "u-elena",
    tipo: "ingreso",
    monto: 60,
    categoria: "Familia",
    fecha: "2026-07-01",
    descripcion: "Para útiles escolares",
  },
];

export const NOTIFICACIONES_SEED: Notificacion[] = [
  {
    id: "n-1",
    usuarioId: "u-elena",
    tipo: "recordatorio_cuota",
    titulo: "Tu cuota de mayo sigue pendiente",
    mensaje: "El directorio te recuerda pagar tu cuota de mayo para mantenerte al día.",
    fecha: "2026-08-06",
    leida: false,
    enlace: "/fondo/pagar",
  },
  {
    id: "n-2",
    usuarioId: "u-marco",
    tipo: "propuesta_pendiente",
    titulo: "Falta una firma para el techo del pabellón C",
    mensaje: "Ya firmaste. Todavía falta 1 firma más de otro directivo para ejecutar el gasto.",
    fecha: "2026-08-05",
    leida: false,
    enlace: "/fondo",
  },
];

export const ANUNCIOS_SEED: Anuncio[] = [
  {
    id: "an-1",
    asociacionId: "a-ves",
    publicadoPorId: "u-rosario",
    publicadoPorNombre: "Rosario Fernández Paredes",
    titulo: "Corte de agua programado el sábado",
    contenido:
      "Sedapal confirmó corte de agua el sábado 10 de 8am a 1pm por mantenimiento de la red. Prevean agua para sus puestos.",
    fecha: "2026-08-06",
    fijado: true,
  },
  {
    id: "an-2",
    asociacionId: "a-ves",
    publicadoPorId: "u-marco",
    publicadoPorNombre: "Marco Huamán Torres",
    titulo: "Reparación del techo del pabellón C ya está en votación",
    contenido:
      "Propuse el gasto de reparación del techo del pabellón C. Ya tiene 2 de 3 firmas — en cuanto se complete, empieza la obra la próxima semana.",
    fecha: "2026-08-05",
    fijado: false,
  },
  {
    id: "an-3",
    asociacionId: "a-ves",
    publicadoPorId: "u-rosario",
    publicadoPorNombre: "Rosario Fernández Paredes",
    titulo: "Ya instalamos las cámaras nuevas",
    contenido:
      "Con el gasto aprobado por todos ustedes, las cámaras del ingreso principal ya están funcionando. Gracias por la confianza.",
    fecha: "2026-07-23",
    fijado: false,
  },
];
