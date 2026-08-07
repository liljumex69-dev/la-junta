import { AuthShell } from "@/components/minka/auth-shell";
import { CodigoForm } from "@/components/registro/codigo-form";

export const metadata = { title: "Confirma tu número — Minka" };

export default async function CodigoPage({
  searchParams,
}: PageProps<"/registro/codigo">) {
  const params = await searchParams;
  const tel = typeof params.tel === "string" ? params.tel : "987654321";
  const invita = typeof params.invita === "string" ? params.invita : undefined;
  const junta = typeof params.junta === "string" ? params.junta : undefined;

  const formateado = tel.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");

  return (
    <AuthShell
      titulo="Confirma tu número"
      descripcion="Te mandamos un mensaje con un código. Escríbelo aquí para terminar."
      volverA="/registro"
      paso={2}
      totalPasos={3}
    >
      <CodigoForm
        telefono={formateado}
        invitadoPor={invita}
        codigoJunta={junta}
      />
    </AuthShell>
  );
}
