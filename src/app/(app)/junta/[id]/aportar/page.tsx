"use client";

import { AportarCuota } from "@/components/junta/aportar-cuota";
import { CargadorJunta } from "@/components/junta/cargador-junta";

export default function AportarPage() {
  return (
    <CargadorJunta>
      {({ junta, yo }) => <AportarCuota junta={junta} yo={yo} />}
    </CargadorJunta>
  );
}
