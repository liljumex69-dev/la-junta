"use client";

import { Copy, UsersThree, WhatsappLogo } from "@phosphor-icons/react/ssr";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { Junta } from "@/lib/minka/types";

/**
 * Invitación a una junta que todavía se está llenando.
 *
 * El enlace lleva a `/invitacion/<codigo>`, que resuelve el caso que faltaba: quien
 * lo recibe y no tiene cuenta pasa por el registro y queda inscrito al terminar, sin
 * tener que buscar dónde escribir un código.
 */
export function CompartirJunta({ junta }: { junta: Junta }) {
  const faltan = junta.totalParticipantes - junta.participantes.length;
  const enlace =
    typeof window !== "undefined"
      ? `${window.location.origin}/invitacion/${junta.codigoInvitacion}`
      : `/invitacion/${junta.codigoInvitacion}`;

  const mensaje = `Te invito a nuestra junta "${junta.nombre}" en Minka. Entra con este enlace y quedas dentro: ${enlace}`;

  return (
    <div>
      <p className="flex items-center gap-2 text-h3 font-semibold text-minka-text">
        <UsersThree size={26} weight="duotone" color="#BF312A" aria-hidden="true" />
        {faltan > 0
          ? `Faltan ${faltan} ${faltan === 1 ? "persona" : "personas"}`
          : "El grupo ya está completo"}
      </p>
      <p className="mt-2 text-body text-minka-muted">
        {faltan > 0
          ? "La junta arranca cuando estén todas. Comparte el enlace para que entren."
          : "Ya pueden empezar: se repartirán los turnos y comenzará el primer ciclo."}
      </p>

      <div className="mt-4 rounded-md border-2 border-minka-border bg-minka-bg p-4 text-center">
        <p className="text-support font-semibold text-minka-muted">
          Código para compartir
        </p>
        <p className="mt-1 text-[28px] font-semibold tracking-[0.15em] text-minka-text">
          {junta.codigoInvitacion}
        </p>
      </div>

      {faltan > 0 ? (
        <div className="mt-4 space-y-3">
          <Button
            size="lg"
            className="w-full"
            onClick={() =>
              window.open(
                `https://wa.me/?text=${encodeURIComponent(mensaje)}`,
                "_blank"
              )
            }
          >
            <WhatsappLogo size={24} weight="fill" aria-hidden="true" />
            Invitar por WhatsApp
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full"
            onClick={() => {
              navigator.clipboard?.writeText(enlace);
              toast.success("Enlace copiado");
            }}
          >
            <Copy size={22} weight="duotone" aria-hidden="true" />
            Copiar enlace de invitación
          </Button>
        </div>
      ) : null}
    </div>
  );
}
