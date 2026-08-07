import { notFound } from "next/navigation";

import { AportarCuota } from "@/components/junta/aportar-cuota";
import { buscarJunta, miParticipacion } from "@/lib/minka/mock-data";

export const metadata = { title: "Aportar mi cuota — Minka" };

export default async function AportarPage({
  params,
}: PageProps<"/junta/[id]/aportar">) {
  const { id } = await params;

  const junta = buscarJunta(id);
  if (!junta) notFound();

  const yo = miParticipacion(junta);
  if (!yo) notFound();

  return <AportarCuota junta={junta} yo={yo} />;
}
