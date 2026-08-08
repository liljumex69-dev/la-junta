"use client";

import { CheckCircle, Circle } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/utils";

/**
 * Opción grande de selección única.
 *
 * En lugar del radio button diminuto de siempre, toda la tarjeta es el área tocable:
 * para alguien con menor precisión táctil, apuntar a un círculo de 16px es una barrera
 * real. El estado seleccionado se marca con color, borde y un ícono lleno — nunca solo
 * con color, que dejaría fuera a quien no lo distingue.
 */
export function OpcionRadio({
  seleccionado,
  onSelect,
  titulo,
  descripcion,
  etiqueta,
  deshabilitado,
  motivoDeshabilitado,
  name,
}: {
  seleccionado: boolean;
  onSelect: () => void;
  titulo: string;
  descripcion: string;
  etiqueta?: React.ReactNode;
  deshabilitado?: boolean;
  motivoDeshabilitado?: string;
  name: string;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer gap-3 rounded-lg border-2 p-4 transition-colors",
        deshabilitado && "cursor-not-allowed opacity-60",
        seleccionado
          ? "border-marca-primario bg-[#e9f0ec]"
          : "border-marca-borde bg-marca-superficie hover:border-marca-tenue"
      )}
    >
      <input
        type="radio"
        name={name}
        checked={seleccionado}
        onChange={onSelect}
        disabled={deshabilitado}
        className="sr-only"
      />
      {seleccionado ? (
        <CheckCircle
          size={28}
          weight="fill"
          color="#1F5C3D"
          className="shrink-0"
          aria-hidden="true"
        />
      ) : (
        <Circle
          size={28}
          weight="duotone"
          color="#7C8A80"
          className="shrink-0"
          aria-hidden="true"
        />
      )}
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-h3 font-semibold text-marca-texto">{titulo}</span>
          {etiqueta}
        </span>
        <span className="mt-1 block text-body text-marca-tenue">
          {descripcion}
        </span>
        {deshabilitado && motivoDeshabilitado ? (
          <span className="mt-2 block text-support font-semibold text-marca-peligro">
            {motivoDeshabilitado}
          </span>
        ) : null}
      </span>
    </label>
  );
}
