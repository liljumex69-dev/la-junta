"use client";

import Link from "next/link";
// Iconografía: nada de candados ni escudos. El sistema de diseño lo prohíbe
// explícitamente — la protección aquí viene del grupo y del contrato, no de un
// símbolo de seguridad corporativa. Por eso la garantía usa monedas y el fondo
// colectivo usa manos que sostienen.
import {
  ArrowRight,
  CaretLeft,
  Coins,
  HandCoins,
  HandHeart,
  Info,
  UsersThree,
} from "@phosphor-icons/react/ssr";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ETIQUETA_FRECUENCIA, soles, turnoOrdinal } from "@/lib/minka/format";
import {
  calcularAporteDelCiclo,
  calcularGarantia,
  calcularPozo,
  participanteDelTurno,
  progresoDelCiclo,
} from "@/lib/minka/rules";
import { claveCiclo, useEstadoPrototipo } from "@/lib/minka/prototipo-estado";
import type { EstadoPagoCuota, Junta, Participante } from "@/lib/minka/types";

const ETIQUETA_ESTADO: Record<
  EstadoPagoCuota,
  { texto: string; variante: "success" | "late" | "danger" | "muted" }
> = {
  pagado: { texto: "Ya aportó", variante: "success" },
  tarde: { texto: "Aportó tarde", variante: "late" },
  pendiente: { texto: "Falta", variante: "muted" },
  incumplido: { texto: "No pagó", variante: "danger" },
  fuerza_mayor: { texto: "Fuerza mayor", variante: "late" },
};

/**
 * Panel de mi junta.
 *
 * Ninguna parte de esta pantalla sugiere que el organizador tenga control especial
 * sobre el dinero una vez la junta arrancó: aparece como un participante más, y la
 * nota de custodia lo dice de forma explícita.
 */
