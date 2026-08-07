import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ProveedorSesion } from "@/lib/minka/prototipo/sesion";
import "./globals.css";

// Inter, decisión explícita del sistema de diseño: se descartó Nunito porque un
// producto que maneja dinero y reputación necesita legibilidad máxima, no personalidad juguetona.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Minka — La junta de siempre, ahora sin riesgo",
  description:
    "Minka digitaliza la junta o pandero de toda la vida. El dinero del grupo no lo guarda nadie: ni el organizador, ni Minka.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#F5EFE6",
  width: "device-width",
  initialScale: 1,
  // No se bloquea el zoom: restringirlo perjudica directamente a usuarios con baja visión.
  maximumScale: 5,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-PE" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ProveedorSesion>{children}</ProveedorSesion>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
