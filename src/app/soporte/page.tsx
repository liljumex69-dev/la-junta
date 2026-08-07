import Link from "next/link";
import { CaretLeft } from "@phosphor-icons/react/ssr";

import { Logo } from "@/components/minka/logo";
import { ChatSoporte } from "@/components/soporte/chat-soporte";

export const metadata = { title: "Centro de ayuda — Minka" };

export default function SoportePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-minka-border bg-minka-bg/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[720px] items-center gap-2 px-4">
          <Link
            href="/inicio"
            aria-label="Volver"
            className="touch-target -ml-3 grid place-items-center rounded-md text-minka-text transition-colors hover:bg-[#ece4d8]"
          >
            <CaretLeft size={26} weight="bold" />
          </Link>
          {/* El logo lleva al inicio desde cualquier pantalla. */}
          <Link href="/inicio" aria-label="Minka, ir al inicio" className="flex">
            <Logo size={30} />
          </Link>
        </div>
      </header>

      <main className="minka-container flex-1 py-6">
        <h1 className="text-display font-semibold text-minka-text">
          Centro de ayuda
        </h1>
        <p className="mt-2 text-body text-minka-muted">
          Pregunta con tus palabras. Si prefieres hablar con una persona, también
          puedes.
        </p>

        <div className="mt-6">
          <ChatSoporte />
        </div>
      </main>
    </div>
  );
}
