import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  ChartLineUp,
  Check,
  HandCoins,
  Handshake,
  Medal,
  Sparkle,
  UsersThree,
  WhatsappLogo,
} from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/minka/logo";
import { NIVELES } from "@/lib/minka/niveles";
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
    icono: UsersThree,
    titulo: "Crea o únete a una junta",
    texto:
      "Arma tu junta con la gente que ya conoces, o entra a una con el código que te compartan.",
  },
  {
    icono: CalendarCheck,
    titulo: "Aporta tu cuota",
    texto:
      "Cada semana, quincena o mes pones el mismo monto. Te avisamos antes de cada fecha.",
  },
  {
    icono: HandCoins,
    titulo: "Recibe tu turno",
    texto:
      "Cuando te toca, el pozo completo pasa a tus manos. Sin descuentos ni retenciones.",
  },
  {
    icono: ChartLineUp,
    titulo: "Construye tu historial",
    texto:
      "Cada cuota puntual queda registrada y te abre mejores condiciones en la siguiente junta.",
  },
];

const BENEFICIOS = [
  {
    icono: Handshake,
    titulo: "Nadie puede desaparecer con el dinero",
    texto:
      "El dinero del grupo no lo guarda una persona: lo guarda un contrato que cumple las reglas que ustedes fijaron. Ni el organizador ni Minka pueden tocarlo.",
  },
  {
    icono: Sparkle,
    titulo: "Se usa como cualquier app",
    texto:
      "Entras con tu número de celular y listo. No necesitas saber nada de tecnología: eso queda por debajo, donde no estorba.",
  },
  {
    icono: Medal,
    titulo: "Tu historial te acompaña siempre",
    texto:
      "Cumplir se nota. Mientras más juntas completas con gente distinta, menos garantía te piden para cobrar temprano.",
  },
  {
    icono: WhatsappLogo,
    titulo: "Te avisamos por WhatsApp",
    texto:
      "Los recordatorios de cuota llegan por WhatsApp, donde ya estás. Sin tener que abrir la app para enterarte.",
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
              <p className="mb-4 inline-flex items-center rounded-sm bg-[#f4e2d0] px-3 py-1.5 text-support font-semibold text-[#8a5810]">
                La junta de toda la vida, sin el riesgo de siempre
              </p>
              <h1 className="text-[36px] leading-[1.15] font-semibold tracking-tight text-minka-text sm:text-[44px]">
                Tu junta sigue igual. Lo que cambia es que ya nadie puede irse con
                el dinero.
              </h1>
              <p className="mt-5 max-w-xl text-h3 leading-relaxed font-normal text-minka-text/85">
                Minka organiza tu junta o pandero con las mismas reglas de siempre:
                todos ponen su cuota y, por turnos, a cada quien le toca el pozo
                completo. La diferencia es que el dinero del grupo no lo guarda
                nadie — ni el organizador, ni Minka.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/registro">
                    Crear mi cuenta
                    <ArrowRight size={22} weight="bold" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#como-funciona">Ver cómo funciona</Link>
                </Button>
              </div>

              <p className="mt-5 text-support text-minka-muted">
                Crear y participar en juntas privadas es gratis, siempre.
              </p>
            </div>

            <HeroCarousel />
          </div>
        </section>

        {/* Cómo funciona */}
        <section
          id="como-funciona"
          className="scroll-mt-20 border-t border-minka-border bg-minka-surface px-4 py-16"
        >
          <div className="mx-auto w-full max-w-6xl">
            <h2 className="text-h2 font-semibold text-minka-text">
              Cómo funciona
            </h2>
            <p className="mt-3 max-w-2xl text-body text-minka-muted">
              Cuatro pasos. Los mismos que ya conoces de una junta de papel.
            </p>

            <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PASOS.map((paso, i) => {
                const Icono = paso.icono;
                return (
                  <li key={paso.titulo}>
                    {/* Relieve al pasar el cursor: 200ms, elevación sutil y un
                        desplazamiento de 2px. Suficiente para que la tarjeta se
                        sienta viva sin volverse una animación llamativa. */}
                    <Card className="h-full transition-[box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-elevated">
                      <CardContent className="flex h-full flex-col gap-3">
                        <span className="flex size-14 items-center justify-center rounded-lg bg-[#f7e6d5]">
                          <Icono
                            size={30}
                            weight="duotone"
                            color="#BF312A"
                            aria-hidden="true"
                          />
                        </span>
                        {/* El número sí es información: el orden de los pasos importa */}
                        <span className="text-support font-semibold text-minka-secondary">
                          Paso {i + 1}
                        </span>
                        <h3 className="text-h3 font-semibold text-minka-text">
                          {paso.titulo}
                        </h3>
                        <p className="text-body text-minka-muted">{paso.texto}</p>
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
            <h2 className="text-h2 font-semibold text-minka-text">
              Por qué es distinto
            </h2>
            <p className="mt-3 max-w-2xl text-body text-minka-muted">
              La junta funciona porque hay confianza. Minka hace que esa confianza
              no dependa de una sola persona.
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
                      <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-[#e9e2d4]">
                        <Icono
                          size={30}
                          weight="duotone"
                          color="#BF312A"
                          aria-hidden="true"
                        />
                      </span>
                      <div>
                        <h3 className="text-h3 font-semibold text-minka-text">
                          {b.titulo}
                        </h3>
                        <p className="mt-1.5 text-body text-minka-muted">
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

        {/* Niveles de confianza */}
        <section className="border-t border-minka-border bg-minka-surface px-4 py-16">
          <div className="mx-auto w-full max-w-6xl">
            <h2 className="text-h2 font-semibold text-minka-text">
              Cumplir te cuesta menos
            </h2>
            <p className="mt-3 max-w-2xl text-body text-minka-muted">
              Cada cuota puntual sube tu nivel. Y mientras más alto tu nivel, menos
              garantía te piden para cobrar tu turno antes de tiempo.
            </p>

            <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {NIVELES.map((nivel) => (
                <li key={nivel.id}>
                  <div
                    className="flex h-full flex-col rounded-lg border border-minka-border bg-minka-bg p-5 transition-[box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-elevated"
                    style={{ borderTopColor: nivel.color, borderTopWidth: 4 }}
                  >
                    <Medal
                      size={30}
                      weight="duotone"
                      color={nivel.color}
                      aria-hidden="true"
                    />
                    <h3
                      className="mt-3 text-h3 font-semibold"
                      style={{ color: nivel.color }}
                    >
                      {nivel.nombre}
                    </h3>
                    <p className="mt-1 text-support font-semibold text-minka-text">
                      Garantía: {nivel.porcentajeGarantia}%
                    </p>
                    <p className="mt-2 text-support text-minka-muted">
                      {nivel.beneficio}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="mt-6 rounded-lg border border-minka-border bg-minka-bg p-4 text-body text-minka-text">
              Y aparte del nivel: cuando terminas 2 juntas como organizador, puedes
              abrir juntas públicas, donde entra gente que todavía no conoces.
            </p>
          </div>
        </section>

        {/* Planes */}
        <section className="border-t border-minka-border bg-minka-bg px-4 py-16">
          <div className="mx-auto w-full max-w-6xl">
            <h2 className="text-h2 font-semibold text-minka-text">Planes</h2>
            <p className="mt-3 max-w-2xl text-body text-minka-muted">
              Lo que hace segura a una junta es gratis y lo será siempre. El plan
              pagado solo agrega comodidad.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <Card>
                <CardContent>
                  <h3 className="text-h3 font-semibold text-minka-text">
                    Gratuito
                  </h3>
                  <p className="mt-1 text-h2 font-semibold text-minka-text">
                    S/ 0
                  </p>
                  <ul className="mt-5 space-y-3">
                    {[
                      "Juntas privadas con tu gente de confianza",
                      "Garantía, aval y prima incluidos",
                      "Tu historial de confianza completo",
                      "Recordatorios por WhatsApp",
                    ].map((item) => (
                      <li key={item} className="flex gap-2.5 text-body">
                        <Check
                          size={22}
                          weight="bold"
                          color="#4B6B3A"
                          className="mt-0.5 shrink-0"
                          aria-hidden="true"
                        />
                        <span className="text-minka-text">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-minka-secondary">
                <CardContent>
                  <h3 className="text-h3 font-semibold text-minka-text">
                    Organizador Pro
                  </h3>
                  <p className="mt-1 text-h2 font-semibold text-minka-text">
                    S/ 12{" "}
                    <span className="text-body font-normal text-minka-muted">
                      al mes
                    </span>
                  </p>
                  <ul className="mt-5 space-y-3">
                    {[
                      "Más juntas al mismo tiempo",
                      "Montos más altos en juntas privadas",
                      "Herramientas de gestión para el organizador",
                      "Sin anuncios",
                    ].map((item) => (
                      <li key={item} className="flex gap-2.5 text-body">
                        <Check
                          size={22}
                          weight="bold"
                          color="#4B6B3A"
                          className="mt-0.5 shrink-0"
                          aria-hidden="true"
                        />
                        <span className="text-minka-text">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <p className="mt-6 rounded-lg border border-minka-border bg-minka-bg p-4 text-body text-minka-text">
              <strong className="font-semibold">
                Ningún plan compra tu turno.
              </strong>{" "}
              Cobrar temprano y organizar juntas públicas se gana solo con
              historial. Eso no está a la venta.
            </p>

            <Button asChild variant="outline" size="lg" className="mt-8">
              <Link href="/planes">
                Ver el detalle de los planes
                <ArrowRight size={22} weight="bold" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Cierre */}
        <section className="px-4 py-16">
          <div className="mx-auto w-full max-w-3xl text-center">
            <h2 className="text-h2 font-semibold text-minka-text">
              Empieza tu junta esta semana
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-body text-minka-muted">
              Solo necesitas tu número de celular y la gente con la que siempre
              ahorras.
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

      <footer className="border-t border-minka-border bg-minka-surface px-4 py-12">
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <Logo size={34} />
              <p className="mt-3 max-w-xs text-support text-minka-muted">
                La junta de siempre, con el dinero del grupo a salvo.
              </p>
            </div>

            <nav aria-label="Navegación del pie">
              <h2 className="text-support font-semibold text-minka-text">
                Minka
              </h2>
              <ul className="mt-2">
                {[
                  { href: "#como-funciona", label: "Cómo funciona" },
                  { href: "/planes", label: "Planes" },
                  { href: "/soporte", label: "Centro de ayuda" },
                  { href: "/registro", label: "Crear cuenta" },
                ].map((e) => (
                  <li key={e.href}>
                    <Link
                      href={e.href}
                      className="touch-target flex items-center text-body text-minka-muted transition-colors hover:text-minka-text"
                    >
                      {e.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="text-support font-semibold text-minka-text">
                Contacto
              </h2>
              <ul className="mt-2">
                <li>
                  <a
                    href="https://wa.me/51987654321"
                    className="touch-target flex items-center gap-2 text-body text-minka-muted transition-colors hover:text-minka-text"
                  >
                    <WhatsappLogo size={22} weight="fill" aria-hidden="true" />
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:hola@minka.pe"
                    className="touch-target flex items-center text-body text-minka-muted transition-colors hover:text-minka-text"
                  >
                    hola@minka.pe
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <p className="mt-10 border-t border-minka-border pt-6 text-support text-minka-muted">
            © 2026 Minka. Minka no custodia el dinero de las juntas ni actúa como
            entidad financiera. Prototipo con fines de demostración.
          </p>
        </div>
      </footer>
    </>
  );
}
