"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChatCircleDots, House, Vault } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/utils";

/**
 * Navegación inferior.
 *
 * Solo tres destinos, con etiqueta de texto siempre visible: para este público un
 * ícono sin palabra no es suficiente. La ayuda vive aquí, a un toque desde cualquier
 * pantalla, nunca escondida dentro de un menú. Historial, ahorro, anuncios y
 * configuración viven en el menú de cuenta — llevarlos también a la barra inferior
 * saturaría lo que debe quedar simple.
 */
const DESTINOS = [
  { href: "/inicio", label: "Inicio", icono: House },
  { href: "/fondo", label: "El fondo", icono: Vault },
  { href: "/soporte", label: "Ayuda", icono: ChatCircleDots },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegación principal"
      className="sticky bottom-0 z-40 border-t border-marca-borde bg-marca-superficie"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex w-full max-w-[720px]">
        {DESTINOS.map((d) => {
          const Icono = d.icono;
          const activo =
            pathname === d.href || pathname.startsWith(`${d.href}/`);
          return (
            <li key={d.href} className="flex-1">
              <Link
                href={d.href}
                aria-current={activo ? "page" : undefined}
                className={cn(
                  "flex min-h-[60px] flex-col items-center justify-center gap-0.5 py-2 text-support font-semibold transition-colors",
                  activo
                    ? "text-marca-primario"
                    : "text-marca-tenue hover:text-marca-texto"
                )}
              >
                <Icono
                  size={26}
                  weight={activo ? "fill" : "duotone"}
                  aria-hidden="true"
                />
                {d.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
