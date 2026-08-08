import { redirect } from "next/navigation";

/**
 * El tablón de anuncios ahora vive dentro de Inicio (columna secundaria, con
 * su propio scroll y el formulario de publicar) — no se aprovechaba como
 * sección aparte. Se mantiene esta ruta como redirección para no romper
 * enlaces existentes (`href="/anuncios"`, notificaciones, etc.).
 */
export default function AnunciosPage() {
  redirect("/inicio");
}
