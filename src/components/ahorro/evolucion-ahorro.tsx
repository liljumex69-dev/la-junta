import type { MovimientoAhorro } from "@/lib/junta/types";

/**
 * Línea simple de evolución del saldo en el tiempo — a propósito minimalista:
 * el documento pide un dashboard "sin paneles de múltiples métricas", así que
 * esto es solo una línea, sin ejes ni leyendas que compitan con el saldo grande
 * de arriba.
 */
export function EvolucionAhorro({
  movimientos,
}: {
  movimientos: MovimientoAhorro[];
}) {
  if (movimientos.length < 2) return null;

  const cronologico = [...movimientos].sort((a, b) => a.fecha.localeCompare(b.fecha));

  let acumulado = 0;
  const puntos = cronologico.map((m) => {
    acumulado += m.tipo === "ingreso" ? m.monto : -m.monto;
    return acumulado;
  });

  const min = Math.min(...puntos, 0);
  const max = Math.max(...puntos, 1);
  const rango = max - min || 1;
  const ancho = 300;
  const alto = 64;

  const coordenadas = puntos.map((valor, i) => {
    const x = (i / (puntos.length - 1)) * ancho;
    const y = alto - ((valor - min) / rango) * alto;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  return (
    <div>
      <p className="text-support font-semibold text-marca-tenue">
        Evolución de tu saldo
      </p>
      <svg
        viewBox={`0 0 ${ancho} ${alto}`}
        className="mt-2 h-16 w-full"
        role="img"
        aria-label="Línea de evolución del saldo de ahorro a lo largo del tiempo"
        preserveAspectRatio="none"
      >
        <polyline
          points={coordenadas.join(" ")}
          fill="none"
          stroke="#B8863B"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
