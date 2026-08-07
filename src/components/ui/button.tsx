import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

/*
  Botón Minka.
  Se reajustaron los tamaños que trae shadcn por defecto (h-8 / 32px, texto 14px):
  el sistema de diseño exige área táctil mínima de 44x44px y texto de botón de 16px
  peso 600. Ningún tamaño aquí baja de 44px, ni siquiera los "pequeños", para que
  ningún componente interno pueda producir un control por debajo del piso accesible.
*/
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-transparent bg-clip-padding text-body font-semibold whitespace-nowrap transition-colors duration-200 outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default:
          "bg-minka-primary text-white hover:bg-minka-primary-dark active:bg-minka-primary-dark",
        secondary:
          "bg-minka-secondary text-minka-text hover:bg-[#cf7f19] active:bg-[#cf7f19]",
        outline:
          "border-2 border-minka-border bg-minka-surface text-minka-text hover:bg-[#f0e8db]",
        ghost: "text-minka-text hover:bg-[#ece4d8]",
        destructive:
          "bg-minka-danger text-white hover:bg-[#832a2a] active:bg-[#832a2a]",
        link: "text-minka-primary underline underline-offset-4 hover:text-minka-primary-dark",
      },
      size: {
        // 48px: tamaño estándar de acción en la app
        default: "h-12 px-5",
        // 56px: CTAs de flujos de dinero (aportar, cobrar, confirmar)
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
