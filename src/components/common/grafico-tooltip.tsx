import { soles } from "@/lib/junta/format";

/** Tooltip de recharts con la misma superficie/borde que el resto de tarjetas. */
export function GraficoTooltip({
  active,
  label,
  payload,
}: {
  active?: boolean;
  label?: string;
  payload?: { name: string; value: number; color?: string }[];
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-md border border-marca-borde bg-marca-superficie px-3 py-2 shadow-elevated">
      <p className="text-support font-semibold text-marca-texto">{label}</p>
      <div className="mt-1 space-y-0.5">
        {payload.map((p) => (
          <p key={p.name} className="flex items-center gap-2 text-support">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: p.color }}
              aria-hidden="true"
            />
            <span className="text-marca-tenue">{p.name}</span>
            <span className="font-semibold text-marca-texto">{soles(p.value)}</span>
          </p>
        ))}
      </div>
    </div>
  );
}
