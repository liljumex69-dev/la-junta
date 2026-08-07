"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CaretLeft, CheckCircle, Info } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/minka/spinner";
import { ETIQUETA_FRECUENCIA, soles, turnoOrdinal } from "@/lib/minka/format";
import { calcularAporteDelCiclo, repartoDePrima } from "@/lib/minka/rules";
import { claveCiclo, useEstadoPrototipo } from "@/lib/minka/prototipo-estado";
import type { Junta, Participante } from "@/lib/minka/types";

/**
 * Aportar cuota. Confirmación simple, un solo paso.
 *
 * Todos los montos de esta pantalla se muestran a 16px o más, sin excepción: el
 * sistema de diseño prohíbe reducir el tamaño de texto en flujos de pago o de
 * confirmación de montos, y el total va a 32px porque es la cifra que la persona
 * necesita reconocer de un vistazo antes de confirmar.
 */
export function AportarCuota({
  junta,
  yo,
}: {
  junta: Junta;
  yo: Participante;
}) {
  const router = useRouter();
  const { marcar } = useEstadoPrototipo();
  const [pagando, setPagando] = useState(false);
  const [listo, setListo] = useState(false);

  const aporte = calcularAporteDelCiclo(junta, yo);
  const reparto = repartoDePrima(aporte.prima);
  const esUltimoTurno = yo.turno === junta.totalParticipantes;

  async function confirmar() {
    if (pagando) return;
    setPagando(true);

    // TODO: conectar a smart contract — ejecutar el aporte del ciclo actual:
    // transferir cuota + prima al contrato de la junta, registrar el pago del
    // participante y repartir la prima entre el fondo colectivo y el fee de plataforma.
    await new Promise((r) => setTimeout(r, 1100));

    marcar("aportado", claveCiclo(junta.id, junta.cicloActual));
    setPagando(false);
    setListo(true);
  }

  useEffect(() => {
    if (!listo) return;
    const id = window.setTimeout(() => router.push(`/junta/${junta.id}`), 1600);
    return () => window.clearTimeout(id);
  }, [listo, router, junta.id]);

  if (listo) {
    return (
      <div
        className="flex flex-col items-center py-14 text-center"
        role="status"
        aria-live="polite"
      >
        <span className="grid size-24 place-items-center rounded-full bg-[#e6ecdf]">
          <CheckCircle size={60} weight="fill" color="#4B6B3A" aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-h2 font-semibold text-minka-text">
          Cuota aportada
        </h1>
        <p className="mt-2 text-h3 font-semibold text-minka-text">
          {soles(aporte.total)}
        </p>
        <p className="mt-2 max-w-sm text-body text-minka-muted">
          Ya quedó registrada en “{junta.nombre}”. Te avisamos por WhatsApp antes de
          la próxima fecha.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href={`/junta/${junta.id}`}
        className="touch-target -ml-3 flex w-fit items-center gap-1 rounded-md pr-3 text-body font-semibold text-minka-text transition-colors hover:bg-[#ece4d8]"
      >
        <CaretLeft size={22} weight="bold" aria-hidden="true" />
        Volver a la junta
      </Link>

      <div>
        <h1 className="text-display font-semibold text-minka-text">
          Aportar mi cuota
        </h1>
        <p className="mt-2 text-body text-minka-muted">
          {junta.nombre} · {ETIQUETA_FRECUENCIA[junta.frecuencia].toLowerCase()} ·
          vence el {junta.proximoPago}
        </p>
      </div>

      {/* Desglose. Nada por debajo de 16px en toda esta tarjeta. */}
      <div className="rounded-lg border-2 border-minka-border bg-minka-surface">
        <dl className="divide-y divide-minka-border">
          <div className="flex items-center justify-between gap-4 p-5">
            <dt className="text-body text-minka-text">Tu cuota</dt>
            <dd className="text-h3 font-semibold text-minka-text">
              {soles(aporte.cuota)}
            </dd>
          </div>

          {aporte.prima > 0 ? (
            <div className="flex items-center justify-between gap-4 p-5">
              <dt className="text-body text-minka-text">
                Prima por tu turno {turnoOrdinal(yo.turno)}
                <span className="mt-1 block text-support text-minka-muted">
                  {/* La explicación se ajusta a la posición real del turno: decirle
                      "cobras temprano" a quien tiene el 7.º de 10 sería falso. */}
                  {yo.turno === 1
                    ? "Es la prima más alta: cobras primero y usas el dinero del grupo todo el tiempo"
                    : yo.turno <= junta.totalParticipantes / 2
                      ? "Porque cobras temprano y usas el dinero del grupo más tiempo"
                      : "Ya es baja porque tu turno es de los últimos"}
                </span>
              </dt>
              <dd className="shrink-0 text-h3 font-semibold text-minka-text">
                {soles(aporte.prima)}
              </dd>
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-4 bg-minka-bg p-5">
            <dt className="text-h3 font-semibold text-minka-text">Total</dt>
            <dd className="text-[32px] leading-tight font-semibold text-minka-text">
              {soles(aporte.total)}
            </dd>
          </div>
        </dl>
      </div>

      {aporte.prima > 0 ? (
        <p className="flex gap-3 rounded-lg border border-minka-border bg-minka-surface p-4 text-body text-minka-text">
          <Info size={24} weight="duotone" color="#BF312A" className="shrink-0" aria-hidden="true" />
          <span>
            De tu prima, {soles(reparto.fondoColectivo)} van al fondo que protege a
            tu grupo y {soles(reparto.plataforma)} al servicio de Minka. La prima baja
            en cada turno y en el último no se paga nada.
          </span>
        </p>
      ) : esUltimoTurno ? (
        <p className="flex gap-3 rounded-lg border border-minka-border bg-minka-surface p-4 text-body text-minka-text">
          <Info size={24} weight="duotone" color="#4B6B3A" className="shrink-0" aria-hidden="true" />
          <span>
            Tienes el último turno, así que no pagas prima. Solo tu cuota.
          </span>
        </p>
      ) : null}

      <Button size="lg" className="w-full" onClick={confirmar} disabled={pagando}>
        {pagando ? (
          <>
            <Spinner />
            Confirmando tu cuota…
          </>
        ) : (
          `Confirmar ${soles(aporte.total)}`
        )}
      </Button>
    </div>
  );
}
