"use client";

import { CargadorJunta } from "@/components/junta/cargador-junta";
import { FuerzaMayor } from "@/components/junta/fuerza-mayor";
import { SOLICITUDES_FUERZA_MAYOR } from "@/lib/minka/mock-data";

export default function FuerzaMayorPage() {
  return (
    <CargadorJunta>
      {({ junta }) => (
        <FuerzaMayor
          junta={junta}
          solicitudes={SOLICITUDES_FUERZA_MAYOR.filter(
            (s) => s.juntaId === junta.id
          )}
        />
      )}
    </CargadorJunta>
  );
}
