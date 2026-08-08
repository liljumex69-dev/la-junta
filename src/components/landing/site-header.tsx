"use client";

import Link from "next/link";
import { useState } from "react";
import { List, X } from "@phosphor-icons/react/ssr";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/common/logo";

/**
 * Navbar fija de la landing.
 *
 * El fondo es el mismo pergamino cálido de la página (#F3EFE4), sin barra blanca ni
 * oscura contrastante — el documento de diseño lo pide explícitamente. Al hacer
 * scroll solo aparece una línea divisoria sutil.
 */
const ENLACES = [
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#precios", label: "Precios" },
  { href: "/soporte", label: "Soporte" },
];

export function SiteHeader() {
  const [abierto, setAbierto] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-marca-borde/70 bg-marca-fondo/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="touch-target flex items-center rounded-md"
          aria-label="Junta, ir al inicio"
        >
          <Logo size={34} />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {ENLACES.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className="touch-target flex items-center rounded-md px-4 text-body font-medium text-marca-texto transition-colors hover:bg-[#ece5d3]"
            >
              {e.label}
            </Link>
          ))}
          <Button asChild variant="outline" className="ml-3">
            <Link href="/entrar">Ingresar</Link>
          </Button>
          <Button asChild className="ml-2">
            <Link href="/registro">Crear cuenta</Link>
          </Button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Button asChild size="sm" variant="outline">
            <Link href="/entrar">Ingresar</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/registro">Crear cuenta</Link>
          </Button>
          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            className="touch-target grid place-items-center rounded-md text-marca-texto transition-colors hover:bg-[#ece5d3]"
          >
            {abierto ? <X size={26} weight="bold" /> : <List size={26} weight="bold" />}
          </button>
        </div>
      </div>

      {abierto && (
        <nav
          id="menu-movil"
          className="border-t border-marca-borde bg-marca-fondo px-4 pb-4 md:hidden"
        >
          {ENLACES.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              onClick={() => setAbierto(false)}
              className="touch-target flex items-center border-b border-marca-borde/60 text-body font-medium text-marca-texto last:border-0"
            >
              {e.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
