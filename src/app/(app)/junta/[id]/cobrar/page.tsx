import { notFound } from "next/navigation";

import { CobrarTurno } from "@/components/junta/cobrar-turno";
import {
  SALDO_GARANTIA_DISPONIBLE,
  buscarJunta,
  miParticipacion,
} from "@/lib/minka/mock-data";

export const metadata = { title: "Cobrar mi turno — Minka" };

export default async function CobrarPage({
  params,
}: PageProps<"/junta/[id]/cobrar">) {
  const { id } = await params;

  const junta = buscarJunta(id);
  if (!junta) notFound();

  const yo = miParticipacion(junta);
  if (!yo) notFound();

  return (
    <CobrarTurno
      junta={junta}
      yo={yo}
      saldoDisponible={SALDO_GARANTIA_DISPONIBLE}
    />
  );
}
