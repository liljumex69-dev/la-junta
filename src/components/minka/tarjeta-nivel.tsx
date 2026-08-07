"use client";

import Link from "next/link";
import { CaretRight, Medal } from "@phosphor-icons/react/ssr";

import {
  juntasParaSiguienteNivel,
  nivelDe,
  progresoAlSiguiente,
} from "@/lib/minka/niveles";
import type { Usuario } from "@/lib/minka/types";

/**
 * Nivel de confianza en el panel de inicio.
 *
 * Responde de un vistazo dos preguntas que antes no se contestaban en ninguna
 * pantalla: en qué nivel estoy y qué me falta para el siguiente. El objetivo es que
 * la reputación se sienta como algo que progresa, no como un número abstracto.
 */
export function TarjetaNivel({ usuario }: { usuario: Usuario }) {
  const nivel = nivelDe(usuario.score);
  const progreso = progresoAlSiguiente(usuario.score);
  const juntasFaltantes = juntasParaSiguienteNivel(usuario.score);

  return (
    <Link
      href="/niveles"
      className="block rounded-lg border-2 border-minka-border bg-minka-surface p-5 transition-shadow duration-200 hover:shadow-elevated"
    >
      <div className="flex items-start gap-3">
        <span
          className="grid size-12 shrink-0 place-items-center rounded-lg"
          style={{ backgroundColor: nivel.fondo }}
        >
          <Medal size={26} weight="duotone" color={nivel.color} aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-support text-minka-muted">Tu nivel de confianza</p>
          <p className="text-h3 font-semibold" style={{ color: nivel.color }}>
            {nivel.nombre}
          </p>
        </div>

        <CaretRight
          size={22}
          weight="bold"
          className="mt-1 shrink-0 text-minka-muted"
          aria-hidden="true"
        />
      </div>

      {progreso ? (
        <div className="mt-4">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-support text-minka-muted">
              {nivel.nombre}
            </span>
            <span className="text-support text-minka-muted">
              {progreso.siguiente.nombre}
            </span>
          </div>
          <div
            className="mt-2 h-3 w-full overflow-hidden rounded-sm bg-[#e9e0d2]"
            role="progressbar"
            aria-valuenow={usuario.score}
            aria-valuemin={progreso.actual.desde}
            aria-valuemax={progreso.siguiente.desde}
            aria-label={`Progreso hacia el nivel ${progreso.siguiente.nombre}`}
          >
            <span
              className="block h-full rounded-sm transition-[width] duration-500 ease-out"
              style={{
                width: `${progreso.porcentaje}%`,
                backgroundColor: nivel.color,
              }}
            />
          </div>
          <p className="mt-3 text-body text-minka-text">
            {juntasFaltantes === 1
              ? "Completa una junta más"
              : `Completa ${juntasFaltantes} juntas más`}{" "}
            y pasas a{" "}
            <strong className="font-semibold">{progreso.siguiente.nombre}</strong>:
            te pedirán solo el {progreso.siguiente.porcentajeGarantia}% de garantía
            para cobrar temprano.
          </p>
        </div>
      ) : (
        <p className="mt-4 text-body text-minka-text">
          Estás en el nivel más alto. Te piden la garantía mínima y tu aval vale
          mucho para otras personas.
        </p>
      )}
    </Link>
  );
}
