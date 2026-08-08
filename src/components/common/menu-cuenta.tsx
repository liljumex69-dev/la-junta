"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowsClockwise,
  CaretUpDown,
  SignOut,
  UserSwitch,
} from "@phosphor-icons/react/ssr";

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
import { ETIQUETA_CARGO } from "@/lib/junta/format";

/**
 * Pie de perfil del sidebar.
 *
 * La navegación real (cumplimiento, ahorro, anuncios, configuración, ayuda) ya
 * vive como enlaces directos y siempre visibles en el sidebar — nada de eso
 * debe estar escondido detrás de un clic. Lo único que queda aquí es lo que no
 * es navegación: identidad de la cuenta, cerrar sesión, y el cambio de perfil
 * que existe solo para recorrer la demo con los dos roles de prueba.
 */
export function MenuCuenta() {
  const router = useRouter();
  const { usuario, usuarios, iniciarSesion, cerrarSesion } = useJunta();

  // Controlado a propósito: los ítems que navegan con `router.push` en su
  // `onSelect` pueden interrumpir el cierre automático de Radix a mitad de la
  // transición de ruta, dejando el menú montado con pointer-events activos.
  // Cerrarlo nosotros mismos, antes de navegar, evita ese estado a medias.
  const [abierto, setAbierto] = useState(false);

  if (!usuario) return null;

  const esDirectivo = usuario.rol === "directivo";

  return (
    <DropdownMenu open={abierto} onOpenChange={setAbierto}>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <span
            className="grid size-8 shrink-0 place-items-center rounded-full bg-marca-primario text-support font-semibold text-white"
            aria-hidden="true"
          >
            {usuario.iniciales}
          </span>
          <span className="grid min-w-0 flex-1 text-left leading-tight">
            <span className="truncate text-body font-semibold text-marca-texto">
              {usuario.nombre}
            </span>
            <span className="truncate text-support text-marca-tenue">
              {esDirectivo
                ? `Directivo · ${ETIQUETA_CARGO[usuario.cargo ?? "vocal"]}`
                : `Comerciante · Puesto ${usuario.numeroPuesto ?? "—"}`}
            </span>
          </span>
          <CaretUpDown size={16} weight="bold" className="text-marca-tenue" aria-hidden="true" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="top"
        align="end"
        className="w-72 rounded-lg border-marca-borde bg-marca-superficie p-2"
      >
        <DropdownMenuLabel className="px-3 py-2">
          <span className="block text-body font-semibold text-marca-texto">
            {usuario.nombre}
          </span>
          <span className="mt-0.5 block text-support text-marca-tenue">
            +51 {usuario.telefono}
          </span>
        </DropdownMenuLabel>

        {/* Solo para la demo: permite recorrer el producto con otros perfiles. */}
        <DropdownMenuSeparator className="bg-marca-borde" />
        <DropdownMenuLabel className="px-3 py-1 text-micro font-semibold tracking-wide text-marca-tenue uppercase">
          Cambiar de perfil (demo)
        </DropdownMenuLabel>
        {usuarios.map((u) => (
          <DropdownMenuItem
            key={u.id}
            onSelect={() => {
              setAbierto(false);
              iniciarSesion(u.id);
              router.push("/inicio");
            }}
            className="min-h-[44px] text-body"
          >
            <UserSwitch size={22} weight="duotone" aria-hidden="true" />
            <span className="flex-1">{u.nombre}</span>
            <span className="text-support text-marca-tenue">
              {u.rol === "directivo" ? "Directivo" : "Comerciante"}
            </span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          onSelect={() => {
            setAbierto(false);
            window.location.reload();
          }}
          className="min-h-[44px] text-body"
        >
          <ArrowsClockwise size={22} weight="duotone" aria-hidden="true" />
          Reiniciar la demo
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-marca-borde" />
        <DropdownMenuItem
          onSelect={() => {
            setAbierto(false);
            cerrarSesion();
            router.push("/");
          }}
          className="min-h-[44px] text-body text-marca-peligro"
        >
          <SignOut size={22} weight="duotone" aria-hidden="true" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
