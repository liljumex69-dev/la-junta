import { redirect } from "next/navigation";

/**
 * "El fondo" se unificó con "Inicio" — eran casi la misma pantalla repetida
 * (mismo saldo, mismas propuestas, mismos botones). Se mantiene esta ruta
 * como redirección para no romper los enlaces existentes (`href="/fondo"`)
 * que siguen viviendo en confirmaciones y otras pantallas.
 */
export default function FondoPage() {
  redirect("/inicio");
}
