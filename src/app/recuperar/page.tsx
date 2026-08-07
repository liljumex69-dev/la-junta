import { AuthShell } from "@/components/minka/auth-shell";
import { RecuperarCuenta } from "@/components/recuperar/recuperar-cuenta";
import { CONTACTOS_RECUPERACION } from "@/lib/minka/mock-data";

export const metadata = { title: "Recuperar mi cuenta — Minka" };

export default function RecuperarPage() {
  // TODO: conectar a smart contract — leer los guardianes configurados on-chain
  // para la recuperación social de esta cuenta.
  return (
    <AuthShell
      titulo="Tus contactos de confianza"
      descripcion="Así vuelves a entrar si cambias de celular o pierdes el acceso."
      volverA="/entrar"
    >
      <RecuperarCuenta contactos={CONTACTOS_RECUPERACION} />
    </AuthShell>
  );
}
