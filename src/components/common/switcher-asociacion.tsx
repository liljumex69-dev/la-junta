"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Buildings, CaretUpDown, CheckCircle, Plus, SignIn } from "@phosphor-icons/react/ssr";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useJunta } from "@/lib/junta/context";

/**
 * Cambiar entre las asociaciones que gestiona un mismo directivo.
 *
 * Un directivo puede fundar o unirse a más de una — este es el lugar donde ve
 * cuáles tiene y cambia cuál está viendo. "Fundar otra" y "Unirme a otra" viven
 * aquí mismo, en vez de esconderse en otra pantalla.
 */
export function SwitcherAsociacion() {
  const router = useRouter();
  const { asociacion, misAsociaciones, cambiarAsociacionActiva } = useJunta();
  const [abierto, setAbierto] = useState(false);

  if (!asociacion) return null;

  return (
    <DropdownMenu open={abierto} onOpenChange={setAbierto}>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton className="border border-marca-borde bg-marca-fondo/60">
          <Buildings size={20} weight="duotone" color="#1F5C3D" aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate text-left text-support font-semibold text-marca-texto">
            {asociacion.nombreMercado}
          </span>
          <CaretUpDown size={14} weight="bold" className="shrink-0 text-marca-tenue" aria-hidden="true" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-64 rounded-lg border-marca-borde bg-marca-superficie p-2"
      >
        {misAsociaciones.length > 1 ? (
          <>
            <DropdownMenuLabel className="px-3 py-1 text-micro font-semibold tracking-wide text-marca-tenue uppercase">
              Mis asociaciones
            </DropdownMenuLabel>
            {misAsociaciones.map((a) => (
              <DropdownMenuItem
                key={a.id}
                onSelect={() => {
                  setAbierto(false);
                  cambiarAsociacionActiva(a.id);
                  router.push("/inicio");
                }}
                className="min-h-[44px] text-body"
              >
                <Buildings size={20} weight="duotone" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate">{a.nombreMercado}</span>
                {a.id === asociacion.id ? (
                  <CheckCircle size={18} weight="fill" color="#4C8C5C" aria-hidden="true" />
                ) : null}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="bg-marca-borde" />
          </>
        ) : null}

        <DropdownMenuItem asChild className="min-h-[44px] text-body">
          <Link href="/crear" onClick={() => setAbierto(false)}>
            <Plus size={20} weight="bold" aria-hidden="true" />
            Fundar otra asociación
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="min-h-[44px] text-body">
          <Link href="/unirse" onClick={() => setAbierto(false)}>
            <SignIn size={20} weight="duotone" aria-hidden="true" />
            Unirme a otra asociación
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