export function PanelJunta({
  junta,
  yo,
}: {
  junta: Junta;
  yo: Participante;
}) {
  const { tiene, listo } = useEstadoPrototipo();

  const clave = claveCiclo(junta.id, junta.cicloActual);
  const yaAporteGuardado = tiene("aportado", clave);
  const yaCobreGuardado = tiene("cobrado", clave);

  const yaAporte =
    yo.estadoPago === "pagado" || yo.estadoPago === "tarde" || yaAporteGuardado;
  const meTocaCobrar = junta.cicloActual === yo.turno && !yaCobreGuardado;

  const progresoBase = progresoDelCiclo(junta);
  const progreso = {
    ...progresoBase,
    aportaron: progresoBase.aportaron + (yaAporteGuardado ? 1 : 0),
    faltan: progresoBase.faltan - (yaAporteGuardado ? 1 : 0),
  };

  const pozo = calcularPozo(junta);
  const aporte = calcularAporteDelCiclo(junta, yo);
  const quienCobra = participanteDelTurno(junta);
  const miGarantia = calcularGarantia(
    yo.turno,
    junta.totalParticipantes,
    junta.cuota,
    yo.score,
    junta.modo
  );
  const garantiaBloqueada = tiene("garantiaBloqueada", junta.id);

  return (
    <div className="space-y-6">
      <Link
        href="/inicio"
        className="touch-target -ml-3 flex w-fit items-center gap-1 rounded-md pr-3 text-body font-semibold text-minka-text transition-colors hover:bg-[#ece4d8]"
      >
        <CaretLeft size={22} weight="bold" aria-hidden="true" />
        Mis juntas
      </Link>

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-display font-semibold text-minka-text">
            {junta.nombre}
          </h1>
          {junta.modo === "protegido" ? (
            <Badge variant="outline">Protegida</Badge>
          ) : (
            <Badge variant="muted">Tradicional</Badge>
          )}
        </div>
        <p className="mt-2 text-body text-minka-muted">
          {soles(junta.cuota)} ·{" "}
          {ETIQUETA_FRECUENCIA[junta.frecuencia].toLowerCase()} ·{" "}
          {junta.totalParticipantes} personas · ciclo {junta.cicloActual} de{" "}
          {junta.totalParticipantes}
        </p>
      </div>

      {/* Lo que le toca hacer ahora — la razón por la que abrió la app */}
      <Card
        className={
          meTocaCobrar
            ? "border-2 border-minka-success"
            : !yaAporte
              ? "border-2 border-minka-secondary"
              : undefined
        }
      >
        <CardContent>
          {meTocaCobrar ? (
            <>
              <p className="flex items-center gap-2 text-h3 font-semibold text-minka-success">
                <HandCoins size={28} weight="fill" aria-hidden="true" />
                Te toca cobrar
              </p>
              <p className="mt-2 text-[32px] font-semibold text-minka-text">
                {soles(pozo)}
              </p>
              <p className="mt-1 text-body text-minka-muted">
                El pozo completo, sin descuentos ni retenciones.
              </p>
              <Button asChild size="lg" className="mt-5 w-full">
                <Link href={`/junta/${junta.id}/cobrar`}>
                  Cobrar mi turno
                  <ArrowRight size={22} weight="bold" />
                </Link>
              </Button>
            </>
          ) : !yaAporte ? (
            <>
              <p className="text-h3 font-semibold text-minka-text">
                Te toca aportar
              </p>
              <p className="mt-2 text-[32px] font-semibold text-minka-text">
                {soles(aporte.total)}
              </p>
              <p className="mt-1 text-body text-minka-muted">
                {aporte.prima > 0
                  ? `${soles(aporte.cuota)} de cuota + ${soles(aporte.prima)} de prima por tu turno temprano`
                  : "Tu cuota de este ciclo"}{" "}
                · vence el {junta.proximoPago}
              </p>
              <Button asChild size="lg" className="mt-5 w-full">
                <Link href={`/junta/${junta.id}/aportar`}>
                  Aportar mi cuota
                  <ArrowRight size={22} weight="bold" />
                </Link>
              </Button>
            </>
          ) : (
            <>
              <p className="text-h3 font-semibold text-minka-success">
                Ya aportaste este ciclo
              </p>
              <p className="mt-2 text-body text-minka-text">
                Tu turno es el {turnoOrdinal(yo.turno)} de{" "}
                {junta.totalParticipantes}. Cuando llegue, vas a recibir{" "}
                {soles(pozo)}.
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Estado del ciclo: quién ya aportó y quién falta */}
      <section>
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-h2 font-semibold text-minka-text">
            Este ciclo
          </h2>
          <span className="text-body text-minka-muted">
            {listo ? progreso.aportaron : progresoBase.aportaron} de{" "}
            {progreso.total} aportaron
          </span>
        </div>

        <ul className="mt-4 divide-y divide-minka-border overflow-hidden rounded-lg border border-minka-border bg-minka-surface">
          {[...junta.participantes]
            .sort((a, b) => a.turno - b.turno)
            .map((p) => {
              const soyYo = p.id === yo.id;
              const estado: EstadoPagoCuota =
                soyYo && yaAporteGuardado ? "pagado" : p.estadoPago;
              const info = ETIQUETA_ESTADO[estado];
              const cobraAhora = p.turno === junta.cicloActual;

              return (
                <li
                  key={p.id}
                  className="flex items-center gap-3 p-4"
                >
                  <span
                    className={
                      "grid size-11 shrink-0 place-items-center rounded-full text-support font-semibold " +
                      (soyYo
                        ? "bg-minka-primary text-white"
                        : "bg-[#ece4d8] text-minka-text")
                    }
                    aria-hidden="true"
                  >
                    {p.iniciales}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-body font-semibold text-minka-text">
                      {soyYo ? "Tú" : p.nombre}
                    </span>
                    <span className="block text-support text-minka-muted">
                      Turno {turnoOrdinal(p.turno)}
                      {cobraAhora ? " · cobra este ciclo" : ""}
                      {p.avaladoPor ? ` · avalado por ${p.avaladoPor}` : ""}
                    </span>
                  </span>

                  <Badge variant={info.variante}>{info.texto}</Badge>
                </li>
              );
            })}
        </ul>
      </section>

      {/* Próximo turno */}
      {quienCobra ? (
        <Card>
          <CardContent className="flex items-center gap-3">
            <UsersThree
              size={30}
              weight="duotone"
              color="#BF312A"
              className="shrink-0"
              aria-hidden="true"
            />
            <p className="text-body text-minka-text">
              Este ciclo cobra{" "}
              <strong className="font-semibold">
                {quienCobra.id === yo.id ? "tú" : quienCobra.nombre}
              </strong>
              . El siguiente turno es el{" "}
              {turnoOrdinal(Math.min(junta.cicloActual + 1, junta.totalParticipantes))}
              .
            </p>
          </CardContent>
        </Card>
      ) : null}

      {/* Garantía propia (solo modo protegido) */}
      {junta.modo === "protegido" && miGarantia > 0 ? (
        <Card>
          <CardContent>
            <h2 className="flex items-center gap-2 text-h3 font-semibold text-minka-text">
              <Coins
                size={24}
                weight="duotone"
                color="#BF312A"
                aria-hidden="true"
              />
              Tu garantía
            </h2>
            <p className="mt-2 text-body text-minka-text">
              {garantiaBloqueada ? (
                <>
                  Tienes{" "}
                  <strong className="font-semibold">{soles(miGarantia)}</strong>{" "}
                  bloqueados. Se te devuelven completos cuando termines de pagar
                  todas tus cuotas.
                </>
              ) : (
                <>
                  Para cobrar tu turno vas a necesitar{" "}
                  <strong className="font-semibold">{soles(miGarantia)}</strong>{" "}
                  bloqueados. Baja según tu historial: mientras mejor cumples,
                  menos te piden.
                </>
              )}
            </p>
          </CardContent>
        </Card>
      ) : null}

      {/* Fondo de seguro colectivo — transparencia */}
      {junta.modo === "protegido" ? (
        <Card>
          <CardContent>
            <h2 className="flex items-center gap-2 text-h3 font-semibold text-minka-text">
              <HandHeart
                size={24}
                weight="duotone"
                color="#4B6B3A"
                aria-hidden="true"
              />
              Fondo del grupo
            </h2>
            <p className="mt-2 text-[24px] font-semibold text-minka-text">
              {soles(junta.fondoSeguro)}
            </p>
            <p className="mt-1 text-body text-minka-muted">
              Se junta con las primas de quienes cobran temprano. Si alguien deja de
              pagar, esto cubre a los demás para que nadie pierda su dinero.
            </p>
          </CardContent>
        </Card>
      ) : null}

      {/* Custodia: nadie controla el dinero, tampoco quien organizó */}
      <p className="flex gap-3 rounded-lg border border-minka-border bg-minka-surface p-4 text-body text-minka-text">
        <Info
          size={24}
          weight="duotone"
          color="#8A7A6D"
          className="shrink-0"
          aria-hidden="true"
        />
        <span>
          El dinero de esta junta no lo guarda ninguna persona. Se mueve solo cuando
          se cumplen las reglas que ustedes fijaron al empezar — ni quien la organizó
          ni Minka pueden tocarlo.
        </span>
      </p>
    </div>
  );
}
