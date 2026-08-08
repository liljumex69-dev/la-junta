/**
 * Modelo de dominio de Junta.
 *
 * Este prototipo es solo interfaz: todo lo que aquí se representa como estado en
 * memoria de React será, en el producto real, estado leído de un Safe (Gnosis Safe)
 * multifirma y de un contrato Stylus en Arbitrum. Los puntos exactos de conexión
 * están marcados con `// TODO: conectar a Safe/smart contract`.
 *
 * Ninguno de los conceptos de Minka (turnos rotativos, prima, aval, garantía
 * individual, score de reputación, modo tradicional/protegido) existe aquí. Junta
 * no es una junta/pandero: es la tesorería de una asociación de comerciantes,
 * gobernada por firma múltiple de un directorio. No hay pozo que rota — hay un
 * fondo colectivo permanente que solo se mueve cuando el umbral de firmas se cumple.
 */

export type Rol = "comerciante" | "directivo";

export type CargoDirectivo =
  | "presidente"
  | "tesorero"
  | "secretario"
  | "vocal"
  | "otro";

export interface Usuario {
  id: string;
  nombre: string;
  dni: string;
  telefono: string;
  iniciales: string;
  /** Color de fondo del avatar cuando no hay foto — se usa junto a las iniciales. */
  colorAvatar?: string;
  /**
   * Foto de perfil, simulada: se guarda como data URL en memoria (nunca sube a
   * ningún servidor ni se persiste entre recargas). Si está presente, reemplaza
   * el círculo de iniciales+color en todos los avatares del usuario.
   */
  fotoUrl?: string;
  rol: Rol;
  /** Solo si `rol === "directivo"`. */
  cargo?: CargoDirectivo;
  /** Solo si `cargo === "otro"` — el título que escribió la asociación. */
  cargoPersonalizado?: string;
  /** Id de la asociación activa — la que se ve en inicio, el fondo, etc. `null` si
   * todavía no se unió a ninguna. */
  asociacionId: string | null;
  /**
   * Todas las asociaciones a las que pertenece, incluida la activa. Permite que un
   * mismo directivo funde o se una a más de una asociación y cambie entre ellas.
   *
   * Simplificación deliberada del prototipo: rol, cargo y número de puesto son del
   * usuario, no de cada membresía — cambiar de asociación activa no los recalcula
   * por asociación. En producción cada membresía tendría su propio rol.
   */
  asociacionesIds: string[];
  /** Número de puesto en el mercado, para comerciantes. */
  numeroPuesto?: string;
}

/** Tasa de mora: cada asociación decide si existe y cuánto es. Nunca una regla fija de la plataforma. */
export interface ConfiguracionMora {
  activa: boolean;
  /** Porcentaje de recargo sobre la cuota, solo relevante si `activa`. */
  porcentaje: number;
  /** Días de gracia antes de considerar mora. */
  diasGracia: number;
}

export interface ConfiguracionAsociacion {
  /** Firmas necesarias para ejecutar una propuesta de gasto. Ej: 3. */
  umbralFirmas: number;
  /** Total de directivos con poder de firma. Ej: 5 → "3 de 5". */
  totalFirmantes: number;
  mora: ConfiguracionMora;
  notificacionesActivas: boolean;
}

/**
 * Directivo nombrado al fundar la asociación, antes de que tenga cuenta propia.
 * En el prototipo es solo texto informativo para definir el directorio inicial y el
 * umbral — en producción, cada uno se convierte en firmante real del Safe cuando
 * completa su propio registro con el enlace que le llega.
 */
export interface DirectivoInicial {
  nombre: string;
  cargo: CargoDirectivo;
  /** Solo si `cargo === "otro"`. */
  cargoPersonalizado?: string;
}

export interface Asociacion {
  id: string;
  nombreMercado: string;
  numeroPuestos: number;
  codigoInvitacion: string;
  configuracion: ConfiguracionAsociacion;
  /** Categorías de gasto/ingreso, compartidas entre el panel del fondo y el ahorro personal. */
  categorias: string[];
  /** Directorio declarado al fundar, sin contar al fundador (que sí tiene cuenta). */
  directivosIniciales: DirectivoInicial[];
  creadaEn: string;
}

export type EstadoCuota = "pagado" | "pendiente" | "mora";

export interface CuotaComerciante {
  id: string;
  asociacionId: string;
  comercianteId: string;
  /** Periodo en formato "2026-08". */
  periodo: string;
  monto: number;
  estado: EstadoCuota;
  fechaPago?: string;
  fechaVencimiento: string;
}

export type EstadoPropuesta = "pendiente" | "ejecutada" | "rechazada";

export interface FirmaPropuesta {
  directivoId: string;
  directivoNombre: string;
  fecha: string;
}

export interface PropuestaGasto {
  id: string;
  asociacionId: string;
  propuestoPorId: string;
  propuestoPorNombre: string;
  monto: number;
  motivo: string;
  categoria: string;
  fecha: string;
  firmas: FirmaPropuesta[];
  /** Umbral vigente al momento de proponer — congelado, no cambia si luego se reconfigura la asociación. */
  umbralRequerido: number;
  estado: EstadoPropuesta;
  fechaEjecucion?: string;
}

export type TipoMovimientoFondo = "cuota" | "gasto";

export interface MovimientoFondo {
  id: string;
  asociacionId: string;
  tipo: TipoMovimientoFondo;
  monto: number;
  fecha: string;
  descripcion: string;
  categoria?: string;
  /** Referencia a quien pagó (cuota) o a la propuesta ejecutada (gasto). */
  referenciaId: string;
  /** Enlace simulado a la transacción verificable. */
  hashSimulado: string;
}

export interface MovimientoAhorro {
  id: string;
  comercianteId: string;
  tipo: "ingreso" | "egreso";
  monto: number;
  categoria: string;
  fecha: string;
  descripcion: string;
}

export interface Anuncio {
  id: string;
  asociacionId: string;
  publicadoPorId: string;
  publicadoPorNombre: string;
  titulo: string;
  contenido: string;
  fecha: string;
  fijado: boolean;
}

export interface ContactoConfianza {
  id: string;
  nombre: string;
  iniciales: string;
}

export type TipoNotificacion =
  | "recordatorio_cuota"
  | "propuesta_pendiente"
  | "propuesta_ejecutada"
  | "anuncio";

export interface Notificacion {
  id: string;
  /** Destinatario. */
  usuarioId: string;
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
  /** Ruta a la que lleva al tocarla, si aplica. */
  enlace?: string;
}
