import { AuthShell } from "@/components/common/auth-shell";
import { RegistroForm } from "@/components/registro/registro-form";

export const metadata = { title: "Crear cuenta — Junta" };

export default async function RegistroPage({
  searchParams,
}: PageProps<"/registro">) {
  const params = await searchParams;
  // Si llega por un enlace de invitación a una asociación, se guarda el código para
  // inscribirlo automáticamente al terminar el registro.
  const asociacion =
    typeof params.asociacion === "string" ? params.asociacion : undefined;

  return (
    <AuthShell
      titulo="Crea tu cuenta"
      descripcion="Con tu número de celular basta. No necesitas nada más."
      volverA="/"
      paso={1}
      totalPasos={3}
    >
      <RegistroForm codigoAsociacion={asociacion} />
    </AuthShell>
  );
}
