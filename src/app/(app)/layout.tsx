import Link from "next/link";
import { Logo } from "@/components/common/logo";
import { BottomNav } from "@/components/common/bottom-nav";
import { MenuCuenta } from "@/components/common/menu-cuenta";
import { GuardiaSesion } from "@/components/common/guardia-sesion";

/**
 * Shell de las pantallas con sesión iniciada.
 *
 * Mobile-first: una columna a todo el ancho en celular, centrada y con tope de 600px
 * en tablet y 720px en escritorio. Nunca se estiran las tarjetas del fondo o de
 * propuestas a todo el ancho de una pantalla grande — se perdería la sensación de
 * app enfocada.
 */
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-marca-borde bg-marca-fondo/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[720px] items-center justify-between px-4">
          <Link href="/inicio" aria-label="Junta, ir al inicio" className="flex">
            <Logo size={32} />
          </Link>
          <MenuCuenta />
        </div>
      </header>

      <main className="contenedor-app flex-1 py-6">
        <GuardiaSesion>{children}</GuardiaSesion>
      </main>

      <BottomNav />
    </div>
  );
}
