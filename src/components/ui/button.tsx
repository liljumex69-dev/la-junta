import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

/*
  Botón de Junta.
  Se reajustaron los tamaños que trae shadcn por defecto (h-8 / 32px, texto 14px):
  el sistema de diseño exige área táctil mínima de 44x44px y texto de botón de 16px
  peso 600. Ningún tamaño aquí baja de 44px, ni siquiera los "pequeños", para que
  ningún componente interno pueda producir un control por debajo del piso accesible.
*/
const buttonVariants = cva(
  // active:scale da una respuesta táctil breve al presionar — funciona igual con
  // mouse y con dedo, sin JS. Respeta prefers-reduced-motion (regla global).
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-transparent bg-clip-padding text-body font-semibold whitespace-nowrap transition-[background-color,color,border-color,transform] duration-200 outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.96] disabled:pointer-events-none disabled:opacity-60 disabled:active:scale-100 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default:
          "bg-marca-primario text-white hover:bg-marca-primario-oscuro active:bg-marca-primario-oscuro",
        // Texto oscuro sobre el bronce, no blanco: el bronce #B8863B es un tono
        // medio donde el blanco no llega al contraste mínimo (AA) para texto normal.
        secondary:
          "bg-marca-secundario text-marca-texto hover:bg-[#a3782f] active:bg-[#a3782f]",
        outline:
          "border-2 border-marca-borde bg-marca-superficie text-marca-texto hover:bg-[#eee5cf]",
        ghost: "text-marca-texto hover:bg-[#ece5d3]",
        destructive:
          "bg-marca-peligro text-white hover:bg-[#832722] active:bg-[#832722]",
        link: "text-marca-primario underline underline-offset-4 hover:text-marca-primario-oscuro",
      },
      size: {
        // 48px: tamaño estándar de acción en la app
        default: "h-12 px-5",
        // 56px: CTAs de flujos de dinero (cuota, propuesta, firma)
        lg: "h-14 px-6 text-h3",
        // 44px: mínimo absoluto permitido
        sm: "h-11 px-4",
        xs: "h-11 px-4",
        icon: "size-12",
        "icon-sm": "size-11",
        "icon-xs": "size-11",
        "icon-lg": "size-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
