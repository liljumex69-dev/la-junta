"use client";

import { useState } from "react";
import { CheckCircle, Sparkle } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/minka/spinner";
import { LIMITES_PLAN } from "@/lib/minka/rules";
import { soles } from "@/lib/minka/format";
import { useSesion } from "@/lib/minka/prototipo/sesion";

/**
 * Cambio de plan.
 *
 * Antes el botón no hacía nada. Ahora cambia el plan de verdad, y el efecto se nota
 * de inmediato donde importa: los topes del asistente de creación de junta suben.
 * Es lo único que un plan pagado puede cambiar — nunca la elegibilidad de turno ni
 * el permiso de junta pública.
 */
export function BotonMejorar() {
  const { usuario, mejorarPlan } = useSesion();
  const [procesando, setProcesando] = useState(false);
  const [listo, setListo] = useState(false);

  if (!usuario) return null;

  const esPro = usuario.plan === "pro";
  const limites = LIMITES_PLAN.pro;

  async function cambiar() {
    if (procesando) return;
    setProcesando(true);
    // TODO: conectar a la pasarela de pago del plan. Es un cobro de servicio de
    // Minka y no toca el pozo de ninguna junta.
    await new Promise((r) => setTimeout(r, 1100));
    mejorarPlan();
    setProcesando(false);
    setListo(true);
  }

  if (esPro || listo) {
    return (
      <div className="mt-5 rounded-md border-2 border-minka-success bg-[#eef2e9] p-4">
        <p className="flex items-center gap-2 text-body font-semibold text-minka-success">
          <CheckCircle size={24} weight="fill" aria-hidden="true" />
          Ya tienes Organizador Pro
        </p>
        <p className="mt-2 text-body text-minka-text">
          Ahora puedes organizar hasta {limites.maxJuntasSimultaneas} juntas a la vez,
          con hasta {limites.maxParticipantes} personas y cuotas de hasta{" "}
          {soles(limites.maxCuota)}.
        </p>
      </div>
    );
  }

  return (
    <>
      <Button size="lg" className="mt-5 w-full" onClick={cambiar} disabled={procesando}>
        {procesando ? (
          <>
            <Spinner />
            Activando tu plan…
          </>
        ) : (
          <>
            <Sparkle size={22} weight="fill" aria-hidden="true" />
            Probar Organizador Pro
          </>
        )}
      </Button>
      <p className="mt-3 text-support text-minka-muted">
        Puedes volver al plan gratuito cuando quieras. Tus juntas y tu historial no se
        tocan.
      </p>
    </>
  );
}
