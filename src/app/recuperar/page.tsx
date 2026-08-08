import { AuthShell } from "@/components/common/auth-shell";
import { RecuperarCuenta } from "@/components/recuperar/recuperar-cuenta";

export const metadata = { title: "Recuperar mi cuenta — Junta" };

export default function RecuperarPage() {
  return (
    <AuthShell
      titulo="Tus contactos de confianza"
      descripcion="Así vuelves a entrar si cambias de celular o pierdes el acceso."
      volverA="/entrar"
    >
      <RecuperarCuenta />
    </AuthShell>
  );
}
