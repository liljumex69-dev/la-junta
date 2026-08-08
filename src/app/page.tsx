import Link from "next/link";
import {
  ArrowRight,
  Buildings,
  Check,
  Eye,
  Handshake,
  HandCoins,
  Megaphone,
  ShieldCheck,
  Signature,
  Vault,
  WhatsappLogo,
} from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/common/logo";
import { HeroCarousel } from "@/components/landing/hero-carousel";
import { SiteHeader } from "@/components/landing/site-header";

/*
  Landing page pública.

  Decisión de diseño no cubierta explícitamente en los documentos: el titular del hero
  usa un tamaño mayor (36-44px) que el H1 de 28px del sistema. La escala del sistema de
  diseño está definida para "títulos de pantalla" dentro de la app; en una página de
  marketing, mantener 28px dejaría el hero sin jerarquía. El resto de la página respeta
  la escala al pie de la letra.
*/

const PASOS = [
  {
    icono: Buildings,
    titulo: "Crea o únete a tu asociación",
    texto:
      "El directivo funda la asociación de su mercado, o el comerciante entra con el código de su puesto.",
  },
  {
    icono: HandCoins,
    titulo: "Paga tu cuota",
    texto: "Escaneas un código QR con Yape o Plin, tal como ya lo haces hoy. Nada nuevo que aprender.",
  },
  {
    icono: Eye,
    titulo: "Ves el fondo en todo momento",
    texto: "El saldo, cada movimiento y quién propuso qué queda visible y verificable para cualquier miembro.",
  },
  {
    icono: Signature,
    titulo: "Los gastos se aprueban entre varios",
    texto: "Un directivo propone, los demás firman. Solo se ejecuta cuando se junta el número de firmas acordado.",
  },
];

const BENEFICIOS = [
  {
    icono: ShieldCheck,
    titulo: "Nadie mueve el fondo solo",
    texto:
      "Ni el tesorero, ni el presidente, ni nadie individual puede sacar dinero del fondo. Cada gasto necesita el acuerdo de varios directivos, siempre.",
  },
  {
    icono: Eye,
    titulo: "Todo verificable, en todo momento",
    texto:
      "El historial completo del fondo es público para los miembros de la asociación — no hay que confiar en la palabra de nadie, se puede comprobar.",
  },
  {
    icono: Handshake,
    titulo: "Se usa como ya lo conoces",
    texto:
      "Pagas por Yape o Plin. Sin wallets, sin jerga técnica, sin nada nuevo que memorizar. La tecnología queda invisible.",
  },
  {
    icono: WhatsappLogo,
    titulo: "Te avisamos por WhatsApp",
    texto:
      "Recordatorios de cuota y de propuestas esperando tu firma llegan por WhatsApp, donde ya estás.",
  },
];

