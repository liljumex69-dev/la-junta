import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/*
  tailwind-merge no conoce los tokens tipográficos propios de Minka
  (`text-display`, `text-h2`, `text-h3`, `text-body`, `text-support`, `text-micro`).
  Al no reconocerlos como tamaños de fuente los clasificaba como COLOR de texto, así
  que en un botón como `text-white ... text-h3` descartaba el `text-white` por
  considerarlo un color repetido — y el texto salía en marrón sobre el rojo de marca.

  Registrarlos aquí como font-size arregla de raíz todos los botones, badges y
  cualquier combinación futura de tamaño + color.
*/
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["display", "h2", "h3", "body", "support", "micro"] },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
