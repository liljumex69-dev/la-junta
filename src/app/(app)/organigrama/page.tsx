"use client";

import { Aparecer } from "@/components/common/aparecer";
import { etiquetaCargo } from "@/lib/junta/format";
import { useJunta } from "@/lib/junta/context";
import type { CargoDirectivo } from "@/lib/junta/types";

/** Orden jerárquico de tiers — no de la lista de cargos posibles en general,
 * solo de cómo se agrupan visualmente acá. */
const NIVELES: { cargos: CargoDirectivo[]; titulo: string }[] = [
  { cargos: ["presidente"], titulo: "Presidencia" },
  { cargos: ["tesorero", "secretario"], titulo: "Directorio" },
  { cargos: ["vocal", "otro"], titulo: "Vocalías" },
];

const COLOR_CARGO: Record<CargoDirectivo, string> = {
  presidente: "#1F5C3D",
  tesorero: "#B8863B",
  secretario: "#4C8C5C",
  vocal: "#7c8a80",
  otro: "#7c8a80",
};

function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[1][0]).toUpperCase();
}

function NodoDirectivo({
  nombre,
  cargo,
  destacado,
}: {
  nombre: string;
  cargo: CargoDirectivo;
  destacado?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <span
        className="grid shrink-0 place-items-center rounded-full font-semibold text-white"
        style={{
          backgroundColor: COLOR_CARGO[cargo],
          width: destacado ? 64 : 56,
          height: destacado ? 64 : 56,
          fontSize: destacado ? 20 : 17,
        }}
        aria-hidden="true"
      >
        {iniciales(nombre)}
      </span>
      <div>
        <p className="text-body font-semibold text-marca-texto">{nombre}</p>
        <p className="text-support text-marca-tenue">{etiquetaCargo(cargo)}</p>
      </div>
    </div>
  );
}

/**
 * Organigrama de la asociación.
 *
 * Solo las cabezas que gestionan el fondo — presidente, tesorero, secretario,
 * vocales — nunca los puestos que se van sumando como comerciantes. Reemplaza
 * el hueco que dejó el tablón de anuncios en el sidebar al mudarse a Inicio:
 * este sí es un contenido propio, no una repetición de otra pantalla.
 */
export default function OrganigramaPage() {
  const { usuario, asociacion, directivosDelDirectorio } = useJunta();

  if (!usuario || !asociacion) return null;

  const porNivel = NIVELES.map((nivel) => ({
    ...nivel,
    personas: directivosDelDirectorio.filter((d) => nivel.cargos.includes(d.cargo)),
  })).filter((nivel) => nivel.personas.length > 0);

  return (
    <div className="space-y-6">
      <Aparecer>
        <h1 className="text-display font-semibold text-marca-texto">
          Organigrama
        </h1>
        <p className="mt-1 text-body text-marca-tenue">
          El directorio de {asociacion.nombreMercado} — quién firma y en qué cargo.
        </p>
      </Aparecer>

      {porNivel.length === 0 ? (
        <p className="rounded-lg border border-marca-borde bg-marca-superficie p-4 text-support text-marca-tenue">
          Todavía no hay directivos registrados.
        </p>
      ) : (
        <div className="flex flex-col items-center overflow-x-auto rounded-lg border border-marca-borde bg-marca-superficie px-4 py-10">
          {porNivel.map((nivel, i) => (
            <div key={nivel.titulo} className="flex flex-col items-center">
              {i > 0 ? <div className="h-8 w-px bg-marca-borde" aria-hidden="true" /> : null}

              {nivel.personas.length > 1 ? (
                <div
                  className="h-px bg-marca-borde"
                  style={{ width: `${Math.min(nivel.personas.length, 4) * 9}rem` }}
                  aria-hidden="true"
                />
              ) : null}

              <div className="flex flex-wrap justify-center gap-x-10 gap-y-6 pt-2">
                {nivel.personas.map((d, j) => (
                  <Aparecer key={d.id} retraso={0.05 * (i + j)}>
                    <div className="flex flex-col items-center">
                      {nivel.personas.length > 1 ? (
                        <div className="h-4 w-px bg-marca-borde" aria-hidden="true" />
                      ) : null}
                      <NodoDirectivo nombre={d.nombre} cargo={d.cargo} destacado={i === 0} />
                    </div>
                  </Aparecer>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-support text-marca-tenue">
        Este directorio es informativo — quién firma realmente lo define el
        Safe de la asociación, con el umbral configurado en Ajustes.
      </p>
    </div>
  );
}
