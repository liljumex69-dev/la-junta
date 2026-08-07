import { notFound } from "next/navigation";

import { FuerzaMayor } from "@/components/junta/fuerza-mayor";
import {
  SOLICITUDES_FUERZA_MAYOR,
  buscarJunta,
  miParticipacion,
} from "@/lib/minka/mock-data";

export const metadata = { title: "Fuerza mayor — Minka" };

export default async function FuerzaMayorPage({
  params,
}: PageProps<"/junta/[id]/fuerza-mayor">) {
  const { id } = await params;

  const junta = buscarJunta(id);
  if (!junta) notFound();
  if (!miParticipacion(junta)) notFound();

  const solicitudes = SOLICITUDES_FUERZA_MAYOR.filter((s) => s.juntaId === id);

  return <FuerzaMayor junta={junta} solicitudes={solicitudes} />;
}
