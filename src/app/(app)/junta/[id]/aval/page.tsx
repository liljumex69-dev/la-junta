import { notFound } from "next/navigation";

import { SolicitarAval } from "@/components/junta/solicitar-aval";
import {
  POSIBLES_AVALES,
  buscarJunta,
  miParticipacion,
} from "@/lib/minka/mock-data";

export const metadata = { title: "Pedir un aval — Minka" };

export default async function AvalPage({ params }: PageProps<"/junta/[id]/aval">) {
  const { id } = await params;

  const junta = buscarJunta(id);
  if (!junta) notFound();

  const yo = miParticipacion(junta);
  if (!yo) notFound();

  // TODO: conectar a smart contract — traer los miembros de la junta y contactos con
  // historial suficiente para avalar, con su score y garantía disponible on-chain.
  const candidatos = POSIBLES_AVALES.filter((c) => c.id !== yo.id);

  return <SolicitarAval junta={junta} yo={yo} candidatos={candidatos} />;
}
