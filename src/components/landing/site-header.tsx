"use client";

import Link from "next/link";
import { useState } from "react";
import { List, X } from "@phosphor-icons/react/ssr";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/minka/logo";

/**
 * Navbar fija de la landing.
 *
 * El fondo es el mismo crema de la página (#F5EFE6), sin barra blanca ni oscura
 * contrastante — el documento de diseño lo pide explícitamente. Al hacer scroll solo
 * aparece una línea divisoria sutil, suficiente para separar sin romper la calidez.
 */
const ENLACES = [
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "/planes", label: "Planes" },
  { href: "/soporte", label: "Soporte" },
];

export function SiteHeader() {
  const [abierto, setAbierto] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-minka-border/70 bg-minka-bg/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="touch-target flex items-center rounded-md"
          aria-label="Minka, ir al inicio"
        >
          <Logo size={34} />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {ENLACES.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className="touch-target flex items-center rounded-md px-4 text-body font-medium text-minka-text transition-colors hover:bg-[#ece4d8]"
            >
              {e.label}
            </Link>
          ))}
          {/* "Ingresar" va antes que "Crear cuenta": sin él, quien ya tiene cuenta
              cree que tiene que registrarse de nuevo. */}
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
            className="touch-target grid place-items-center rounded-md text-minka-text transition-colors hover:bg-[#ece4d8]"
          >
            {abierto ? <X size={26} weight="bold" /> : <List size={26} weight="bold" />}
          </button>
        </div>
      </div>

      {abierto && (
        <nav
          id="menu-movil"
          className="border-t border-minka-border bg-minka-bg px-4 pb-4 md:hidden"
        >
          {[...ENLACES, { href: "/entrar", label: "Ya tengo cuenta" }].map((e) => (
            <Link
              key={e.href}
              href={e.href}
              onClick={() => setAbierto(false)}
              className="touch-target flex items-center border-b border-minka-border/60 text-body font-medium text-minka-text last:border-0"
            >
              {e.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
