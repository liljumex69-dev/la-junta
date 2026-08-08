"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowsClockwise,
  CaretDown,
  ChartBar,
  ChatCircleDots,
  Gear,
  Megaphone,
  PiggyBank,
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
import { useJunta } from "@/lib/junta/context";
import { ETIQUETA_CARGO } from "@/lib/junta/format";

/**
 * Menú de cuenta del encabezado.
 *
 * Reúne lo que no cabe en la barra inferior de tres destinos: cumplimiento, ahorro
 * personal, anuncios, configuración (solo directivos) y cerrar sesión.
 *
 * Incluye además el cambio de perfil, que existe solo para recorrer la demo con los
 * dos roles (comerciante/directivo) y cualquier cuenta nueva registrada. En
 * producción esa sección desaparece — cada quien entra solo a su propia cuenta.
 */
export function MenuCuenta() {
  const router = useRouter();
  const { usuario, usuarios, iniciarSesion, cerrarSesion } = useJunta();

  if (!usuario) return null;

  const esDirectivo = usuario.rol === "directivo";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="touch-target flex items-center gap-2 rounded-md pl-2 pr-1 transition-colors hover:bg-[#ece5d3]"
          aria-label={`Cuenta de ${usuario.nombre}`}
        >
          <span className="hidden text-support font-semibold text-marca-texto sm:inline">
            {usuario.nombre.split(" ")[0]}
          </span>
          <span
            className="grid size-10 place-items-center rounded-full bg-marca-primario text-support font-semibold text-white"
            aria-hidden="true"
          >
            {usuario.iniciales}
          </span>
          <CaretDown size={16} weight="bold" className="text-marca-tenue" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
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
          <span className="mt-2 inline-flex items-center rounded-sm bg-[#e9f0ec] px-2.5 py-1 text-support font-semibold text-marca-primario">
            {esDirectivo
              ? `Directivo · ${ETIQUETA_CARGO[usuario.cargo ?? "vocal"]}`
              : `Comerciante · Puesto ${usuario.numeroPuesto ?? "—"}`}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-marca-borde" />

        <DropdownMenuItem asChild>
          <Link href="/cumplimiento" className="min-h-[44px] text-body">
            <ChartBar size={22} weight="duotone" aria-hidden="true" />
            Historial de cumplimiento
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/ahorro" className="min-h-[44px] text-body">
            <PiggyBank size={22} weight="duotone" aria-hidden="true" />
            Mi ahorro personal
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/anuncios" className="min-h-[44px] text-body">
            <Megaphone size={22} weight="duotone" aria-hidden="true" />
            Tablón de anuncios
          </Link>
        </DropdownMenuItem>
        {esDirectivo ? (
          <DropdownMenuItem asChild>
            <Link href="/configuracion" className="min-h-[44px] text-body">
              <Gear size={22} weight="duotone" aria-hidden="true" />
              Configuración de la asociación
            </Link>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem asChild>
          <Link href="/soporte" className="min-h-[44px] text-body">
            <ChatCircleDots size={22} weight="duotone" aria-hidden="true" />
            Centro de ayuda
          </Link>
        </DropdownMenuItem>

        {/* Solo para la demo: permite recorrer el producto con otros perfiles. */}
        <DropdownMenuSeparator className="bg-marca-borde" />
        <DropdownMenuLabel className="px-3 py-1 text-micro font-semibold tracking-wide text-marca-tenue uppercase">
          Cambiar de perfil (demo)
        </DropdownMenuLabel>
        {usuarios.map((u) => (
          <DropdownMenuItem
            key={u.id}
            onSelect={() => {
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
          onSelect={() => window.location.reload()}
          className="min-h-[44px] text-body"
        >
          <ArrowsClockwise size={22} weight="duotone" aria-hidden="true" />
          Reiniciar la demo
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-marca-borde" />
        <DropdownMenuItem
          onSelect={() => {
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
