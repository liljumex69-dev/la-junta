"use client";

import { CargadorJunta } from "@/components/junta/cargador-junta";
import { SolicitarAval } from "@/components/junta/solicitar-aval";
import { POSIBLES_AVALES } from "@/lib/minka/mock-data";

export default function AvalPage() {
  return (
    <CargadorJunta>
      {({ junta, yo }) => (
        <SolicitarAval
          junta={junta}
          yo={yo}
          // TODO: conectar a smart contract — traer los miembros con historial
          // suficiente para avalar, con su score y garantía disponible on-chain.
          candidatos={POSIBLES_AVALES.filter((c) => c.id !== yo.id)}
        />
      )}
    </CargadorJunta>
  );
}
