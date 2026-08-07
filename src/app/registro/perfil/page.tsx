import { AuthShell } from "@/components/minka/auth-shell";
import { PerfilForm } from "@/components/registro/perfil-form";

export const metadata = { title: "Tu nombre — Minka" };

export default async function PerfilPage({
  searchParams,
}: PageProps<"/registro/perfil">) {
  const params = await searchParams;
  const invita = typeof params.invita === "string" ? params.invita : undefined;

  return (
    <AuthShell
      titulo="Falta poco"
      volverA="/registro"
      paso={3}
      totalPasos={3}
    >
      <PerfilForm invitadoPor={invita} />
    </AuthShell>
  );
}
