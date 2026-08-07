"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CaretLeft } from "@phosphor-icons/react/ssr";

import { UnirseJunta } from "@/components/junta/unirse-junta";

function Contenido() {
  const params = useSearchParams();
  const codigo = params.get("codigo") ?? undefined;

  return (
    <div className="space-y-6">
      <Link
        href="/inicio"
        className="touch-target -ml-3 flex w-fit items-center gap-1 rounded-md pr-3 text-body font-semibold text-minka-text transition-colors hover:bg-[#ece4d8]"
      >
        <CaretLeft size={22} weight="bold" aria-hidden="true" />
        Inicio
      </Link>

      <div>
        <h1 className="text-display font-semibold text-minka-text">
          Unirme a una junta
        </h1>
        <p className="mt-2 text-body text-minka-muted">
          Escribe el código que te compartieron para ver de qué se trata antes de
          entrar.
        </p>
      </div>

      <UnirseJunta codigoInicial={codigo} />
    </div>
  );
}

export default function UnirsePage() {
  return (
    <Suspense fallback={null}>
      <Contenido />
    </Suspense>
  );
}
