import { AuthShell } from "@/components/minka/auth-shell";
import { CorreoForm } from "@/components/registro/correo-form";

export const metadata = { title: "Crear cuenta con correo — Minka" };

export default function CorreoPage() {
  return (
    <AuthShell
      titulo="Crea tu cuenta con correo"
      descripcion="También puedes registrarte con tu correo. El celular sigue siendo la forma más rápida."
      volverA="/registro"
    >
      <CorreoForm />
    </AuthShell>
  );
}
