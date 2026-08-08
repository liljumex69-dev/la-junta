import { ChartBar, DownloadSimple } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraficoFondo } from "@/components/asociacion/grafico-fondo";
import { soles } from "@/lib/junta/format";
import {
  gastosPorCategoria,
  tasaDeCumplimiento,
  totalGastos,
  totalIngresos,
} from "@/lib/junta/rules";
import type { CuotaComerciante, MovimientoFondo } from "@/lib/junta/types";

/**
 * Dashboard del directivo: ingresos vs. gastos, tasa de cumplimiento de puestos
 * y desglose de gastos por categoría. Solo lo ve quien tiene `rol === "directivo"` —
 * el documento lo reserva para el directorio, no para cualquier comerciante.
 */
export function DashboardDirectivo({
  movimientos,
  cuotas,
}: {
  movimientos: MovimientoFondo[];
  cuotas: CuotaComerciante[];
}) {
  const ingresos = totalIngresos(movimientos);
  const gastos = totalGastos(movimientos);
  const cumplimiento = tasaDeCumplimiento(cuotas);
  const categorias = gastosPorCategoria(movimientos);
  const maxCategoria = Math.max(1, ...categorias.map((c) => c.monto));

  return (
    <Card>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-2">
          <ChartBar size={22} weight="duotone" color="#1F5C3D" aria-hidden="true" />
          <h2 className="text-h3 font-semibold text-marca-texto">
            Dashboard del directorio
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-md bg-[#e3ede6] p-3">
            <p className="text-support text-marca-tenue">Ingresos</p>
            <p className="mt-1 text-body font-semibold text-marca-exito">
              {soles(ingresos)}
            </p>
          </div>
          <div className="rounded-md bg-[#f3e0de] p-3">
            <p className="text-support text-marca-tenue">Gastos</p>
            <p className="mt-1 text-body font-semibold text-marca-peligro">
              {soles(gastos)}
            </p>
          </div>
          <div className="rounded-md bg-marca-fondo p-3">
            <p className="text-support text-marca-tenue">Cumplimiento</p>
            <p className="mt-1 text-body font-semibold text-marca-texto">
              {cumplimiento}%
            </p>
          </div>
        </div>

        <GraficoFondo movimientos={movimientos} />

        {categorias.length > 0 ? (
          <div>
            <p className="text-support font-semibold text-marca-tenue">
              Gastos por categoría
            </p>
            <div className="mt-3 space-y-2.5">
              {categorias.map((c) => (
                <div key={c.categoria}>
                  <div className="flex items-baseline justify-between gap-2 text-support">
                    <span className="font-semibold text-marca-texto">
                      {c.categoria}
                    </span>
                    <span className="text-marca-tenue">{soles(c.monto)}</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-sm bg-[#ece5d3]">
                    <span
                      className="block h-full rounded-sm bg-marca-secundario"
                      style={{ width: `${(c.monto / maxCategoria) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* TODO: conectar a Safe/smart contract — generar el export real a partir del
            historial on-chain, no del estado simulado en memoria. */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => alert("Exportar PDF: disponible cuando el fondo esté conectado a Safe.")}
          >
            <DownloadSimple size={18} weight="bold" aria-hidden="true" />
            Exportar PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => alert("Exportar Excel: disponible cuando el fondo esté conectado a Safe.")}
          >
            <DownloadSimple size={18} weight="bold" aria-hidden="true" />
            Exportar Excel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
