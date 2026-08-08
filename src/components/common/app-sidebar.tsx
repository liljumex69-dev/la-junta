"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartBar,
  ChatCircleDots,
  Gear,
  House,
  Megaphone,
  PiggyBank,
  Vault,
} from "@phosphor-icons/react/ssr";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/common/logo";
import { MenuCuenta } from "@/components/common/menu-cuenta";
import { esDirectivo } from "@/lib/junta/rules";
import { useJunta } from "@/lib/junta/context";

/**
 * Navegación principal, siempre visible.
 *
 * Antes, historial de cumplimiento, ahorro personal, anuncios y configuración
 * vivían escondidos dentro del menú de cuenta — alguien nuevo en el producto
 * no tenía forma de saber que existían sin abrir ese menú primero. Ahora son
 * destinos de primer nivel, igual que inicio y el fondo: se ven de entrada,
 * sin necesitar descubrirlos.
 *
 * Responsive por construcción (patrón sidebar de shadcn/ui): fijo a la
 * izquierda en escritorio, y un panel deslizable (Sheet) activado por el
 * botón de menú en móvil — nunca los dos al mismo tiempo.
 */
const DESTINOS = [
  { href: "/inicio", label: "Inicio", icono: House },
  { href: "/fondo", label: "El fondo", icono: Vault },
  { href: "/ahorro", label: "Mi ahorro personal", icono: PiggyBank },
  { href: "/cumplimiento", label: "Historial de cumplimiento", icono: ChartBar },
  { href: "/anuncios", label: "Tablón de anuncios", icono: Megaphone },
] as const;

export function AppSidebar() {
  const pathname = usePathname();
  const { usuario } = useJunta();

  if (!usuario) return null;

  const directivo = esDirectivo(usuario);
  // Sin asociación todavía (recién registrado, a mitad del onboarding): los
  // destinos de abajo no tienen nada que mostrar. Mejor no ofrecerlos en vez
  // de que cada uno lleve al mismo aviso de "todavía no elegiste tu camino".
  const tieneAsociacion = !!usuario.asociacionId;

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent active:bg-transparent">
              <Link href="/inicio" aria-label="Junta, ir al inicio">
                <Logo size={28} />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {tieneAsociacion ? (
          <>
            <SidebarGroup>
              <SidebarMenu>
                {DESTINOS.map((d) => {
                  const Icono = d.icono;
                  const activo = pathname === d.href || pathname.startsWith(`${d.href}/`);
                  return (
                    <SidebarMenuItem key={d.href}>
                      <SidebarMenuButton asChild isActive={activo} tooltip={d.label} size="lg">
                        <Link href={d.href} aria-current={activo ? "page" : undefined}>
                          <Icono size={22} weight={activo ? "fill" : "duotone"} aria-hidden="true" />
                          <span>{d.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}

                {directivo ? (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith("/configuracion")}
                      tooltip="Configuración de la asociación"
                      size="lg"
                    >
                      <Link
                        href="/configuracion"
                        aria-current={pathname.startsWith("/configuracion") ? "page" : undefined}
                      >
                        <Gear
                          size={22}
                          weight={pathname.startsWith("/configuracion") ? "fill" : "duotone"}
                          aria-hidden="true"
                        />
                        <span>Configuración</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : null}
              </SidebarMenu>
            </SidebarGroup>

            <SidebarSeparator />
          </>
        ) : null}

        <SidebarGroup className="mt-auto">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith("/soporte")}
                tooltip="Centro de ayuda"
                size="lg"
              >
                <Link
                  href="/soporte"
                  aria-current={pathname.startsWith("/soporte") ? "page" : undefined}
                >
                  <ChatCircleDots
                    size={22}
                    weight={pathname.startsWith("/soporte") ? "fill" : "duotone"}
                    aria-hidden="true"
                  />
                  <span>Ayuda</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <MenuCuenta />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
