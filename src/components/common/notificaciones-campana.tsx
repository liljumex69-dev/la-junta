"use client";

import Link from "next/link";
import {
  Bell,
  CheckCircle,
  HandCoins,
  Megaphone,
  Signature,
} from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useJunta } from "@/lib/junta/context";
import type { TipoNotificacion } from "@/lib/junta/types";
import { cn } from "@/lib/utils";

const ICONO_TIPO: Record<TipoNotificacion, typeof HandCoins> = {
  recordatorio_cuota: HandCoins,
  propuesta_pendiente: Signature,
  propuesta_ejecutada: CheckCircle,
  anuncio: Megaphone,
};

/**
 * Campana de notificaciones — el rincón vacío de arriba a la derecha ahora
 * avisa lo que antes solo se veía si alguien entraba directo a la pantalla
 * correcta: cuotas pendientes que un directivo recordó, firmas que faltan.
 */
export function NotificacionesCampana() {
  const { notificaciones, notificacionesNoLeidas, marcarNotificacionLeida, marcarTodasLasNotificacionesLeidas } =
    useJunta();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={
            notificacionesNoLeidas > 0
              ? `Notificaciones, ${notificacionesNoLeidas} sin leer`
              : "Notificaciones"
          }
          className="relative text-marca-texto hover:bg-[#ece5d3]"
        >
          <Bell size={22} weight={notificacionesNoLeidas > 0 ? "fill" : "duotone"} aria-hidden="true" />
          {notificacionesNoLeidas > 0 ? (
            <span
              className="absolute top-1.5 right-1.5 grid size-4 place-items-center rounded-full bg-marca-peligro text-[10px] font-semibold text-white"
              aria-hidden="true"
            >
              {notificacionesNoLeidas > 9 ? "9+" : notificacionesNoLeidas}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 rounded-lg border-marca-borde bg-marca-superficie p-2"
      >
        <div className="flex items-center justify-between gap-2 px-2 py-1">
          <DropdownMenuLabel className="p-0 text-body font-semibold text-marca-texto">
            Notificaciones
          </DropdownMenuLabel>
          {notificacionesNoLeidas > 0 ? (
            <button
              type="button"
              onClick={() => marcarTodasLasNotificacionesLeidas()}
              className="touch-target rounded-md px-2 text-support font-semibold text-marca-primario"
            >
              Marcar todas leídas
            </button>
          ) : null}
        </div>
        <DropdownMenuSeparator className="bg-marca-borde" />

        {notificaciones.length === 0 ? (
          <p className="p-4 text-center text-support text-marca-tenue">
            No tienes notificaciones todavía.
          </p>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {notificaciones.map((n) => {
              const Icono = ICONO_TIPO[n.tipo];
              return (
                <DropdownMenuItem
                  key={n.id}
                  asChild
                  className="items-start gap-2.5 py-2.5 whitespace-normal"
                  onSelect={() => marcarNotificacionLeida(n.id)}
                >
                  <Link href={n.enlace ?? "/inicio"}>
                    <span
                      className={cn(
                        "mt-0.5 grid size-8 shrink-0 place-items-center rounded-full",
                        n.leida ? "bg-[#ece5d3]" : "bg-[#e3ede6]"
                      )}
                    >
                      <Icono
                        size={16}
                        weight="duotone"
                        color={n.leida ? "#7c8a80" : "#1F5C3D"}
                        aria-hidden="true"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "block text-support font-semibold",
                          n.leida ? "text-marca-tenue" : "text-marca-texto"
                        )}
                      >
                        {n.titulo}
                      </span>
                      <span className="mt-0.5 block text-support text-marca-tenue">
                        {n.mensaje}
                      </span>
                      <span className="mt-1 block text-micro text-marca-tenue">{n.fecha}</span>
                    </span>
                    {!n.leida ? (
                      <span
                        className="mt-1.5 size-2 shrink-0 rounded-full bg-marca-primario"
                        aria-hidden="true"
                      />
                    ) : null}
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
