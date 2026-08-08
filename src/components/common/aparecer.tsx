"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Entrada suave de contenido.
 *
 * El sistema de diseño pide movimiento breve (200-250ms), fade o slide suave, y
 * explícitamente nada que se sienta como "demo tecnológica llamativa": el objetivo es
 * transmitir calma, no impresionar. Por eso el desplazamiento es de 8px y la duración
 * de 0.25s, y con `prefers-reduced-motion` el contenido simplemente aparece.
 */
export function Aparecer({
  children,
  retraso = 0,
  className,
}: {
  children: React.ReactNode;
  retraso?: number;
  className?: string;
}) {
  const menosMovimiento = useReducedMotion();

  if (menosMovimiento) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: retraso, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
