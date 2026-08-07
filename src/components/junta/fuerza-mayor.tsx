"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CaretLeft,
  CheckCircle,
  Clock,
  ThumbsDown,
  ThumbsUp,
  UsersThree,
} from "@phosphor-icons/react/ssr";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OpcionRadio } from "@/components/minka/opcion-radio";
import { Spinner } from "@/components/minka/spinner";
import type { Junta } from "@/lib/minka/types";

interface SolicitudFM {
  id: string;
  solicitanteNombre: string;
  solicitanteIniciales: string;
  motivo: string;
  detalle: string;
  diasRestantes: number;
  votosAFavor: number;
  votosEnContra: number;
  totalVotantes: number;
  yaVote: boolean;
}

const MOTIVOS = [
  {
    valor: "salud",
    titulo: "Enfermedad o emergencia de salud",
    descripcion: "Tuya o de alguien de tu familia directa.",
  },
  {
    valor: "trabajo",
    titulo: "Perdí mi trabajo o mi puesto",
    descripcion: "Se cortó tu fuente de ingreso de un momento a otro.",
  },
  {
    valor: "desastre",
    titulo: "Robo, incendio o desastre",
    descripcion: "Algo que se llevó tu mercadería, tu local o tus ahorros.",
  },
  {
    valor: "otro",
    titulo: "Otra razón",
    descripcion: "Explícale al grupo qué pasó, con tus palabras.",
  },
];

/**
 * Reportar fuerza mayor y votar las solicitudes de otros.
 *
 * Deciden los participantes de la junta, no Minka: son ellos los que se conocen y los
 * que ponen el dinero. El producto solo abre la ventana de 7 días, ordena la votación
 * y aplica el resultado.
 *
 * El tono de toda la pantalla evita el registro de "trámite": alguien que llega aquí
 * ya está pasando por un mal momento.
 */
