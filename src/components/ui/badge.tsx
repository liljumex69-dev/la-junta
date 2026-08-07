import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

/*
  Badge Minka: radio 8px (el `rounded-4xl` de shadcn produce una píldora completa,
  que el sistema de diseño descarta explícitamente por sentirse "burbuja demasiado
  casual"). Texto 14px en vez de 12px: los badges de Minka comunican estado de pago,
  que no es información decorativa.
*/
const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-sm border border-transparent px-2.5 py-1 text-support font-semibold whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-4",
  {
    variants: {
      variant: {
        default: "bg-minka-primary text-white",
        secondary: "bg-minka-secondary text-minka-text",
        // Cuota pagada, junta completada
        success: "bg-[#e6ecdf] text-minka-success",
        // Cuota tardía pero pagada — advertencia leve, no incumplimiento
        late: "bg-[#fbeed8] text-[#8a5810]",
        // Incumplimiento, garantía ejecutada
        danger: "bg-[#f4e0e0] text-minka-danger",
        outline: "border-minka-border bg-minka-surface text-minka-text",
        muted: "bg-[#ece4d8] text-minka-muted",
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
