import { AuthShell } from "@/components/minka/auth-shell";
import { PerfilForm } from "@/components/registro/perfil-form";

export const metadata = { title: "Tu nombre — Minka" };

export default async function PerfilPage({
  searchParams,
}: PageProps<"/registro/perfil">) {
  const params = await searchParams;
  const tel = typeof params.tel === "string" ? params.tel : undefined;
  const junta = typeof params.junta === "string" ? params.junta : undefined;
  const invita = typeof params.invita === "string" ? params.invita : undefined;

  return (
    <AuthShell titulo="Falta poco" volverA="/registro" paso={3} totalPasos={3}>
      <PerfilForm
        telefono={tel?.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3")}
        codigoJunta={junta}
        invitadoPor={invita}
      />
    </AuthShell>
  );
}
