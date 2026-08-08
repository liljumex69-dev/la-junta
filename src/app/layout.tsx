import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProveedorJunta } from "@/lib/junta/context";
import "./globals.css";

// Inter, decisión explícita del sistema de diseño: máxima legibilidad para un
// público con poca familiaridad tecnológica, priorizando claridad sobre
// personalidad tipográfica — la misma razón que en Minka.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Junta — Tesorería digital para asociaciones de comerciantes",
  description:
    "Junta protege el fondo colectivo de tu asociación con firma múltiple: ningún directivo puede mover el dinero solo.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#F3EFE4",
  width: "device-width",
  initialScale: 1,
  // No se bloquea el zoom: restringirlo perjudica directamente a usuarios con baja visión.
  maximumScale: 5,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-PE" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ProveedorJunta>
          <TooltipProvider delayDuration={300}>{children}</TooltipProvider>
        </ProveedorJunta>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
