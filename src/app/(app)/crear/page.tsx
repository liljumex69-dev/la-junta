"use client";

import Link from "next/link";
import { CaretLeft } from "@phosphor-icons/react/ssr";

import { CrearJuntaWizard } from "@/components/junta/crear-junta-wizard";

export default function CrearPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/inicio"
        className="touch-target -ml-3 flex w-fit items-center gap-1 rounded-md pr-3 text-body font-semibold text-minka-text transition-colors hover:bg-[#ece4d8]"
      >
        <CaretLeft size={22} weight="bold" aria-hidden="true" />
        Inicio
      </Link>
      <h1 className="text-display font-semibold text-minka-text">Crear junta</h1>
      <CrearJuntaWizard />
    </div>
  );
}
