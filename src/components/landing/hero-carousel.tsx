"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Carrusel del hero.
 *
 * Fotografía real y cálida de mercados peruanos, en el orden que pide el documento:
 * vendedora con su celular, grupo conversando con confianza (directivos o
 * comerciantes), un intercambio de manos, y una toma abierta del mercado que cierra.
 *
 * El movimiento es un crossfade de 250ms cada 5s — calmado, coherente con un
 * producto que maneja el fondo de una asociación, no una demo tecnológica.
 */
const IMAGENES = [
  {
    src: "/images/hero-1.jpg",
    alt: "Una vendedora de mercado revisa su celular con naturalidad en su puesto de frutas y verduras.",
  },
  {
    src: "/images/hero-2.jpg",
    alt: "Cuatro personas conversan y ríen con confianza en el pasillo de un mercado.",
  },
  {
    src: "/images/hero-3.jpg",
    alt: "Dos personas intercambian dinero y una bolsa de fruta en un puesto de mercado.",
  },
  {
    src: "/images/hero-4.jpg",
    alt: "Vista abierta de una calle de mercado llena de puestos y gente comprando.",
  },
];

const INTERVALO_MS = 5000;

export function HeroCarousel() {
  const [activa, setActiva] = useState(0);
  const [enPausa, setEnPausa] = useState(false);

  useEffect(() => {
    const prefiereMenosMovimiento = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefiereMenosMovimiento || enPausa) return;

    const id = window.setInterval(() => {
      setActiva((i) => (i + 1) % IMAGENES.length);
    }, INTERVALO_MS);
    return () => window.clearInterval(id);
  }, [enPausa]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setEnPausa(true)}
      onMouseLeave={() => setEnPausa(false)}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-marca-borde shadow-elevated sm:aspect-[3/2]">
        {IMAGENES.map((img, i) => (
          <Image
            key={img.src}
            src={img.src}
            alt={i === activa ? img.alt : ""}
            fill
            sizes="(max-width: 1023px) 100vw, 720px"
            // Todas se cargan de inmediato: con carga diferida, la imagen que entra
            // en el crossfade aún no existe y el fundido muestra un hueco en blanco.
            {...(i === 0 ? { priority: true } : { loading: "eager" as const })}
            className={cn(
              "object-cover transition-opacity duration-[250ms] ease-out",
              i === activa ? "opacity-100" : "opacity-0"
            )}
            aria-hidden={i !== activa}
          />
        ))}
      </div>

      {/* Controles: puntos con área táctil real de 44px, no solo el punto visible */}
      <div className="mt-4 flex items-center justify-center gap-1">
        {IMAGENES.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setActiva(i)}
            aria-label={`Ver imagen ${i + 1} de ${IMAGENES.length}`}
            aria-current={i === activa}
            className="touch-target grid place-items-center rounded-md"
          >
            <span
              className={cn(
                "block h-2.5 rounded-sm transition-all duration-200",
                i === activa
                  ? "w-8 bg-marca-primario"
                  : "w-2.5 bg-marca-borde"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
