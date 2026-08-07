import Link from "next/link";
import { AuthShell } from "@/components/minka/auth-shell";
import { EntrarForm } from "@/components/registro/entrar-form";

export const metadata = { title: "Entrar — Minka" };

export default function EntrarPage() {
  return (
    <AuthShell
      titulo="Entra a Minka"
      descripcion="Con el mismo número con el que te registraste."
      volverA="/"
    >
      <EntrarForm />
      <p className="mt-8 text-support text-minka-muted">
        ¿Perdiste el acceso a tu número?{" "}
        <Link
          href="/recuperar"
          className="font-semibold text-minka-primary underline underline-offset-4"
        >
          Recupera tu cuenta con tus contactos de confianza
        </Link>
        .
      </p>
    </AuthShell>
  );
}
