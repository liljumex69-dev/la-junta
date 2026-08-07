"use client";

import { CargadorJunta } from "@/components/junta/cargador-junta";
import { PanelJunta } from "@/components/junta/panel-junta";

export default function JuntaPage() {
  return (
    <CargadorJunta>
      {({ junta, yo }) => <PanelJunta junta={junta} yo={yo} />}
    </CargadorJunta>
  );
}
