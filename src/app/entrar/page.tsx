import Link from "next/link";
import { AuthShell } from "@/components/common/auth-shell";
import { EntrarForm } from "@/components/registro/entrar-form";

export const metadata = { title: "Entrar — Junta" };

export default function EntrarPage() {
  return (
    <AuthShell
      titulo="Entra a Junta"
      descripcion="Con el mismo número con el que te registraste."
      volverA="/"
    >
      <EntrarForm />
      <p className="mt-8 text-support text-marca-tenue">
        ¿Perdiste el acceso a tu número?{" "}
        <Link
          href="/recuperar"
          className="font-semibold text-marca-primario underline underline-offset-4"
        >
          Recupera tu cuenta con tus contactos de confianza
        </Link>
        .
      </p>
    </AuthShell>
  );
}
