"use client";

import { DownloadSimple } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Aparecer } from "@/components/common/aparecer";
import { TarjetaSaldoAhorro } from "@/components/ahorro/tarjeta-saldo-ahorro";
import { FormularioMovimientoAhorro } from "@/components/ahorro/formulario-movimiento-ahorro";
import { ListaMovimientosAhorro } from "@/components/ahorro/lista-movimientos-ahorro";
import { EvolucionAhorro } from "@/components/ahorro/evolucion-ahorro";
import { useJunta } from "@/lib/junta/context";

export default function AhorroPage() {
  const { usuario, ahorro } = useJunta();

  if (!usuario) return null;

  const saldo = ahorro.reduce(
    (s, m) => s + (m.tipo === "ingreso" ? m.monto : -m.monto),
    0
  );

  return (
    <div className="space-y-6">
      <Aparecer>
        <h1 className="text-display font-semibold text-marca-texto">
          Mi ahorro
        </h1>
        <p className="mt-1 text-body text-marca-tenue">
          Un espacio tuyo, aparte del fondo de la asociación.
        </p>
      </Aparecer>

      <Aparecer retraso={0.05}>
        <TarjetaSaldoAhorro saldo={saldo} />
      </Aparecer>

      <EvolucionAhorro movimientos={ahorro} />

      <FormularioMovimientoAhorro />

      {/* TODO: conectar a Safe/smart contract — no aplica aquí: el ahorro personal
          es intencionalmente ajeno al Safe de la asociación. El export sí debería
          generarse desde este mismo estado cuando exista persistencia real. */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={() => alert("Exportar PDF: disponible próximamente.")}
        >
          <DownloadSimple size={18} weight="bold" aria-hidden="true" />
          Exportar PDF
        </Button>
        <Button
          variant="outline"
          onClick={() => alert("Exportar Excel: disponible próximamente.")}
        >
          <DownloadSimple size={18} weight="bold" aria-hidden="true" />
          Exportar Excel
        </Button>
      </div>

      <section>
        <h2 className="text-h2 font-semibold text-marca-texto">
          Tus movimientos
        </h2>
        <div className="mt-4">
          <ListaMovimientosAhorro movimientos={ahorro} />
        </div>
      </section>
    </div>
  );
}
