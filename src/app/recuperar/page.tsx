"use client";

import { AuthShell } from "@/components/minka/auth-shell";
import { RecuperarCuenta } from "@/components/recuperar/recuperar-cuenta";
import { useSesion } from "@/lib/minka/prototipo/sesion";

export default function RecuperarPage() {
  // TODO: conectar a backend — leer los guardianes configurados para la
  // recuperación social de esta cuenta.
  const { contactos, agregarContacto, quitarContacto, usuario } = useSesion();

  return (
    <AuthShell
      titulo="Tus contactos de confianza"
      descripcion="Así vuelves a entrar si cambias de celular o pierdes el acceso."
      volverA={usuario ? "/historial" : "/entrar"}
    >
      <RecuperarCuenta
        contactos={contactos}
        onAgregar={agregarContacto}
        onQuitar={quitarContacto}
      />
    </AuthShell>
  );
}
