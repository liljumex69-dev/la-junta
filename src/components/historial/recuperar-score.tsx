"use client";

import { useState } from "react";
import { ArrowUp, CheckCircle } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/minka/spinner";
import { soles } from "@/lib/minka/format";

/**
 * Camino de redención.
 *
 * Si el fondo colectivo cubrió por alguien, esa persona puede devolver ese dinero
 * voluntariamente y recuperar parte de su score. El tono importa mucho aquí: no es un
 * castigo ni una cobranza, es una salida. Alguien que incumplió una vez y quiere
 * volver a participar es exactamente el usuario que el producto quiere retener.
 */
export function RecuperarScore({
  deuda,
  scoreActual,
}: {
  deuda: number;
  scoreActual: number;
}) {
  const [pagando, setPagando] = useState(false);
  const [listo, setListo] = useState(false);

  // Devolver lo cubierto recupera parte del score, nunca todo: el incumplimiento
  // igual pasó y el historial lo sigue mostrando.
  const scoreRecuperado = Math.min(100, scoreActual + 15);

  async function reembolsar() {
    if (pagando) return;
    setPagando(true);

    // TODO: conectar a smart contract — transferir el reembolso al fondo colectivo
    // de la junta afectada y recalcular el score del usuario on-chain.
    await new Promise((r) => setTimeout(r, 1200));
    setPagando(false);
    setListo(true);
  }

  if (listo) {
    return (
      <div className="rounded-lg border-2 border-minka-success bg-[#eef2e9] p-5">
        <h2 className="flex items-center gap-2 text-h3 font-semibold text-minka-success">
          <CheckCircle size={26} weight="fill" aria-hidden="true" />
          Reembolso registrado
        </h2>
        <p className="mt-3 text-body text-minka-text">
          Devolviste {soles(deuda)} al fondo del grupo. Tu historial subió de{" "}
          {scoreActual} a {scoreRecuperado}.
        </p>
        <p className="mt-2 text-body text-minka-muted">
          El incumplimiento sigue apareciendo en tu historial, pero ya no te pesa
          igual: lo que cuenta ahora es que respondiste.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border-2 border-minka-secondary bg-[#fbeed8] p-5">
      <h2 className="text-h3 font-semibold text-minka-text">
        Puedes recuperar tu historial
      </h2>
      <p className="mt-3 text-body text-minka-text">
        Cuando no pudiste pagar, el fondo del grupo puso{" "}
        <strong className="font-semibold">{soles(deuda)}</strong> por ti para que
        nadie perdiera su dinero. Si lo devuelves, recuperas parte de tu historial.
      </p>

      <p className="mt-4 flex items-center gap-2 text-body font-semibold text-minka-text">
        <ArrowUp size={22} weight="bold" color="#4B6B3A" aria-hidden="true" />
        Tu historial subiría de {scoreActual} a {scoreRecuperado}
      </p>

      <Button size="lg" className="mt-5 w-full" onClick={reembolsar} disabled={pagando}>
        {pagando ? (
          <>
            <Spinner />
            Registrando tu reembolso…
          </>
        ) : (
          `Devolver ${soles(deuda)}`
        )}
      </Button>

      <p className="mt-3 text-support text-minka-muted">
        Puedes hacerlo cuando puedas. No hay fecha límite ni intereses.
      </p>
    </div>
  );
}
