import * as React from "react"

import { cn } from "@/lib/utils"

/*
  Input Minka: alto 48px (por encima del mínimo táctil de 44px), radio 10px y
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
        "h-12 w-full min-w-0 rounded-md border-2 border-minka-border bg-minka-surface px-4 py-2 text-body text-minka-text transition-colors outline-none placeholder:text-minka-muted focus-visible:border-minka-primary focus-visible:ring-3 focus-visible:ring-minka-primary/25 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-minka-danger aria-invalid:ring-3 aria-invalid:ring-minka-danger/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
