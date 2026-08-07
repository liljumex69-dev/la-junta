"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowsClockwise,
  CaretDown,
  ChartLineUp,
  ChatCircleDots,
  SignOut,
  Ticket,
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
import { useSesion } from "@/lib/minka/prototipo/sesion";
import { nivelDe } from "@/lib/minka/niveles";

/**
 * Menú de cuenta del encabezado.
 *
 * Antes el avatar era un enlace mudo al historial, que no es lo que la gente espera
 * de un avatar en la barra superior. Ahora abre el menú de siempre: quién eres, tu
 * nivel, y los accesos a historial, plan, ayuda y cerrar sesión.
 *
 * Incluye además el cambio de perfil, que existe solo para recorrer la demo con
 * distintos tipos de usuario. En producción esa sección desaparece.
 */
export function MenuCuenta() {
  const router = useRouter();
  const { usuario, usuarios, entrar, salir, reiniciarDemo } = useSesion();

  if (!usuario) return null;

  const nivel = nivelDe(usuario.score);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="touch-target flex items-center gap-2 rounded-md pl-2 pr-1 transition-colors hover:bg-[#ece4d8]"
          aria-label={`Cuenta de ${usuario.nombre}`}
        >
          <span className="hidden text-support font-semibold text-minka-text sm:inline">
            {usuario.nombre.split(" ")[0]}
          </span>
          <span
            className="grid size-10 place-items-center rounded-full bg-minka-primary text-support font-semibold text-white"
            aria-hidden="true"
          >
            {usuario.iniciales}
          </span>
          <CaretDown size={16} weight="bold" className="text-minka-muted" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-72 rounded-lg border-minka-border bg-minka-surface p-2"
      >
        <DropdownMenuLabel className="px-3 py-2">
          <span className="block text-body font-semibold text-minka-text">
            {usuario.nombre}
          </span>
          <span className="mt-0.5 block text-support text-minka-muted">
            +51 {usuario.telefono}
          </span>
          <span
            className="mt-2 inline-flex items-center rounded-sm px-2.5 py-1 text-support font-semibold"
            style={{ backgroundColor: nivel.fondo, color: nivel.color }}
          >
            Nivel {nivel.nombre} · {usuario.score} de 100
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-minka-border" />

        <DropdownMenuItem asChild>
          <Link href="/historial" className="min-h-[44px] text-body">
            <ChartLineUp size={22} weight="duotone" aria-hidden="true" />
            Mi historial
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/niveles" className="min-h-[44px] text-body">
            <Ticket size={22} weight="duotone" aria-hidden="true" />
            Cómo suben los niveles
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/planes" className="min-h-[44px] text-body">
            <Ticket size={22} weight="duotone" aria-hidden="true" />
            Mi plan ·{" "}
            {usuario.plan === "pro" ? "Organizador Pro" : "Gratuito"}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/soporte" className="min-h-[44px] text-body">
            <ChatCircleDots size={22} weight="duotone" aria-hidden="true" />
            Centro de ayuda
          </Link>
        </DropdownMenuItem>

        {/* Solo para la demo: permite recorrer el producto con otros perfiles. */}
        <DropdownMenuSeparator className="bg-minka-border" />
        <DropdownMenuLabel className="px-3 py-1 text-micro font-semibold tracking-wide text-minka-muted uppercase">
          Cambiar de perfil (demo)
        </DropdownMenuLabel>
        {usuarios.map((u) => (
          <DropdownMenuItem
            key={u.id}
            onSelect={() => {
              entrar(u.id);
              router.push("/inicio");
            }}
            className="min-h-[44px] text-body"
          >
            <UserSwitch size={22} weight="duotone" aria-hidden="true" />
            <span className="flex-1">{u.nombre}</span>
            <span className="text-support text-minka-muted">
              {nivelDe(u.score).nombre}
            </span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          onSelect={() => {
            reiniciarDemo();
            router.push("/inicio");
          }}
          className="min-h-[44px] text-body"
        >
          <ArrowsClockwise size={22} weight="duotone" aria-hidden="true" />
          Reiniciar la demo
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-minka-border" />
        <DropdownMenuItem
          onSelect={() => {
            salir();
            router.push("/");
          }}
          className="min-h-[44px] text-body text-minka-danger"
        >
          <SignOut size={22} weight="duotone" aria-hidden="true" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
