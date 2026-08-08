import * as React from "react"

import { cn } from "@/lib/utils"

/*
  Input de Junta: alto 48px (por encima del mínimo táctil de 44px), radio 10px y
  texto de 16px SIEMPRE. Se eliminó el `md:text-sm` que trae shadcn por defecto:
  reducir el texto de un campo en pantallas grandes contradice el piso de 16px del
  sistema de diseño, y en iOS un input por debajo de 16px fuerza zoom automático.
*/
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-md border-2 border-marca-borde bg-marca-superficie px-4 py-2 text-body text-marca-texto transition-colors outline-none placeholder:text-marca-tenue focus-visible:border-marca-primario focus-visible:ring-3 focus-visible:ring-marca-primario/25 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-marca-peligro aria-invalid:ring-3 aria-invalid:ring-marca-peligro/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
