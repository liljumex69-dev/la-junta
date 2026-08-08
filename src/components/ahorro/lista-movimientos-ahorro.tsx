import { ArrowDown, ArrowUp } from "@phosphor-icons/react/ssr";

import { Badge } from "@/components/ui/badge";
import { soles } from "@/lib/junta/format";
import type { MovimientoAhorro } from "@/lib/junta/types";

/** Movimientos del ahorro personal, con su categoría siempre visible. */
export function ListaMovimientosAhorro({
  movimientos,
}: {
  movimientos: MovimientoAhorro[];
}) {
  if (movimientos.length === 0) {
    return (
      <p className="rounded-lg border border-marca-borde bg-marca-superficie p-4 text-support text-marca-tenue">
        Todavía no registraste movimientos en tu ahorro.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {movimientos.map((m) => {
        const esIngreso = m.tipo === "ingreso";
        return (
          <li
            key={m.id}
            className="flex items-center gap-3 rounded-lg border border-marca-borde bg-marca-superficie p-4"
          >
            <span
              className={`grid size-10 shrink-0 place-items-center rounded-full ${
                esIngreso ? "bg-[#e3ede6]" : "bg-[#f3e0de]"
              }`}
            >
              {esIngreso ? (
                <ArrowDown size={20} weight="bold" color="#4C8C5C" aria-hidden="true" />
              ) : (
                <ArrowUp size={20} weight="bold" color="#A6342E" aria-hidden="true" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className="truncate text-body font-semibold text-marca-texto">
                  {m.descripcion}
                </p>
                {/* Convención financiera: lo que entra en verde, lo que sale en rojo. */}
                <p
                  className={`shrink-0 text-body font-semibold ${
                    esIngreso ? "text-marca-exito" : "text-marca-peligro"
                  }`}
                >
                  {esIngreso ? "+" : "−"} {soles(m.monto)}
                </p>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="muted">{m.categoria}</Badge>
                <span className="text-support text-marca-tenue">{m.fecha}</span>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