export function FuerzaMayor({
  junta,
  solicitudes,
}: {
  junta: Junta;
  solicitudes: SolicitudFM[];
}) {
  const [motivo, setMotivo] = useState<string | null>(null);
  const [detalle, setDetalle] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [votadas, setVotadas] = useState<Record<string, "si" | "no">>({});

  async function enviar() {
    if (enviando || !motivo) return;
    setEnviando(true);

    // TODO: conectar a smart contract — abrir la solicitud de fuerza mayor on-chain
    // dentro de la ventana de 7 días y notificar a los demás participantes para que voten.
    await new Promise((r) => setTimeout(r, 1100));
    setEnviando(false);
    setEnviado(true);
  }

  function votar(id: string, voto: "si" | "no") {
    // TODO: conectar a smart contract — registrar el voto del participante. Cuando se
    // alcanza la mayoría, el contrato aplica el resultado automáticamente: penalidad
    // leve y pago diferido si se acepta, tratamiento normal de incumplimiento si no.
    setVotadas((v) => ({ ...v, [id]: voto }));
    toast.success(voto === "si" ? "Votaste que sí se acepte" : "Votaste que no");
  }

  return (
    <div className="space-y-8">
      <Link
        href={`/junta/${junta.id}`}
        className="touch-target -ml-3 flex w-fit items-center gap-1 rounded-md pr-3 text-body font-semibold text-minka-text transition-colors hover:bg-[#ece4d8]"
      >
        <CaretLeft size={22} weight="bold" aria-hidden="true" />
        Volver a la junta
      </Link>

      {/* Solicitudes de otros esperando mi voto */}
      {solicitudes.length > 0 ? (
        <section>
          <h1 className="text-display font-semibold text-minka-text">
            Tu grupo necesita tu voto
          </h1>
          <p className="mt-2 text-body text-minka-muted">
            Alguien de “{junta.nombre}” no pudo pagar y pide que se tome como fuerza
            mayor. Ustedes deciden, no Minka.
          </p>

          <div className="mt-5 space-y-4">
            {solicitudes.map((s) => {
              const miVoto = votadas[s.id];
              return (
                <Card key={s.id}>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <span
                        className="grid size-12 shrink-0 place-items-center rounded-full bg-[#ece4d8] text-body font-semibold text-minka-text"
                        aria-hidden="true"
                      >
                        {s.solicitanteIniciales}
                      </span>
                      <div className="min-w-0">
                        <p className="text-h3 font-semibold text-minka-text">
                          {s.solicitanteNombre}
                        </p>
                        <p className="text-support text-minka-muted">{s.motivo}</p>
                      </div>
                    </div>

                    <p className="mt-4 rounded-md bg-minka-bg p-4 text-body text-minka-text">
                      “{s.detalle}”
                    </p>

                    <p className="mt-4 flex items-center gap-2 text-support text-minka-muted">
                      <Clock size={20} weight="duotone" aria-hidden="true" />
                      Quedan {s.diasRestantes} días para votar · {s.votosAFavor} a
                      favor, {s.votosEnContra} en contra de {s.totalVotantes}{" "}
                      personas
                    </p>

                    {miVoto ? (
                      <p className="mt-4 flex items-center gap-2 text-body font-semibold text-minka-success">
                        <CheckCircle size={22} weight="fill" aria-hidden="true" />
                        Ya votaste que {miVoto === "si" ? "sí" : "no"}
                      </p>
                    ) : (
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <Button
                          size="lg"
                          onClick={() => votar(s.id, "si")}
                        >
                          <ThumbsUp size={22} weight="fill" aria-hidden="true" />
                          Sí, acepto
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          onClick={() => votar(s.id, "no")}
                        >
                          <ThumbsDown size={22} weight="fill" aria-hidden="true" />
                          No
                        </Button>
                      </div>
                    )}

                    <p className="mt-4 text-support text-minka-muted">
                      Si el grupo acepta: se le aplica una penalidad leve y puede
                      pagar más adelante. Si no: se trata como un incumplimiento
                      normal y la garantía cubre al grupo.
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* Reportar mi propia fuerza mayor */}
      <section>
        {enviado ? (
          <div
            className="flex flex-col items-center py-10 text-center"
            role="status"
          >
            <span className="grid size-20 place-items-center rounded-full bg-[#e6ecdf]">
              <CheckCircle
                size={52}
                weight="fill"
                color="#4B6B3A"
                aria-hidden="true"
              />
            </span>
            <h2 className="mt-5 text-h2 font-semibold text-minka-text">
              Tu grupo ya lo sabe
            </h2>
            <p className="mt-3 max-w-sm text-body text-minka-muted">
              Las otras {junta.totalParticipantes - 1} personas de la junta tienen 7
              días para votar. Te avisamos por WhatsApp apenas decidan.
            </p>
            <p className="mt-3 max-w-sm text-body text-minka-muted">
              Mientras tanto no se te aplica ninguna penalidad.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-h2 font-semibold text-minka-text">
              ¿No pudiste pagar?
            </h2>
            <p className="mt-2 text-body text-minka-muted">
              Si te pasó algo grave, cuéntaselo al grupo dentro de los 7 días
              siguientes. Ellos votan si lo toman como fuerza mayor.
            </p>

            <div className="mt-5 space-y-3">
              {MOTIVOS.map((m) => (
                <OpcionRadio
                  key={m.valor}
                  name="motivo-fm"
                  seleccionado={motivo === m.valor}
                  onSelect={() => setMotivo(m.valor)}
                  titulo={m.titulo}
                  descripcion={m.descripcion}
                />
              ))}
            </div>

            <div className="mt-5">
              <Label htmlFor="detalle-fm" className="text-body font-semibold">
                Cuéntales qué pasó
              </Label>
              <Textarea
                id="detalle-fm"
                rows={4}
                className="mt-2 min-h-28 rounded-md border-2 border-minka-border bg-minka-surface p-4 text-body"
                placeholder="Con tus palabras. Lo van a leer las personas de tu junta."
                value={detalle}
                onChange={(e) => setDetalle(e.target.value)}
              />
            </div>

            <p className="mt-4 flex gap-3 rounded-lg border border-minka-border bg-minka-surface p-4 text-body text-minka-text">
              <UsersThree
                size={24}
                weight="duotone"
                color="#BF312A"
                className="shrink-0"
                aria-hidden="true"
              />
              <span>
                Si el grupo acepta, tu historial baja poco y puedes ponerte al día
                más adelante. Si no acepta, se trata como un incumplimiento normal.
              </span>
            </p>

            <Button
              size="lg"
              className="mt-5 w-full"
              onClick={enviar}
              disabled={!motivo || detalle.trim().length < 10 || enviando}
            >
              {enviando ? (
                <>
                  <Spinner />
                  Avisando a tu grupo…
                </>
              ) : (
                "Pedir que se tome como fuerza mayor"
              )}
            </Button>
          </>
        )}
      </section>
    </div>
  );
}
