import type { MetadataRoute } from "next";

/** PWA: Minka es una app web instalable, mobile-first, solo tema claro. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Minka",
    short_name: "Minka",
    description:
      "La junta de siempre, con el dinero del grupo a salvo. Nadie lo guarda: ni el organizador, ni Minka.",
    start_url: "/inicio",
    display: "standalone",
    background_color: "#F5EFE6",
    theme_color: "#F5EFE6",
    lang: "es-PE",
    icons: [
      { src: "/logo.png", sizes: "any", type: "image/png", purpose: "any" },
    ],
  };
}
