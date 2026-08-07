"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CaretLeft,
  CheckCircle,
  HandHeart,
  Warning,
} from "@phosphor-icons/react/ssr";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/minka/spinner";
import { soles, turnoOrdinal } from "@/lib/minka/format";
import { ETIQUETA_NIVEL, nivelDeConfianza } from "@/lib/minka/rules";
import { useEstadoPrototipo } from "@/lib/minka/prototipo-estado";
import type { Junta, Participante } from "@/lib/minka/types";

interface PosibleAval {
  id: string;
  nombre: string;
  iniciales: string;
  score: number;
  juntasJuntos: number;
  disponible: boolean;
}

/**
 * Solicitar aval.
 *
 * La parte crítica no es elegir a la persona, es que quien pide entienda qué le está
 * pidiendo. Un aval arriesga su propio dinero Y su propio historial. Por eso el riesgo
 * del avalador se explica antes de poder enviar, y hay que reconocerlo con una casilla:
 * el patrón es el mismo que el consentimiento del modo tradicional, porque la gravedad
 * de la decisión también lo es.
 */
export function SolicitarAval({
  junta,
  yo,
  candidatos,
}: {
  junta: Junta;
  yo: Participante;
  candidatos: PosibleAval[];
}) {
  const { marcar } = useEstadoPrototipo();
  const [elegido, setElegido] = useState<string | null>(null);
  const [entiendo, setEntiendo] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const garantia = junta.cuota * (junta.totalParticipantes - yo.turno);
  const persona = candidatos.find((c) => c.id === elegido);

  async function enviar() {
    if (enviando || !persona) return;
    setEnviando(true);

    // TODO: conectar a smart contract — crear la solicitud de aval on-chain y
    // notificar al avalador. El bloqueo de su garantía solo ocurre cuando esa
    // persona acepta; hasta entonces no se toca nada de su dinero.
    await new Promise((r) => setTimeout(r, 1100));

    marcar("avalSolicitado", `${junta.id}:${persona.id}`);
    setEnviando(false);
    setEnviado(true);
  }

  if (enviado && persona) {
    return (
      <div className="flex flex-col items-center py-14 text-center" role="status">
        <span className="grid size-24 place-items-center rounded-full bg-[#e6ecdf]">
          <CheckCircle size={60} weight="fill" color="#4B6B3A" aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-h2 font-semibold text-minka-text">
          Le avisamos a {persona.nombre.split(" ")[0]}
        </h1>
        <p className="mt-3 max-w-sm text-body text-minka-muted">
          Le llega la solicitud por WhatsApp. Puede aceptar o rechazar, y hasta que
          acepte no se le bloquea nada de su dinero. Te avisamos apenas responda.
        </p>
        <Button asChild size="lg" className="mt-7">
          <Link href={`/junta/${junta.id}`}>Volver a la junta</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href={`/junta/${junta.id}/cobrar`}
        className="touch-target -ml-3 flex w-fit items-center gap-1 rounded-md pr-3 text-body font-semibold text-minka-text transition-colors hover:bg-[#ece4d8]"
      >
        <CaretLeft size={22} weight="bold" aria-hidden="true" />
        Volver
      </Link>

      <div>
        <h1 className="text-display font-semibold text-minka-text">
          Pedir un aval
        </h1>
        <p className="mt-2 text-body text-minka-muted">
          Alguien con buen historial puede respaldarte para que cobres tu turno{" "}
          {turnoOrdinal(yo.turno)} sin poner toda la garantía tú.
        </p>
      </div>

      <section>
        <h2 className="text-h2 font-semibold text-minka-text">
          ¿Quién te puede avalar?
        </h2>
        <p className="mt-1 text-body text-minka-muted">
          Personas con buen historial en tus juntas.
        </p>

        <ul className="mt-4 space-y-3">
          {candidatos.map((c) => {
            const nivel = nivelDeConfianza(c.score);
            const seleccionado = elegido === c.id;

            return (
              <li key={c.id}>
                <label
                  className={
                    "flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-colors " +
                    (!c.disponible
                      ? "cursor-not-allowed border-minka-border bg-minka-surface opacity-60"
                      : seleccionado
                        ? "border-minka-primary bg-[#f9ece9]"
                        : "border-minka-border bg-minka-surface hover:border-minka-muted")
                  }
                >
                  <input
                    type="radio"
                    name="aval"
                    className="sr-only"
                    checked={seleccionado}
                    disabled={!c.disponible}
                    onChange={() => setElegido(c.id)}
                  />
                  <span
                    className={
                      "grid size-12 shrink-0 place-items-center rounded-full text-body font-semibold " +
                      (seleccionado
                        ? "bg-minka-primary text-white"
                        : "bg-[#ece4d8] text-minka-text")
                    }
                    aria-hidden="true"
                  >
                    {c.iniciales}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-body font-semibold text-minka-text">
                      {c.nombre}
                    </span>
                    <span className="block text-support text-minka-muted">
                      {ETIQUETA_NIVEL[nivel]} · {c.score} de 100 ·{" "}
                      {c.juntasJuntos}{" "}
                      {c.juntasJuntos === 1 ? "junta juntos" : "juntas juntos"}
                    </span>
                    {!c.disponible ? (
                      <span className="mt-1 block text-support font-semibold text-minka-danger">
                        Su historial todavía no alcanza para avalar a otra persona
                      </span>
                    ) : null}
                  </span>

                  {seleccionado ? <Badge variant="default">Elegido</Badge> : null}
                </label>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Qué arriesga el avalador — antes de poder enviar, no después */}
      <div className="rounded-lg border-2 border-minka-secondary bg-[#fbeed8] p-5">
        <h2 className="flex items-center gap-2 text-h3 font-semibold text-minka-text">
          <Warning size={26} weight="fill" color="#E38E20" aria-hidden="true" />
          Lo que le estás pidiendo
        </h2>

        <ul className="mt-3 space-y-3 text-body text-minka-text">
          <li>
            Va a bloquear{" "}
            <strong className="font-semibold">{soles(garantia)}</strong> de su propio
            dinero hasta que tú termines de aportar todas tus cuotas.
          </li>
          <li>
            Si tú dejas de pagar, ese dinero se usa para cubrir al grupo y{" "}
            <strong className="font-semibold">esa persona lo pierde</strong>.
          </li>
          <li>
            Además, <strong className="font-semibold">su historial también baja</strong>,
            no solo el tuyo. Está poniendo su reputación por ti.
          </li>
        </ul>

        <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-md bg-minka-surface p-4">
          <Checkbox
            checked={entiendo}
            onCheckedChange={(v) => setEntiendo(v === true)}
            className="mt-0.5 size-6"
            aria-describedby="texto-riesgo-aval"
          />
          <span
            id="texto-riesgo-aval"
            className="text-body font-semibold text-minka-text"
          >
            Entiendo que si no pago, quien me avala pierde su dinero y su historial
            baja.
          </span>
        </label>
      </div>

      <Button
        size="lg"
        className="w-full"
        onClick={enviar}
        disabled={!persona || !entiendo || enviando}
      >
        {enviando ? (
          <>
            <Spinner />
            Enviando tu solicitud…
          </>
        ) : (
          <>
            <HandHeart size={22} weight="fill" aria-hidden="true" />
            {persona
              ? `Pedirle a ${persona.nombre.split(" ")[0]}`
              : "Elige a quién pedirle"}
          </>
        )}
      </Button>
    </div>
  );
}
