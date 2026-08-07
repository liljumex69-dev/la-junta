"use client";

import { CargadorJunta } from "@/components/junta/cargador-junta";
import { CobrarTurno } from "@/components/junta/cobrar-turno";
import { SALDO_GARANTIA_DISPONIBLE } from "@/lib/minka/mock-data";

export default function CobrarPage() {
  return (
    <CargadorJunta>
      {({ junta, yo }) => (
        <CobrarTurno
          junta={junta}
          yo={yo}
          saldoDisponible={SALDO_GARANTIA_DISPONIBLE}
        />
      )}
    </CargadorJunta>
  );
}
