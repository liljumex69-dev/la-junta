"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CaretLeft } from "@phosphor-icons/react/ssr";

import { UnirseAsociacion } from "@/components/asociacion/unirse-asociacion";

function Contenido() {
  const params = useSearchParams();
  const codigo = params.get("codigo") ?? params.get("asociacion") ?? undefined;

  return (
    <div className="space-y-6">
      <Link
        href="/registro/camino"
        className="touch-target -ml-3 flex w-fit items-center gap-1 rounded-md pr-3 text-body font-semibold text-marca-texto transition-colors hover:bg-[#ece5d3]"
      >
        <CaretLeft size={22} weight="bold" aria-hidden="true" />
        Atrás
      </Link>

      <div>
        <h1 className="text-display font-semibold text-marca-texto">
          Unirme a mi asociación
        </h1>
        <p className="mt-2 text-body text-marca-tenue">
          Escribe el código que te compartió tu directorio para registrar tu puesto.
        </p>
      </div>

      <UnirseAsociacion codigoInicial={codigo} />
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
