"use client";

import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Buildings, Copy, DownloadSimple, WhatsappLogo } from "@phosphor-icons/react/ssr";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { Asociacion } from "@/lib/junta/types";

/**
 * Invitación a una asociación recién fundada o todavía llenándose de puestos.
 *
 * El enlace lleva a `/invitacion/<codigo>`: quien lo recibe y no tiene cuenta pasa
 * por el registro y queda inscrito al terminar, sin tener que buscar dónde escribir
 * un código. El QR es el mismo enlace codificado — escanearlo hace exactamente lo
 * mismo que tocar el enlace, pensado para pegarse físicamente en el mercado.
 */
export function CompartirAsociacion({ asociacion }: { asociacion: Asociacion }) {
  const qrRef = useRef<HTMLDivElement>(null);

  const enlace =
    typeof window !== "undefined"
      ? `${window.location.origin}/invitacion/${asociacion.codigoInvitacion}`
      : `/invitacion/${asociacion.codigoInvitacion}`;

  const mensaje = `Te invito a que registres tu puesto en "${asociacion.nombreMercado}" en Junta, la tesorería digital de nuestra asociación. Entra con este enlace: ${enlace}`;

  function descargarQR() {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    const enlaceDescarga = document.createElement("a");
    enlaceDescarga.href = canvas.toDataURL("image/png");
    enlaceDescarga.download = `qr-${asociacion.codigoInvitacion}.png`;
    document.body.appendChild(enlaceDescarga);
    enlaceDescarga.click();
    document.body.removeChild(enlaceDescarga);
    toast.success("QR descargado");
  }

  return (
    <div>
      <p className="flex items-center gap-2 text-h3 font-semibold text-marca-texto">
        <Buildings size={26} weight="duotone" color="#1F5C3D" aria-hidden="true" />
        Invita a los comerciantes de tu mercado
      </p>
      <p className="mt-2 text-body text-marca-tenue">
        Comparte el código, el QR o el enlace para que cada puesto registre su
        cuota.
      </p>

      <div className="mt-4 flex flex-col items-center gap-4 rounded-md border-2 border-marca-borde bg-marca-fondo p-5">
        <div ref={qrRef} className="rounded-md bg-white p-3">
          <QRCodeCanvas
            value={enlace}
            size={168}
            level="M"
            fgColor="#24312B"
            bgColor="#ffffff"
            marginSize={0}
          />
        </div>
        <div className="text-center">
          <p className="text-support font-semibold text-marca-tenue">
            Código para compartir
          </p>
          <p className="mt-1 text-[28px] font-semibold tracking-[0.15em] text-marca-texto">
            {asociacion.codigoInvitacion}
          </p>
        </div>
        <Button variant="outline" onClick={descargarQR} className="w-full">
          <DownloadSimple size={20} weight="bold" aria-hidden="true" />
          Descargar QR
        </Button>
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
