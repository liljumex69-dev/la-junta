import Link from "next/link";
import {
  CaretLeft,
  Check,
  Medal,
  Minus,
  UsersThree,
} from "@phosphor-icons/react/ssr";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/minka/logo";
import { soles } from "@/lib/minka/format";
import { LIMITES_PLAN } from "@/lib/minka/rules";

export const metadata = { title: "Planes — Minka" };

const G = LIMITES_PLAN.gratuito;
const P = LIMITES_PLAN.pro;

/**
 * Planes.
 *
 * La estructura de la página sigue la regla no negociable del producto: primero se
 * deja claro qué viene incluido gratis (que es todo el mecanismo de confianza), y solo
 * después qué agrega el plan pagado. La comparación termina con la regla explícita de
 * que ningún plan compra turno temprano ni junta pública — se gana con historial.
 */
const INCLUIDO_SIEMPRE = [
  "Crear juntas privadas con tu gente de confianza",
  "Garantía, prima y fondo de seguro colectivo",
  "Pedir y dar avales",
  "Tu historial de confianza completo, para siempre",
  "Recordatorios de cuota por WhatsApp",
  "Recuperar tu cuenta con contactos de confianza",
  "Reportar fuerza mayor y votar la de otros",
];

const COMPARACION: Array<{
  caracteristica: string;
  gratuito: string | boolean;
  pro: string | boolean;
}> = [
  {
    caracteristica: "Juntas al mismo tiempo",
    gratuito: `Hasta ${G.maxJuntasSimultaneas}`,
    pro: `Hasta ${P.maxJuntasSimultaneas}`,
  },
  {
    caracteristica: "Personas por junta",
    gratuito: `Hasta ${G.maxParticipantes}`,
    pro: `Hasta ${P.maxParticipantes}`,
  },
  {
    caracteristica: "Cuota máxima que puedes organizar",
    gratuito: soles(G.maxCuota),
    pro: soles(P.maxCuota),
  },
  {
    caracteristica: "Todo el mecanismo de confianza",
    gratuito: true,
    pro: true,
  },
  { caracteristica: "Historial y score", gratuito: true, pro: true },
  {
    caracteristica: "Herramientas de gestión para el organizador",
    gratuito: false,
    pro: true,
  },
  { caracteristica: "Sin anuncios", gratuito: false, pro: true },
  {
    caracteristica: "Repartir el costo del plan entre participantes",
    gratuito: false,
    pro: true,
  },
];

export default function PlanesPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-minka-border bg-minka-bg/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[720px] items-center gap-2 px-4">
          <Link
            href="/inicio"
            aria-label="Volver"
            className="touch-target -ml-3 grid place-items-center rounded-md text-minka-text transition-colors hover:bg-[#ece4d8]"
          >
            <CaretLeft size={26} weight="bold" />
          </Link>
          <Logo size={30} />
        </div>
      </header>

      <main className="minka-container flex-1 py-6">
        <h1 className="text-display font-semibold text-minka-text">Planes</h1>
        <p className="mt-2 text-body text-minka-muted">
          Lo que protege tu dinero es gratis y lo será siempre. El plan pagado solo
          agrega comodidad.
        </p>

        {/* Lo que viene incluido sin pagar */}
        <Card className="mt-6 border-2 border-minka-success">
          <CardContent>
            <h2 className="flex items-center gap-2 text-h3 font-semibold text-minka-text">
              <UsersThree
                size={26}
                weight="duotone"
                color="#4B6B3A"
                aria-hidden="true"
              />
              Incluido siempre, sin pagar nada
            </h2>
            <ul className="mt-4 space-y-3">
              {INCLUIDO_SIEMPRE.map((item) => (
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

        {/* Los dos planes */}
        <div className="mt-6 space-y-4">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-h3 font-semibold text-minka-text">
                  Gratuito
                </h2>
                <Badge variant="success">Tu plan</Badge>
              </div>
              <p className="mt-2 text-[32px] leading-tight font-semibold text-minka-text">
                S/ 0
              </p>
              <p className="mt-1 text-body text-minka-muted">
                Para juntas con tu gente de siempre.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-minka-secondary">
            <CardContent>
              <h2 className="text-h3 font-semibold text-minka-text">
                Organizador Pro
              </h2>
              <p className="mt-2 text-[32px] leading-tight font-semibold text-minka-text">
                S/ 12{" "}
                <span className="text-body font-normal text-minka-muted">
                  al mes
                </span>
              </p>
              <p className="mt-1 text-body text-minka-muted">
                Para quien organiza varias juntas o maneja montos más altos. Puedes
                repartir el costo entre los participantes.
              </p>
              <Button size="lg" className="mt-5 w-full">
                Probar Organizador Pro
              </Button>
              {/* TODO: conectar a smart contract — o a la pasarela de pago del plan.
                  El plan es un cobro de servicio de Minka, no toca el pozo de ninguna junta. */}
            </CardContent>
          </Card>
        </div>

        {/* Comparación */}
        <section className="mt-8">
          <h2 className="text-h2 font-semibold text-minka-text">
            Qué cambia entre uno y otro
          </h2>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse overflow-hidden rounded-lg border border-minka-border bg-minka-surface">
              <thead>
                <tr className="border-b border-minka-border bg-[#f2ebe0]">
                  <th className="p-4 text-left text-support font-semibold text-minka-text">
                    &nbsp;
                  </th>
                  <th className="p-4 text-left text-support font-semibold text-minka-text">
                    Gratuito
                  </th>
                  <th className="p-4 text-left text-support font-semibold text-minka-text">
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARACION.map((fila) => (
                  <tr
                    key={fila.caracteristica}
                    className="border-b border-minka-border last:border-0"
                  >
                    <th
                      scope="row"
                      className="p-4 text-left text-body font-normal text-minka-text"
                    >
                      {fila.caracteristica}
                    </th>
                    {[fila.gratuito, fila.pro].map((valor, i) => (
                      <td key={i} className="p-4 text-body text-minka-text">
                        {typeof valor === "boolean" ? (
                          valor ? (
                            <>
                              <Check
                                size={22}
                                weight="bold"
                                color="#4B6B3A"
                                aria-hidden="true"
                              />
                              <span className="sr-only">Incluido</span>
                            </>
                          ) : (
                            <>
                              <Minus
                                size={22}
                                weight="bold"
                                color="#8A7A6D"
                                aria-hidden="true"
                              />
                              <span className="sr-only">No incluido</span>
                            </>
                          )
                        ) : (
                          valor
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Regla no negociable */}
        <div className="mt-8 rounded-lg border-2 border-minka-primary bg-[#f9ece9] p-5">
          <h2 className="flex items-center gap-2 text-h3 font-semibold text-minka-text">
            <Medal size={26} weight="duotone" color="#BF312A" aria-hidden="true" />
            Lo que ningún plan compra
          </h2>
          <p className="mt-3 text-body text-minka-text">
            Cobrar un turno temprano y organizar juntas públicas{" "}
            <strong className="font-semibold">no están a la venta</strong>. Eso se
            gana solo con historial: cumpliendo tus cuotas y completando juntas con
            gente distinta.
          </p>
          <p className="mt-3 text-body text-minka-text">
            Si fuera de otra forma, el dinero compraría la confianza del grupo — y
            entonces el historial no valdría nada.
          </p>
          <Button asChild variant="outline" size="lg" className="mt-5 w-full">
            <Link href="/historial">Ver mi historial</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
