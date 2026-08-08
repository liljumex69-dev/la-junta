"use client";

import Link from "next/link";
import { CaretLeft } from "@phosphor-icons/react/ssr";

import { CrearAsociacionWizard } from "@/components/asociacion/crear-asociacion-wizard";

export default function CrearPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/registro/camino"
        className="touch-target -ml-3 flex w-fit items-center gap-1 rounded-md pr-3 text-body font-semibold text-marca-texto transition-colors hover:bg-[#ece5d3]"
      >
        <CaretLeft size={22} weight="bold" aria-hidden="true" />
        Atrás
      </Link>
      <h1 className="text-display font-semibold text-marca-texto">
        Fundar mi asociación
      </h1>
      <CrearAsociacionWizard />
    </div>
  );
}
