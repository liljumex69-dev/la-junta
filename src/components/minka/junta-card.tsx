import Link from "next/link";
import {
  CaretRight,
  HandCoins,
  Lightning,
  UsersThree,
} from "@phosphor-icons/react/ssr";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ETIQUETA_FRECUENCIA, soles, turnoOrdinal } from "@/lib/minka/format";
import { calcularPozo, progresoDelCiclo } from "@/lib/minka/rules";
import type { Junta, Participante } from "@/lib/minka/types";

/**
 * Tarjeta de junta del panel general.
 *
 * Muestra lo único que importa de un vistazo: cuánto, cuándo, y si al usuario le toca
 * hacer algo ahora. El estado de "te toca cobrar" se resalta porque es la razón por la
 * que la persona abre la app.
 */
export function JuntaCard({
  junta,
  yo,
}: {
  junta: Junta;
  yo: Participante;
}) {
  const enFormacion = junta.estado === "formandose";
  const meTocaCobrar = !enFormacion && junta.cicloActual === yo.turno;
  const yaAporte = yo.estadoPago === "pagado" || yo.estadoPago === "tarde";
  const progreso = progresoDelCiclo(junta);
  const pozo = calcularPozo(junta);
  const faltanPersonas = junta.totalParticipantes - junta.participantes.length;

  return (
    <Card className="transition-shadow hover:shadow-elevated">
      <CardContent>
        <Link
          href={`/junta/${junta.id}`}
          className="flex items-start gap-3 rounded-md"
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-h3 font-semibold text-minka-text">
                {junta.nombre}
              </h3>
              {junta.modo === "protegido" ? (
                <Badge variant="outline">Protegida</Badge>
              ) : (
                <Badge variant="muted">Tradicional</Badge>
              )}
            </div>

            <p className="mt-1 text-body text-minka-muted">
              {soles(junta.cuota)} ·{" "}
              {ETIQUETA_FRECUENCIA[junta.frecuencia].toLowerCase()} ·{" "}
              {junta.totalParticipantes} personas
            </p>
          </div>

          <CaretRight
            size={24}
            weight="bold"
            className="mt-1 shrink-0 text-minka-muted"
            aria-hidden="true"
          />
        </Link>

        {/* Mientras la junta se llena no hay ciclo: lo que importa es cuánta gente
            falta, no cuántos aportaron. */}
        <div className="mt-4 flex items-center gap-2">
          <UsersThree
            size={22}
            weight="duotone"
            color="#8A7A6D"
            aria-hidden="true"
          />
          <span className="text-support text-minka-muted">
            {enFormacion
              ? `${junta.participantes.length} de ${junta.totalParticipantes} personas ya entraron`
              : `${progreso.aportaron} de ${progreso.total} ya aportaron este ciclo`}
          </span>
        </div>
        <div
          className="mt-2 h-2 w-full overflow-hidden rounded-sm bg-[#e9e0d2]"
          role="progressbar"
          aria-valuenow={enFormacion ? junta.participantes.length : progreso.aportaron}
          aria-valuemin={0}
          aria-valuemax={enFormacion ? junta.totalParticipantes : progreso.total}
          aria-label={
            enFormacion
              ? `${junta.participantes.length} de ${junta.totalParticipantes} personas ya entraron`
              : `${progreso.aportaron} de ${progreso.total} participantes ya aportaron`
          }
        >
          <span
            className={
              "block h-full rounded-sm transition-[width] duration-200 " +
              (enFormacion ? "bg-minka-secondary" : "bg-minka-success")
            }
            style={{
              width: `${
                enFormacion
                  ? (junta.participantes.length / junta.totalParticipantes) * 100
                  : (progreso.aportaron / progreso.total) * 100
              }%`,
            }}
          />
        </div>

        {/* Lo que le toca al usuario ahora */}
        <div className="mt-4 rounded-md border border-minka-border bg-minka-bg p-3">
          {enFormacion ? (
            <p className="flex items-center gap-2 text-body text-minka-text">
              <Lightning size={22} weight="duotone" color="#E38E20" aria-hidden="true" />
              {faltanPersonas > 0
                ? `Faltan ${faltanPersonas} ${faltanPersonas === 1 ? "persona" : "personas"} para empezar`
                : "Grupo completo, ya pueden empezar"}
            </p>
          ) : meTocaCobrar ? (
            <p className="flex items-center gap-2 text-body font-semibold text-minka-success">
              <HandCoins size={24} weight="fill" aria-hidden="true" />
              Te toca cobrar {soles(pozo)}
            </p>
          ) : yaAporte ? (
            <p className="flex items-center gap-2 text-body text-minka-text">
              <Lightning size={22} weight="duotone" color="#4B6B3A" aria-hidden="true" />
              Ya aportaste. Tu turno es el {turnoOrdinal(yo.turno)} de{" "}
              {junta.totalParticipantes}.
            </p>
          ) : (
            <p className="flex items-center gap-2 text-body text-minka-text">
              <Lightning size={22} weight="duotone" color="#E38E20" aria-hidden="true" />
              Tu cuota vence el{" "}
              <strong className="font-semibold">{junta.proximoPago}</strong>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
