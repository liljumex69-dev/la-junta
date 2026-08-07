import { ETIQUETA_NIVEL, nivelDeConfianza } from "@/lib/minka/rules";
import type { NivelConfianza } from "@/lib/minka/types";

const COLOR_NIVEL: Record<NivelConfianza, string> = {
  nuevo: "#8A7A6D",
  en_construccion: "#E38E20",
  confiable: "#4B6B3A",
  muy_confiable: "#4B6B3A",
};

/**
 * Medidor del score de reputación.
 *
 * Se muestra el número y la etiqueta juntos: "78 de 100" solo no le dice nada a
 * alguien que nunca ha visto un puntaje de crédito, y la etiqueta sola esconde el
 * progreso. La barra no depende solo del color — el texto dice lo mismo.
 */
export function MedidorScore({ score }: { score: number }) {
  const nivel = nivelDeConfianza(score);
  const color = COLOR_NIVEL[nivel];

  return (
    <div className="rounded-lg border-2 border-minka-border bg-minka-surface p-5">
      <p className="text-body text-minka-muted">Tu historial de confianza</p>

      <p className="mt-1 flex items-baseline gap-2">
        <span className="text-[44px] leading-none font-semibold text-minka-text">
          {score}
        </span>
        <span className="text-h3 text-minka-muted">de 100</span>
      </p>

      <p className="mt-2 text-h3 font-semibold" style={{ color }}>
        {ETIQUETA_NIVEL[nivel]}
      </p>

      <div
        className="mt-4 h-3 w-full overflow-hidden rounded-sm bg-[#e9e0d2]"
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Historial de confianza: ${score} de 100, ${ETIQUETA_NIVEL[nivel]}`}
      >
        <span
          className="block h-full rounded-sm transition-[width] duration-200"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>

      <p className="mt-4 text-body text-minka-muted">
        Mientras más sube, menos garantía te piden para cobrar un turno temprano.
      </p>
    </div>
  );
}
