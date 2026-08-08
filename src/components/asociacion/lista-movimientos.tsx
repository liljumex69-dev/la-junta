import { ArrowDown, ArrowUp, ArrowSquareOut } from "@phosphor-icons/react/ssr";

import { soles } from "@/lib/junta/format";
import type { MovimientoFondo } from "@/lib/junta/types";

/**
 * Historial de movimientos del fondo: cada cuota que entra y cada gasto que
 * se ejecutó tras juntar sus firmas. El enlace "Ver en Arbiscan" es simulado —
 * en producción apunta a la transacción real del Safe en Arbitrum.
 */
export function ListaMovimientos({
  movimientos,
}: {
  movimientos: MovimientoFondo[];
}) {
  if (movimientos.length === 0) {
    return (
      <p className="rounded-lg border border-marca-borde bg-marca-superficie p-4 text-support text-marca-tenue">
        Todavía no hay movimientos registrados en el fondo.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {movimientos.map((m) => {
        const esIngreso = m.tipo === "cuota";
        return (
          <li
            key={m.id}
            className="flex items-start gap-3 rounded-lg border border-marca-borde bg-marca-superficie p-4"
          >
            <span
              className={`grid size-10 shrink-0 place-items-center rounded-full ${
                esIngreso ? "bg-[#e3ede6]" : "bg-[#f5e9d3]"
              }`}
            >
              {esIngreso ? (
                <ArrowDown size={20} weight="bold" color="#4C8C5C" aria-hidden="true" />
              ) : (
                <ArrowUp size={20} weight="bold" color="#B8863B" aria-hidden="true" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className="truncate text-body font-semibold text-marca-texto">
                  {m.descripcion}
                </p>
                <p
                  className={`shrink-0 text-body font-semibold ${
                    esIngreso ? "text-marca-exito" : "text-marca-texto"
                  }`}
                >
                  {esIngreso ? "+" : "−"} {soles(m.monto)}
                </p>
              </div>
              <p className="mt-0.5 text-support text-marca-tenue">
                {m.fecha}
                {m.categoria ? ` · ${m.categoria}` : ""}
              </p>
              {/* TODO: conectar a Safe/smart contract — enlazar a la transacción real
                  en Arbiscan usando el hash de la ejecución en el Safe. */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="mt-1 flex items-center gap-1 text-support font-semibold text-marca-primario underline underline-offset-4"
              >
                Ver en Arbiscan ({m.hashSimulado})
                <ArrowSquareOut size={14} weight="bold" aria-hidden="true" />
              </a>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
