"use client";

import Link from "next/link";
import {
  CaretLeft,
  CheckCircle,
  Medal,
  UsersThree,
} from "@phosphor-icons/react/ssr";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Aparecer } from "@/components/minka/aparecer";
import { NIVELES, nivelDe } from "@/lib/minka/niveles";
import { puedeCrearJuntaPublica } from "@/lib/minka/rules";
import { useSesion } from "@/lib/minka/prototipo/sesion";

/**
 * Cómo suben los niveles.
 *
 * Faltaba una pantalla que explicara por qué a alguien le conviene construir
 * historial. Sin esto, el score es un número sin consecuencias visibles.
 *
 * Deja explícito que hay DOS ejes independientes, porque confundirlos es la
 * malinterpretación más fácil del producto:
 *   - Nivel (score) → cuánta garantía te piden
 *   - Juntas completadas → si puedes organizar juntas públicas
 * Ninguno de los dos se compra con un plan.
 */
export default function NivelesPage() {
  const { usuario } = useSesion();
  if (!usuario) return null;

  const miNivel = nivelDe(usuario.score);
  const puedePublica = puedeCrearJuntaPublica(usuario.juntasCompletadas);
  const faltanJuntas = Math.max(0, 2 - usuario.juntasCompletadas);

  return (
    <div className="space-y-6">
      <Link
        href="/inicio"
        className="touch-target -ml-3 flex w-fit items-center gap-1 rounded-md pr-3 text-body font-semibold text-minka-text transition-colors hover:bg-[#ece4d8]"
      >
        <CaretLeft size={22} weight="bold" aria-hidden="true" />
        Inicio
      </Link>

      <Aparecer>
        <h1 className="text-display font-semibold text-minka-text">
          Cómo suben los niveles
        </h1>
        <p className="mt-2 text-body text-minka-muted">
          Tu nivel no es un adorno: define cuánta garantía te piden para cobrar tu
          turno antes de tiempo. Mientras más cumples, menos te piden.
        </p>
      </Aparecer>

      {/* Eje 1 — nivel y garantía */}
      <section>
        <h2 className="text-h2 font-semibold text-minka-text">
          Tu nivel y la garantía
        </h2>
        <div className="mt-4 space-y-3">
          {NIVELES.map((nivel, i) => {
            const esElMio = nivel.id === miNivel.id;
            return (
              <Aparecer key={nivel.id} retraso={0.04 * i}>
                <Card
                  className={
                    esElMio ? "border-2" : undefined
                  }
                  style={esElMio ? { borderColor: nivel.color } : undefined}
                >
                  <CardContent>
                    <div className="flex items-start gap-3">
                      <span
                        className="grid size-12 shrink-0 place-items-center rounded-lg"
                        style={{ backgroundColor: nivel.fondo }}
                      >
                        <Medal
                          size={26}
                          weight="duotone"
                          color={nivel.color}
                          aria-hidden="true"
                        />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3
                            className="text-h3 font-semibold"
                            style={{ color: nivel.color }}
                          >
                            {nivel.nombre}
                          </h3>
                          {esElMio ? (
                            <Badge variant="outline">Tu nivel ahora</Badge>
                          ) : null}
                        </div>
                        <p className="mt-1 text-support text-minka-muted">
                          Desde {nivel.desde} puntos · te piden el{" "}
                          <strong className="font-semibold text-minka-text">
                            {nivel.porcentajeGarantia}%
                          </strong>{" "}
                          de garantía
                        </p>
                        <p className="mt-2 text-body text-minka-text">
                          {nivel.beneficio}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Aparecer>
            );
          })}
        </div>

        <p className="mt-4 rounded-lg border border-minka-border bg-minka-surface p-4 text-body text-minka-text">
          La garantía se calcula sobre lo que todavía te falta aportar. Si tu turno es
          de los últimos, casi no te piden nada — y en el último turno, nada.
        </p>
      </section>

      {/* Eje 2 — juntas públicas */}
      <section>
        <h2 className="text-h2 font-semibold text-minka-text">
          Organizar juntas públicas
        </h2>
        <Card className="mt-4">
          <CardContent>
            <div className="flex items-start gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-[#f7e6d5]">
                <UsersThree
                  size={26}
                  weight="duotone"
                  color="#BF312A"
                  aria-hidden="true"
                />
              </span>
              <div>
                <h3 className="text-h3 font-semibold text-minka-text">
                  Se gana con juntas terminadas, no con puntos
                </h3>
                <p className="mt-2 text-body text-minka-text">
                  Para abrir una junta donde pueda entrar gente que no conoces,
                  necesitas haber terminado 2 juntas como organizador.
                </p>
                <p className="mt-3 flex items-center gap-2 text-body font-semibold">
                  {puedePublica ? (
                    <>
                      <CheckCircle
                        size={22}
                        weight="fill"
                        color="#4B6B3A"
                        aria-hidden="true"
                      />
                      <span className="text-minka-success">
                        Ya puedes organizar juntas públicas
                      </span>
                    </>
                  ) : (
                    <span className="text-minka-text">
                      Llevas {usuario.juntasCompletadas} de 2. Te{" "}
                      {faltanJuntas === 1 ? "falta 1 junta" : `faltan ${faltanJuntas} juntas`}.
                    </span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <p className="rounded-lg border-2 border-minka-primary bg-[#f9ece9] p-5 text-body text-minka-text">
        <strong className="font-semibold">Nada de esto se compra.</strong> Ningún plan
        pagado sube tu nivel ni te habilita juntas públicas. Se ganan cumpliendo, y por
        eso valen.
      </p>
    </div>
  );
}
