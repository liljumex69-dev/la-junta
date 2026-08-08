import type { MetadataRoute } from "next";

/** PWA: Junta es una app web instalable, mobile-first, solo tema claro. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Junta",
    short_name: "Junta",
    description:
      "El fondo de tu asociación de comerciantes, protegido con firma múltiple. Ningún directivo puede moverlo solo.",
    start_url: "/inicio",
    display: "standalone",
    background_color: "#F3EFE4",
    theme_color: "#F3EFE4",
    lang: "es-PE",
    icons: [
      { src: "/logo.png", sizes: "any", type: "image/png", purpose: "any" },
    ],
  };
}
