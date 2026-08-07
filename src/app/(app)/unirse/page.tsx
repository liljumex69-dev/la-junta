import { UnirseJunta } from "@/components/junta/unirse-junta";
import { USUARIO_ACTUAL } from "@/lib/minka/mock-data";

export const metadata = { title: "Unirme a una junta — Minka" };

export default async function UnirsePage({
  searchParams,
}: PageProps<"/unirse">) {
  const params = await searchParams;
  const codigo = typeof params.codigo === "string" ? params.codigo : undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-display font-semibold text-minka-text">
          Unirme a una junta
        </h1>
        <p className="mt-2 text-body text-minka-muted">
          Escribe el código que te compartieron para ver de qué se trata antes de
          entrar.
        </p>
      </div>

      <UnirseJunta codigoInicial={codigo} score={USUARIO_ACTUAL.score} />
    </div>
  );
}