export default function LandingPage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="px-4 pt-10 pb-14 sm:pt-16">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <p className="mb-4 inline-flex items-center rounded-sm bg-[#f0e3c9] px-3 py-1.5 text-support font-semibold text-[#7a5a26]">
                El fondo de tu mercado, fuera del cajón del tesorero
              </p>
              <h1 className="text-[36px] leading-[1.15] font-semibold tracking-tight text-marca-texto sm:text-[44px]">
                Un mercado de Villa El Salvador perdió su fondo colectivo por
                guardarlo en efectivo. No tenía que pasar así.
              </h1>
              <p className="mt-5 max-w-xl text-h3 leading-relaxed font-normal text-marca-texto/85">
                Junta protege el fondo de tu asociación con firma múltiple: el
                dinero vive en una bóveda digital que ningún directivo puede abrir
                solo. Se necesitan varias firmas — siempre.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/registro">
                    Proteger el fondo de mi mercado
                    <ArrowRight size={22} weight="bold" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#como-funciona">Ver cómo funciona</Link>
                </Button>
              </div>

              <p className="mt-5 text-support text-marca-tenue">
                Pagas por Yape o Plin, como siempre. Nada de wallets ni jerga cripto.
              </p>
            </div>

            <HeroCarousel />
          </div>
        </section>

        {/* Cómo funciona */}
        <section
          id="como-funciona"
          className="scroll-mt-20 border-t border-marca-borde bg-marca-superficie px-4 py-16"
        >
          <div className="mx-auto w-full max-w-6xl">
            <h2 className="text-h2 font-semibold text-marca-texto">
              Cómo funciona
            </h2>
            <p className="mt-3 max-w-2xl text-body text-marca-tenue">
              Cuatro pasos. El mismo ritmo de siempre, con la custodia resuelta de
              raíz.
            </p>

            <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PASOS.map((paso, i) => {
                const Icono = paso.icono;
                return (
                  <li key={paso.titulo}>
                    {/* Relieve al pasar el cursor: 200ms, elevación sutil. */}
                    <Card className="h-full transition-[box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-elevated">
                      <CardContent className="flex h-full flex-col gap-3">
                        <span className="flex size-14 items-center justify-center rounded-lg bg-[#e9f0ec]">
                          <Icono
                            size={30}
                            weight="duotone"
                            color="#1F5C3D"
                            aria-hidden="true"
                          />
                        </span>
                        <span className="text-support font-semibold text-marca-secundario">
                          Paso {i + 1}
                        </span>
                        <h3 className="text-h3 font-semibold text-marca-texto">
                          {paso.titulo}
                        </h3>
                        <p className="text-body text-marca-tenue">{paso.texto}</p>
                      </CardContent>
                    </Card>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* Beneficios */}
        <section className="px-4 py-16">
          <div className="mx-auto w-full max-w-6xl">
            <h2 className="text-h2 font-semibold text-marca-texto">
              Por qué es distinto
            </h2>
            <p className="mt-3 max-w-2xl text-body text-marca-tenue">
              La confianza de una asociación no debería depender de que una sola
              persona no falle nunca.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {BENEFICIOS.map((b) => {
                const Icono = b.icono;
                return (
                  <Card
                    key={b.titulo}
                    className="transition-[box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-elevated"
                  >
                    <CardContent className="flex gap-4">
                      <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-[#ece5d3]">
                        <Icono
                          size={30}
                          weight="duotone"
                          color="#1F5C3D"
                          aria-hidden="true"
                        />
                      </span>
                      <div>
                        <h3 className="text-h3 font-semibold text-marca-texto">
                          {b.titulo}
                        </h3>
                        <p className="mt-1.5 text-body text-marca-tenue">
                          {b.texto}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Precios: modelo B2B por asociación, sin planes freemium individuales */}
        <section
          id="precios"
          className="scroll-mt-20 border-t border-marca-borde bg-marca-superficie px-4 py-16"
        >
          <div className="mx-auto w-full max-w-3xl text-center">
            <h2 className="text-h2 font-semibold text-marca-texto">Precios</h2>
            <p className="mx-auto mt-3 max-w-xl text-body text-marca-tenue">
              Junta se contrata por asociación, no por persona. Cada comerciante y
              cada directivo usan la plataforma sin costo individual.
            </p>

            <Card className="mt-8 text-left">
              <CardContent>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-h3 font-semibold text-marca-texto">
                    Suscripción por asociación
                  </h3>
                  <Vault size={28} weight="duotone" color="#1F5C3D" aria-hidden="true" />
                </div>
                <p className="mt-2 text-[28px] font-semibold text-marca-texto">
                  Una cuota mensual fija
                  <span className="block text-body font-normal text-marca-tenue">
                    Se conversa con cada mercado según su número de puestos
                  </span>
                </p>
                <ul className="mt-5 space-y-3">
                  {[
                    "Fondo protegido con firma múltiple, sin límite de movimientos",
                    "Todos los comerciantes y directivos de tu mercado incluidos",
                    "Historial de cumplimiento y reportes exportables para SUNAT",
                    "Centro de ayuda y acompañamiento durante la puesta en marcha",
                  ].map((item) => (
                    <li key={item} className="flex gap-2.5 text-body">
                      <Check
                        size={22}
                        weight="bold"
                        color="#4C8C5C"
                        className="mt-0.5 shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-marca-texto">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <p className="mt-6 rounded-lg border border-marca-borde bg-marca-fondo p-4 text-body text-marca-texto">
              <strong className="font-semibold">
                Ningún plan cambia quién puede mover el fondo.
              </strong>{" "}
              El umbral de firmas lo define cada asociación, no un nivel de
              suscripción.
            </p>

            <Button asChild size="lg" className="mt-8">
              <Link href="/registro">
                Hablar sobre mi asociación
                <ArrowRight size={22} weight="bold" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Cierre */}
        <section className="px-4 py-16">
          <div className="mx-auto w-full max-w-3xl text-center">
            <h2 className="text-h2 font-semibold text-marca-texto">
              Empieza a proteger tu fondo esta semana
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-body text-marca-tenue">
              Solo necesitas tu número de celular y los datos de tu directorio.
            </p>
            <Button asChild size="lg" className="mt-7">
              <Link href="/registro">
                Crear mi cuenta
                <ArrowRight size={22} weight="bold" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-marca-borde bg-marca-superficie px-4 py-12">
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <Logo size={34} />
              <p className="mt-3 max-w-xs text-support text-marca-tenue">
                El fondo de tu asociación, protegido con firma múltiple.
              </p>
            </div>

            <nav aria-label="Navegación del pie">
              <h2 className="text-support font-semibold text-marca-texto">
                Junta
              </h2>
              <ul className="mt-2">
                {[
                  { href: "#como-funciona", label: "Cómo funciona" },
                  { href: "#precios", label: "Precios" },
                  { href: "/soporte", label: "Centro de ayuda" },
                  { href: "/registro", label: "Crear cuenta" },
                ].map((e) => (
                  <li key={e.href}>
                    <Link
                      href={e.href}
                      className="touch-target flex items-center text-body text-marca-tenue transition-colors hover:text-marca-texto"
                    >
                      {e.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="text-support font-semibold text-marca-texto">
                Contacto
              </h2>
              <ul className="mt-2">
                <li>
                  <a
                    href="https://wa.me/51987654321"
                    className="touch-target flex items-center gap-2 text-body text-marca-tenue transition-colors hover:text-marca-texto"
                  >
                    <WhatsappLogo size={22} weight="fill" aria-hidden="true" />
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:hola@junta.pe"
                    className="touch-target flex items-center text-body text-marca-tenue transition-colors hover:text-marca-texto"
                  >
                    hola@junta.pe
                  </a>
                </li>
                <li>
                  <span className="flex items-center gap-2 text-body text-marca-tenue">
                    <Megaphone size={20} weight="duotone" aria-hidden="true" />
                    Anuncios solo dentro de tu asociación
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <p className="mt-10 border-t border-marca-borde pt-6 text-support text-marca-tenue">
            © 2026 Junta. Junta no custodia el fondo de las asociaciones ni actúa
            como entidad financiera — el fondo vive en un Safe multifirma. Prototipo
            con fines de demostración.
          </p>
        </div>
      </footer>
    </>
  );
}
