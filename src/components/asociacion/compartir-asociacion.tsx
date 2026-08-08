"use client";

import { Buildings, Copy, WhatsappLogo } from "@phosphor-icons/react/ssr";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { Asociacion } from "@/lib/junta/types";

/**
 * Invitación a una asociación recién fundada o todavía llenándose de puestos.
 *
 * El enlace lleva a `/invitacion/<codigo>`: quien lo recibe y no tiene cuenta pasa
 * por el registro y queda inscrito al terminar, sin tener que buscar dónde escribir
 * un código.
 */
export function CompartirAsociacion({ asociacion }: { asociacion: Asociacion }) {
  const enlace =
    typeof window !== "undefined"
      ? `${window.location.origin}/invitacion/${asociacion.codigoInvitacion}`
      : `/invitacion/${asociacion.codigoInvitacion}`;

  const mensaje = `Te invito a que registres tu puesto en "${asociacion.nombreMercado}" en Junta, la tesorería digital de nuestra asociación. Entra con este enlace: ${enlace}`;

  return (
    <div>
      <p className="flex items-center gap-2 text-h3 font-semibold text-marca-texto">
        <Buildings size={26} weight="duotone" color="#1F5C3D" aria-hidden="true" />
        Invita a los comerciantes de tu mercado
      </p>
      <p className="mt-2 text-body text-marca-tenue">
        Comparte este código o el enlace para que cada puesto registre su cuota.
      </p>

      <div className="mt-4 rounded-md border-2 border-marca-borde bg-marca-fondo p-4 text-center">
        <p className="text-support font-semibold text-marca-tenue">
          Código para compartir
        </p>
        <p className="mt-1 text-[28px] font-semibold tracking-[0.15em] text-marca-texto">
          {asociacion.codigoInvitacion}
        </p>
      </div>

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
    </div>
  );
}
