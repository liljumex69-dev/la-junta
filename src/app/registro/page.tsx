import { AuthShell } from "@/components/minka/auth-shell";
import { RegistroForm } from "@/components/registro/registro-form";

export const metadata = { title: "Crear cuenta — Minka" };

export default async function RegistroPage({
  searchParams,
}: PageProps<"/registro">) {
  const params = await searchParams;
  // Si llega por un link de invitación, se guarda de quién vino y a qué junta,
  // para inscribirlo automáticamente al terminar el registro.
  const invita = typeof params.invita === "string" ? params.invita : undefined;
  const junta = typeof params.junta === "string" ? params.junta : undefined;

  return (
    <AuthShell
      titulo="Crea tu cuenta"
      descripcion="Con tu número de celular basta. No necesitas nada más."
      volverA="/"
      paso={1}
      totalPasos={3}
    >
      <RegistroForm invitadoPor={invita} codigoJunta={junta} />
    </AuthShell>
  );
}
