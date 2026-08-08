"use client";

import { useState } from "react";
import { ArrowDown, ArrowSquareOut, ArrowUp, CheckCircle } from "@phosphor-icons/react/ssr";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { soles } from "@/lib/junta/format";
import type { MovimientoFondo } from "@/lib/junta/types";

/**
 * Historial de movimientos del fondo: cada cuota que entra y cada gasto que
 * se ejecutó tras juntar sus firmas. "Ver en Arbiscan" abre un modal con el
 * detalle simulado de la transacción — todavía no hay un explorador real al
 * que enlazar, así que el clic tiene que llevar a algún lado en vez de no
 * hacer nada.
 */
export function ListaMovimientos({
  movimientos,
}: {
  movimientos: MovimientoFondo[];
}) {
  const [seleccionado, setSeleccionado] = useState<MovimientoFondo | null>(null);

  if (movimientos.length === 0) {
    return (
      <p className="rounded-lg border border-marca-borde bg-marca-superficie p-4 text-support text-marca-tenue">
        Todavía no hay movimientos registrados en el fondo.
      </p>
    );
  }

  return (
    <>
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
                  {/* Convención financiera: lo que entra en verde, lo que sale del
                      fondo en rojo — es una salida real de dinero, no un dato neutro. */}
                  <p
                    className={`shrink-0 text-body font-semibold ${
                      esIngreso ? "text-marca-exito" : "text-marca-peligro"
                    }`}
                  >
                    {esIngreso ? "+" : "−"} {soles(m.monto)}
                  </p>
                </div>
                <p className="mt-0.5 text-support text-marca-tenue">
                  {m.fecha}
                  {m.categoria ? ` · ${m.categoria}` : ""}
                </p>
                <button
                  type="button"
                  onClick={() => setSeleccionado(m)}
                  className="touch-target -ml-0.5 mt-1 flex items-center gap-1 rounded-md text-support font-semibold text-marca-primario underline underline-offset-4"
                >
                  Ver en Arbiscan ({m.hashSimulado})
                  <ArrowSquareOut size={14} weight="bold" aria-hidden="true" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <Dialog open={!!seleccionado} onOpenChange={(o) => !o && setSeleccionado(null)}>
        <DialogContent className="w-full max-w-sm bg-marca-fondo">
          {seleccionado ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-h3 font-semibold text-marca-texto">
                  <CheckCircle size={22} weight="fill" color="#4C8C5C" aria-hidden="true" />
                  Transacción confirmada
                </DialogTitle>
                <DialogDescription className="text-support text-marca-tenue">
                  Vista simulada del explorador de Arbitrum — se conecta cuando
                  el fondo pase a operar sobre el Safe real.
                </DialogDescription>
              </DialogHeader>

              <dl className="divide-y divide-marca-borde rounded-lg border border-marca-borde bg-marca-superficie">
                <div className="flex justify-between gap-4 p-3">
                  <dt className="text-support text-marca-tenue">Hash</dt>
                  <dd className="text-support font-semibold text-marca-texto">
                    {seleccionado.hashSimulado}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 p-3">
                  <dt className="text-support text-marca-tenue">Tipo</dt>
                  <dd>
                    <Badge variant={seleccionado.tipo === "cuota" ? "success" : "danger"}>
                      {seleccionado.tipo === "cuota" ? "Cuota" : "Gasto ejecutado"}
                    </Badge>
                  </dd>
                </div>
                <div className="flex justify-between gap-4 p-3">
                  <dt className="text-support text-marca-tenue">Monto</dt>
                  <dd
                    className={`text-support font-semibold ${
                      seleccionado.tipo === "cuota" ? "text-marca-exito" : "text-marca-peligro"
                    }`}
                  >
                    {seleccionado.tipo === "cuota" ? "+" : "−"} {soles(seleccionado.monto)}
                  </dd>
                </div>
                {seleccionado.categoria ? (
                  <div className="flex justify-between gap-4 p-3">
                    <dt className="text-support text-marca-tenue">Categoría</dt>
                    <dd className="text-support font-semibold text-marca-texto">
                      {seleccionado.categoria}
                    </dd>
                  </div>
                ) : null}
                <div className="flex justify-between gap-4 p-3">
                  <dt className="text-support text-marca-tenue">Fecha</dt>
                  <dd className="text-support font-semibold text-marca-texto">
                    {seleccionado.fecha}
                  </dd>
                </div>
                <div className="p-3">
                  <dt className="text-support text-marca-tenue">Descripción</dt>
                  <dd className="mt-1 text-body text-marca-texto">
                    {seleccionado.descripcion}
                  </dd>
                </div>
              </dl>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
