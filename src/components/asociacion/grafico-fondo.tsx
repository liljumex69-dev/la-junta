"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { FiltroPeriodo, type Periodo } from "@/components/common/filtro-periodo";
import { GraficoTooltip } from "@/components/common/grafico-tooltip";
import { serieMensualFondo } from "@/lib/junta/series";
import type { MovimientoFondo } from "@/lib/junta/types";

const EJE = { fontSize: 12, fill: "#7c8a80" };

/**
 * Fondo total en el tiempo, e ingresos vs. gastos por mes — con filtro de
 * periodo. El documento pide exactamente esto para el dashboard del
 * directorio ("fondo total en el tiempo, ingresos vs. gastos"); antes solo
 * había tres tarjetas de totales, sin nada que se pudiera leer como
 * evolución ni acotar a un rango de fechas.
 */
export function GraficoFondo({ movimientos }: { movimientos: MovimientoFondo[] }) {
  const [periodo, setPeriodo] = useState<Periodo>("6");

  const serieCompleta = useMemo(() => serieMensualFondo(movimientos), [movimientos]);
  const serie =
    periodo === "todo" ? serieCompleta : serieCompleta.slice(-Number(periodo));

  if (serieCompleta.length < 2) {
    return (
      <p className="rounded-lg border border-marca-borde bg-marca-superficie p-4 text-support text-marca-tenue">
        Todavía no hay suficiente historial para graficar la evolución del fondo.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-support font-semibold text-marca-tenue">
          Fondo total en el tiempo
        </p>
        <FiltroPeriodo valor={periodo} onChange={setPeriodo} />
      </div>

      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={serie} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="saldoFondo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1F5C3D" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#1F5C3D" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#ddd6c4" />
            <XAxis dataKey="etiqueta" tick={EJE} axisLine={false} tickLine={false} />
            <YAxis
              tick={EJE}
              axisLine={false}
              tickLine={false}
              width={56}
              tickFormatter={(v) => `S/ ${Math.round(v / 1000)}k`}
            />
            <Tooltip
              content={(p) =>
                p.active && p.payload?.length ? (
                  <GraficoTooltip
                    active={p.active}
                    label={p.label as string}
                    payload={[
                      { name: "Saldo", value: p.payload[0].value as number, color: "#1F5C3D" },
                    ]}
                  />
                ) : null
              }
            />
            <Area
              type="monotone"
              dataKey="saldo"
              stroke="#1F5C3D"
              strokeWidth={2.5}
              fill="url(#saldoFondo)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div>
        <p className="text-support font-semibold text-marca-tenue">
          Ingresos vs. gastos por mes
        </p>
        <div className="mt-2 h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={serie} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#ddd6c4" />
              <XAxis dataKey="etiqueta" tick={EJE} axisLine={false} tickLine={false} />
              <YAxis
                tick={EJE}
                axisLine={false}
                tickLine={false}
                width={56}
                tickFormatter={(v) => `S/ ${Math.round(v / 1000)}k`}
              />
              <Tooltip
                content={(p) =>
                  p.active && p.payload?.length ? (
                    <GraficoTooltip
                      active={p.active}
                      label={p.label as string}
                      payload={p.payload.map((entry) => ({
                        name: entry.name === "entradas" ? "Ingresos" : "Gastos",
                        value: entry.value as number,
                        color: entry.color,
                      }))}
                    />
                  ) : null
                }
              />
              <Bar dataKey="entradas" name="entradas" fill="#4C8C5C" radius={[3, 3, 0, 0]} />
              <Bar dataKey="salidas" name="salidas" fill="#A6342E" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
