import { SpinnerGap } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/utils";

/**
 * Spinner pequeño, pensado para integrarse DENTRO de un botón.
 *
 * El sistema de diseño prohíbe bloquear la pantalla con un overlay de carga para
 * acciones de menos de ~2 segundos: se siente más pesado de lo que realmente es.
 */
export function Spinner({
  size = 20,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <SpinnerGap
      size={size}
      weight="bold"
      className={cn("animate-spin", className)}
      aria-hidden="true"
    />
  );
}
