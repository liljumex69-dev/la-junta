import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

/*
  Badge de Junta: radio 8px (el `rounded-4xl` de shadcn produce una píldora completa,
  que el sistema de diseño descarta explícitamente por sentirse "burbuja demasiado
  casual"). Texto 14px en vez de 12px: los badges de Junta comunican estado de cuota
  o de firma, que no es información decorativa.
*/
const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-sm border border-transparent px-2.5 py-1 text-support font-semibold whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-4",
  {
    variants: {
      variant: {
        default: "bg-marca-primario text-white",
        secondary: "bg-marca-secundario text-marca-texto",
        // Cuota al día, propuesta ejecutada
        success: "bg-[#e3ede6] text-marca-exito",
        // Mora leve — reutiliza el secundario, sin escalar a alerta todavía
        late: "bg-[#f5e9d3] text-[#7a5a26]",
        // Alerta / peligro: mora avanzada, intento sin firmas suficientes
        danger: "bg-[#f3e0de] text-marca-peligro",
        outline: "border-marca-borde bg-marca-superficie text-marca-texto",
        muted: "bg-[#ece5d3] text-marca-tenue",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
