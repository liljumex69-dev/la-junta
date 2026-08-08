import Link from "next/link";

import { AppSidebar } from "@/components/common/app-sidebar";
import { Logo } from "@/components/common/logo";
import { GuardiaSesion } from "@/components/common/guardia-sesion";
import { NotificacionesCampana } from "@/components/common/notificaciones-campana";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

/**
 * Shell de las pantallas con sesión iniciada.
 *
 * Sidebar persistente en escritorio con todas las secciones visibles de
 * entrada — nada escondido detrás de un menú que alguien nuevo no sabe que
 * existe. En móvil, el mismo sidebar se convierte en un panel deslizable
 * (patrón de shadcn/ui), activado por el botón de menú de la barra superior.
 */
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-16 items-center gap-2 border-b border-marca-borde bg-marca-fondo/95 px-4 backdrop-blur">
          <SidebarTrigger className="text-marca-texto hover:bg-[#ece5d3]" />
          <Link href="/inicio" aria-label="Junta, ir al inicio" className="flex md:hidden">
            <Logo size={28} />
          </Link>
          <div className="ml-auto flex items-center">
            <NotificacionesCampana />
          </div>
        </header>

        <main className="contenedor-app flex-1 py-6">
          <GuardiaSesion>{children}</GuardiaSesion>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
