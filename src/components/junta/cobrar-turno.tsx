"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CaretLeft,
  CheckCircle,
  Coins,
  HandCoins,
  HandHeart,
  Info,
  Warning,
} from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/minka/spinner";
import { soles, turnoOrdinal } from "@/lib/minka/format";
import {
  ETIQUETA_NIVEL,
  calcularGarantia,
  calcularPozo,
  factorGarantiaPorScore,
  nivelDeConfianza,
} from "@/lib/minka/rules";
import { useSesion } from "@/lib/minka/prototipo/sesion";
import type { Junta, Participante } from "@/lib/minka/types";

/**
 * Cobrar mi turno.
 *
 * Tres caminos posibles, según lo que exija la junta:
 *
 * 1. Modo tradicional, o garantía ya cubierta → confirma y recibe el pozo completo.
 * 2. Modo protegido con dinero suficiente → ve el monto exacto de garantía y de dónde
 *    sale, lo bloquea y cobra.
 * 3. Modo protegido sin garantía ni aval → pantalla de bloqueo. No es un "no" seco:
 *    ofrece las dos salidas reales, pedir un aval o esperar un turno más tarde.
 */
export function CobrarTurno({
  junta,
  yo,
  saldoDisponible,
}: {
  junta: Junta;
  yo: Participante;
  saldoDisponible: number;
}) {
  const router = useRouter();
  const { cobrarTurno } = useSesion();
  const [procesando, setProcesando] = useState(false);
  const [cobrado, setCobrado] = useState(false);

  const pozo = calcularPozo(junta);
  const garantiaRequerida = calcularGarantia(
    yo.turno,
    junta.totalParticipantes,
    junta.cuota,
    yo.score,
    junta.modo
  );
  const yaTieneGarantia = yo.yaCobro;
  const nivel = nivelDeConfianza(yo.score);

  const necesitaGarantia = junta.modo === "protegido" && garantiaRequerida > 0;
  const cubierta = !necesitaGarantia || yaTieneGarantia;
  const alcanzaElSaldo = saldoDisponible >= garantiaRequerida;
  const falta = Math.max(0, garantiaRequerida - saldoDisponible);

  async function cobrar() {
    if (procesando) return;
    setProcesando(true);

    // TODO: conectar a smart contract — si aún no está bloqueada, bloquear la garantía
    // del participante y luego liberar el pozo completo del ciclo a su favor. El
    // contrato debe verificar la garantía antes de transferir; la interfaz solo refleja
    // esa decisión, nunca la toma.
    await new Promise((r) => setTimeout(r, 1300));

    cobrarTurno(junta.id);
    setProcesando(false);
    setCobrado(true);
  }

  useEffect(() => {
    if (!cobrado) return;
    const id = window.setTimeout(() => router.push(`/junta/${junta.id}`), 1800);
    return () => window.clearTimeout(id);
  }, [cobrado, router, junta.id]);

  if (cobrado) {
    return (
      <div
        className="flex flex-col items-center py-14 text-center"
        role="status"
        aria-live="polite"
      >
        <span className="grid size-24 place-items-center rounded-full bg-[#e6ecdf]">
          <CheckCircle size={60} weight="fill" color="#4B6B3A" aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-h2 font-semibold text-minka-text">
          El pozo ya es tuyo
        </h1>
        <p className="mt-2 text-[32px] leading-tight font-semibold text-minka-text">
          {soles(pozo)}
        </p>
        <p className="mt-3 max-w-sm text-body text-minka-muted">
          Completo, sin descuentos ni retenciones. Sigue aportando tus cuotas hasta
          que termine la junta.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href={`/junta/${junta.id}`}
        className="touch-target -ml-3 flex w-fit items-center gap-1 rounded-md pr-3 text-body font-semibold text-minka-text transition-colors hover:bg-[#ece4d8]"
      >
        <CaretLeft size={22} weight="bold" aria-hidden="true" />
        Volver a la junta
      </Link>

      <div>
        <h1 className="text-display font-semibold text-minka-text">
          Cobrar mi turno
        </h1>
        <p className="mt-2 text-body text-minka-muted">
          {junta.nombre} · turno {turnoOrdinal(yo.turno)} de{" "}
          {junta.totalParticipantes}
        </p>
      </div>

      {/* Lo que va a recibir */}
      <Card className="border-2 border-minka-success">
        <CardContent>
          <p className="flex items-center gap-2 text-body font-semibold text-minka-success">
            <HandCoins size={26} weight="fill" aria-hidden="true" />
            Vas a recibir
          </p>
          <p className="mt-2 text-[36px] leading-tight font-semibold text-minka-text">
            {soles(pozo)}
          </p>
          <p className="mt-1 text-body text-minka-muted">
            {junta.totalParticipantes} cuotas de {soles(junta.cuota)}. El pozo va
            completo, sin retenciones.
          </p>
        </CardContent>
      </Card>

      {/* Estado 1: no necesita garantía, o ya la tiene */}
      {cubierta ? (
        <>
          {junta.modo === "tradicional" ? (
            <p className="flex gap-3 rounded-lg border border-minka-border bg-minka-surface p-4 text-body text-minka-text">
              <Info size={24} weight="duotone" color="#8A7A6D" className="shrink-0" aria-hidden="true" />
              <span>
                Esta junta es tradicional: no se pide garantía. Sigue siendo tu
                compromiso aportar todas tus cuotas hasta el final.
              </span>
            </p>
          ) : (
            <p className="flex gap-3 rounded-lg border border-minka-border bg-minka-surface p-4 text-body text-minka-text">
              <Coins size={24} weight="duotone" color="#4B6B3A" className="shrink-0" aria-hidden="true" />
              <span>
                Ya tienes {soles(garantiaRequerida)} bloqueados como garantía. Se te
                devuelven completos cuando termines de aportar todas tus cuotas.
              </span>
            </p>
          )}

          <Button size="lg" className="w-full" onClick={cobrar} disabled={procesando}>
            {procesando ? (
              <>
                <Spinner />
                Liberando tu turno…
              </>
            ) : (
              `Cobrar ${soles(pozo)}`
            )}
          </Button>
        </>
      ) : alcanzaElSaldo ? (
        /* Estado 2: necesita garantía y le alcanza */
        <>
          <Card>
            <CardContent>
              <h2 className="flex items-center gap-2 text-h3 font-semibold text-minka-text">
                <Coins size={24} weight="duotone" color="#BF312A" aria-hidden="true" />
                Antes de cobrar, tu garantía
              </h2>
              <p className="mt-3 text-[28px] leading-tight font-semibold text-minka-text">
                {soles(garantiaRequerida)}
              </p>
              <p className="mt-2 text-body text-minka-text">
                Sale de tu propio dinero disponible ({soles(saldoDisponible)}). Queda
                bloqueada, no se gasta: se te devuelve completa cuando termines de
                aportar tus {junta.totalParticipantes - yo.turno} cuotas que faltan.
              </p>
              <p className="mt-3 text-body text-minka-muted">
                Tu historial ({ETIQUETA_NIVEL[nivel].toLowerCase()}, {yo.score} de
                100) ya te bajó la garantía al{" "}
                {Math.round(factorGarantiaPorScore(yo.score) * 100)}% de lo que te
                faltaría por aportar.
              </p>
            </CardContent>
          </Card>

          <Button size="lg" className="w-full" onClick={cobrar} disabled={procesando}>
            {procesando ? (
              <>
                <Spinner />
                Liberando tu turno…
              </>
            ) : (
              `Bloquear ${soles(garantiaRequerida)} y cobrar`
            )}
          </Button>
        </>
      ) : (
        /* Estado 3: bloqueo, con las dos salidas reales */
        <>
          <Card className="border-2 border-minka-secondary">
            <CardContent>
              <h2 className="flex items-center gap-2 text-h3 font-semibold text-minka-text">
                <Warning size={26} weight="fill" color="#E38E20" aria-hidden="true" />
                Todavía no puedes cobrar este turno
              </h2>
              <p className="mt-3 text-body text-minka-text">
                Para cobrar el {turnoOrdinal(yo.turno)} turno necesitas{" "}
                <strong className="font-semibold">
                  {soles(garantiaRequerida)}
                </strong>{" "}
                de garantía bloqueada. Tienes {soles(saldoDisponible)} disponibles, así
                que te faltan{" "}
                <strong className="font-semibold">{soles(falta)}</strong>.
              </p>
              <p className="mt-3 text-body text-minka-muted">
                La garantía protege a las otras {junta.totalParticipantes - 1}{" "}
                personas: si después de cobrar dejaras de aportar, ese dinero las
                cubre. Por eso es proporcional a las cuotas que aún te faltan.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Button asChild size="lg" className="w-full">
              <Link href={`/junta/${junta.id}/aval`}>
                <HandHeart size={22} weight="fill" aria-hidden="true" />
                Pedir que alguien me avale
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline" className="w-full">
              <Link href={`/junta/${junta.id}`}>Esperar un turno más tarde</Link>
            </Button>
          </div>

          <p className="flex gap-3 rounded-lg border border-minka-border bg-minka-surface p-4 text-body text-minka-text">
            <Info size={24} weight="duotone" color="#8A7A6D" className="shrink-0" aria-hidden="true" />
            <span>
              Si esperas un turno más tarde, la garantía baja sola: mientras menos
              cuotas te falten, menos te piden. En el último turno no se pide nada.
            </span>
          </p>
        </>
      )}
    </div>
  );
}
