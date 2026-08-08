"use client";

import { useState, type ReactNode } from "react";
import { ChatCircleDots } from "@phosphor-icons/react/ssr";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { ChatSoporte } from "@/components/soporte/chat-soporte";

/**
 * Centro de ayuda como modal, no como pantalla completa.
 *
 * Antes, tocar "Ayuda" navegaba a /soporte y reemplazaba toda la vista —
 * perdías de vista dónde estabas. Como modal, el fondo, el resto de la
 * pantalla se mantienen detrás; cerrar el modal te devuelve exactamente a
 * donde estabas, sin recargar nada.
 *
 * `trigger` es opcional: dentro de la app (con `SidebarProvider` disponible)
 * el disparador por defecto es el ítem de sidebar de siempre. Fuera de la
 * app — landing pública, pie de página, cualquier lugar sin sidebar — quien
 * use este componente pasa su propio disparador (un link con la misma pinta
 * que sus vecinos) para no depender de contexto que ahí no existe.
 */
export function DialogAyuda({ trigger }: { trigger?: ReactNode }) {
  const [abierto, setAbierto] = useState(false);

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger asChild>
        {trigger ?? (
          <SidebarMenuButton tooltip="Centro de ayuda" size="lg">
            <ChatCircleDots size={22} weight="duotone" aria-hidden="true" />
            <span>Ayuda</span>
          </SidebarMenuButton>
        )}
      </DialogTrigger>
      <DialogContent className="flex max-h-[85vh] w-full max-w-lg flex-col gap-0 overflow-hidden bg-marca-fondo p-0 sm:max-w-lg">
        <DialogHeader className="border-b border-marca-borde px-5 py-4">
          <DialogTitle className="text-h3 font-semibold text-marca-texto">
            Centro de ayuda
          </DialogTitle>
          <DialogDescription className="text-support text-marca-tenue">
            Pregunta con tus palabras. Si prefieres hablar con una persona,
            también puedes.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <ChatSoporte />
        </div>
      </DialogContent>
    </Dialog>
  );
}
