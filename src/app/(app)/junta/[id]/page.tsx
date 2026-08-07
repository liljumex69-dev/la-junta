import { notFound } from "next/navigation";

import { PanelJunta } from "@/components/junta/panel-junta";
import { buscarJunta, miParticipacion } from "@/lib/minka/mock-data";

export default async function JuntaPage({ params }: PageProps<"/junta/[id]">) {
  const { id } = await params;

  // TODO: conectar a smart contract — leer esta junta del contrato en Arbitrum:
  // reglas, participantes, estado de aportes del ciclo y garantías bloqueadas.
  const junta = buscarJunta(id);
  if (!junta) notFound();

  const yo = miParticipacion(junta);
  if (!yo) notFound();

  return <PanelJunta junta={junta} yo={yo} />;
}
