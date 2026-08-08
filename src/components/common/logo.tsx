import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Logo Junta: figuras humanas en simetría de espejo formando una X de cuatro puntas
 * — el mismo ícono de Minka, recoloreado a la paleta institucional (verde bosque y
 * bronce). La forma sigue funcionando conceptualmente: cuatro figuras iguales
 * alrededor de un centro compartido, ninguna por encima de otra, coherente con un
 * directorio donde ningún firmante tiene poder unilateral.
 *
 * - `variant="completo"` → ícono + wordmark. Encabezados, splash, materiales de pitch.
 * - `variant="icono"` → solo el ícono. Espacios reducidos.
 *
 * El wordmark se compone en Inter 600 en vez de venir quemado en el PNG, para que
 * se mantenga nítido en cualquier tamaño y herede el color del contexto.
 */
export function Logo({
  variant = "completo",
  size = 32,
  className,
  wordmarkClassName,
}: {
  variant?: "completo" | "icono";
  size?: number;
  className?: string;
  wordmarkClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src="/logo.png"
        alt=""
        width={size}
        height={size}
        priority
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
      {variant === "completo" && (
        <span
          className={cn(
            "font-semibold tracking-tight text-marca-texto",
            wordmarkClassName
          )}
          style={{ fontSize: Math.round(size * 0.72) }}
        >
          Junta
        </span>
      )}
      {/* El nombre accesible solo se agrega si el wordmark no está visible,
          para no anunciar "Junta" dos veces. */}
      {variant === "icono" && <span className="sr-only">Junta</span>}
    </span>
  );
}
