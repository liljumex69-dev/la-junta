import Link from "next/link";
import { CaretLeft } from "@phosphor-icons/react/ssr";

import { Logo } from "@/components/common/logo";
import { ChatSoporte } from "@/components/soporte/chat-soporte";

export const metadata = { title: "Centro de ayuda — Junta" };

export default function SoportePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-marca-fondo">
      <header className="sticky top-0 z-40 border-b border-marca-borde bg-marca-fondo/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[720px] items-center gap-2 px-4">
          {/* No asumimos que quien llega aquí tiene sesión — esta ruta
              standalone solo queda como respaldo de quien la tenga guardada
              o llegue por un enlace viejo. El resto de la app abre la ayuda
              como modal (ver DialogAyuda) y nunca navega hasta aquí. */}
          <Link
            href="/"
            aria-label="Volver"
            className="touch-target -ml-3 grid place-items-center rounded-md text-marca-texto transition-colors hover:bg-[#ece5d3]"
          >
            <CaretLeft size={26} weight="bold" />
          </Link>
          <Logo size={30} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-[720px] flex-1 px-4 py-6">
        <h1 className="text-display font-semibold text-marca-texto">
          Centro de ayuda
        </h1>
        <p className="mt-2 text-body text-marca-tenue">
          Pregunta con tus palabras. Si prefieres hablar con una persona,
          también puedes.
        </p>

        <div className="mt-6">
          <ChatSoporte />
        </div>
      </main>
    </div>
  );
}
