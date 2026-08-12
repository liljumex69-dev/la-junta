"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowSquareOut, ArrowUp, CircleNotch, Warning } from "@phosphor-icons/react/ssr";

import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/common/logo";
import { soles } from "@/lib/junta/format";
import type { MovimientoFondo } from "@/lib/junta/types";

/**
 * Página de verificación en vivo — no forma parte del producto simulado
 * (por eso vive fuera del grupo de rutas `(app)`, sin sesión ni sidebar).
 *
 * Es la prueba de que existe un backend real conectado a un Safe multifirma
 * real en Arbitrum Sepolia: hace un fetch de verdad a la API desplegada y
 * muestra los movimientos tal como los devuelve, con enlaces reales a
 * Arbiscan — nada de esto es data simulada en memoria como el resto de la
 * app. El resto del producto (crear asociación, pagar cuota, firmar
 * propuesta) sigue siendo la simulación de siempre; conectar esos flujos al
 * backend real requiere integración de wallet, que todavía no existe acá.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
const ASOCIACION_ID = process.env.NEXT_PUBLIC_ASOCIACION_DEMO_ID ?? "a-f8b7736d053a";
const SAFE_ADDRESS =
  process.env.NEXT_PUBLIC_SAFE_ADDRESS_DEMO ?? "0x82C095D54fC04F56F4b85a302a555B3b70b06Ec3";

type Estado =
  | { tipo: "cargando" }
  | { tipo: "error"; mensaje: string }
  | { tipo: "listo"; movimientos: MovimientoFondo[] };

export default function VerificacionPage() {
  const [estado, setEstado] = useState<Estado>({ tipo: "cargando" });

  useEffect(() => {
    let cancelado = false;
    fetch(`${API_URL}/asociaciones/${ASOCIACION_ID}/movimientos`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`El backend respondió ${r.status}`);
        return r.json() as Promise<MovimientoFondo[]>;
      })
      .then((movimientos) => {
        if (!cancelado) setEstado({ tipo: "listo", movimientos });
      })
      .catch((e: Error) => {
        if (!cancelado) setEstado({ tipo: "error", mensaje: e.message });
      });
    return () => {
      cancelado = true;
    };
  }, []);

  return (
    <div className="mx-auto min-h-screen w-full max-w-2xl px-4 py-10">
      <Logo size={30} />

      <h1 className="mt-8 text-h2 font-semibold text-marca-texto">
        Verificación en vivo — Arbitrum Sepolia
      </h1>
      <p className="mt-2 text-body text-marca-tenue">
        Esta pantalla hace un fetch real a{" "}
        <code className="rounded bg-marca-superficie px-1.5 py-0.5 text-support">
          {API_URL}
        </code>{" "}
        — no es data simulada. El Safe multifirma real de esta asociación es{" "}
        <a
          href={`https://sepolia.arbiscan.io/address/${SAFE_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-marca-primario underline underline-offset-4"
        >
          {SAFE_ADDRESS}
          <ArrowSquareOut size={13} weight="bold" className="ml-0.5 inline" aria-hidden="true" />
        </a>
        .
      </p>

      <div className="mt-8">
        {estado.tipo === "cargando" ? (
          <div className="flex items-center gap-2 rounded-lg border border-marca-borde bg-marca-superficie p-4 text-support text-marca-tenue">
            <CircleNotch size={18} weight="bold" className="animate-spin" aria-hidden="true" />
            Consultando el backend real…
          </div>
        ) : null}

        {estado.tipo === "error" ? (
          <div className="flex items-start gap-3 rounded-lg border border-marca-peligro/40 bg-[#f3e0de] p-4">
            <Warning size={22} weight="duotone" color="#A6342E" aria-hidden="true" />
            <div>
              <p className="text-body font-semibold text-marca-texto">
                No se pudo conectar al backend
              </p>
              <p className="mt-1 text-support text-marca-tenue">{estado.mensaje}</p>
            </div>
          </div>
        ) : null}

        {estado.tipo === "listo" && estado.movimientos.length === 0 ? (
          <p className="rounded-lg border border-marca-borde bg-marca-superficie p-4 text-support text-marca-tenue">
            El backend respondió correctamente, pero esta asociación todavía no
            tiene movimientos.
          </p>
        ) : null}

        {estado.tipo === "listo" && estado.movimientos.length > 0 ? (
          <ul className="space-y-2">
            {estado.movimientos.map((m) => {
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
                    <a
                      href={`https://sepolia.arbiscan.io/tx/${m.hashSimulado}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="touch-target -ml-0.5 mt-1 flex items-center gap-1 rounded-md text-support font-semibold text-marca-primario underline underline-offset-4"
                    >
                      Ver transacción real en Arbiscan
                      <ArrowSquareOut size={14} weight="bold" aria-hidden="true" />
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <Badge variant="success">Backend real</Badge>
        <Badge variant="success">Arbitrum Sepolia</Badge>
        <Badge>Resto de la app: simulado</Badge>
      </div>
    </div>
  );
}
