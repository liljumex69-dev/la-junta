"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { FiltroPeriodo, type Periodo } from "@/components/common/filtro-periodo";
import { GraficoTooltip } from "@/components/common/grafico-tooltip";
import { serieMensualAhorro } from "@/lib/junta/series";
import type { MovimientoAhorro } from "@/lib/junta/types";

const EJE = { fontSize: 12, fill: "#7c8a80" };

/**
 * Evolución del saldo de ahorro personal, con filtro de periodo — el mismo
 * componente sirve tanto para un comerciante como para un directivo viendo su
 * propio ahorro, cada quien con su propio historial.
 */
export function GraficoAhorro({ movimientos }: { movimientos: MovimientoAhorro[] }) {
  const [periodo, setPeriodo] = useState<Periodo>("6");

  const serieCompleta = useMemo(() => serieMensualAhorro(movimientos), [movimientos]);
  const serie =
    periodo === "todo" ? serieCompleta : serieCompleta.slice(-Number(periodo));

  if (serieCompleta.length < 2) return null;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-support font-semibold text-marca-tenue">
          Evolución de tu saldo
        </p>
        <FiltroPeriodo valor={periodo} onChange={setPeriodo} />
      </div>

      <div className="mt-2 h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={serie} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="saldoAhorro" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#B8863B" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#B8863B" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#ddd6c4" />
            <XAxis dataKey="etiqueta" tick={EJE} axisLine={false} tickLine={false} />
            <YAxis
              tick={EJE}
              axisLine={false}
              tickLine={false}
              width={52}
              tickFormatter={(v) => `S/ ${v}`}
            />
            <Tooltip
              content={(p) =>
                p.active && p.payload?.length ? (
                  <GraficoTooltip
                    active={p.active}
                    label={p.label as string}
                    payload={[
                      { name: "Saldo", value: p.payload[0].value as number, color: "#B8863B" },
                    ]}
                  />
                ) : null
              }
            />
            <Area
              type="monotone"
              dataKey="saldo"
              stroke="#B8863B"
              strokeWidth={2.5}
              fill="url(#saldoAhorro)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
