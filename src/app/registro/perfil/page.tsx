import { AuthShell } from "@/components/common/auth-shell";
import { PerfilForm } from "@/components/registro/perfil-form";

export const metadata = { title: "Tus datos — Junta" };

export default async function PerfilPage({
  searchParams,
}: PageProps<"/registro/perfil">) {
  const params = await searchParams;
  const tel = typeof params.tel === "string" ? params.tel : undefined;
  const asociacion =
    typeof params.asociacion === "string" ? params.asociacion : undefined;

  return (
    <AuthShell titulo="Falta poco" volverA="/registro" paso={3} totalPasos={3}>
      <PerfilForm
        telefono={tel?.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3")}
        codigoAsociacion={asociacion}
      />
    </AuthShell>
  );
}
