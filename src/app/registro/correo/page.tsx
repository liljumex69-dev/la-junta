import { AuthShell } from "@/components/common/auth-shell";
import { CorreoForm } from "@/components/registro/correo-form";

export const metadata = { title: "Crear cuenta con correo — Junta" };

export default async function CorreoPage({
  searchParams,
}: PageProps<"/registro/correo">) {
  const params = await searchParams;
  const asociacion =
    typeof params.asociacion === "string" ? params.asociacion : undefined;

  return (
    <AuthShell
      titulo="Crea tu cuenta con correo"
      descripcion="También puedes registrarte con tu correo. El celular sigue siendo la forma más rápida."
      volverA="/registro"
    >
      <CorreoForm codigoAsociacion={asociacion} />
    </AuthShell>
  );
}
