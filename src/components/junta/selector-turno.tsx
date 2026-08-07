"use client";

import { Info, Lightning, Warning } from "@phosphor-icons/react/ssr";

import { Badge } from "@/components/ui/badge";
import { soles, turnoOrdinal } from "@/lib/minka/format";
import { calcularGarantia, calcularPrima } from "@/lib/minka/rules";
import { cn } from "@/lib/utils";
import type { Junta } from "@/lib/minka/types";

/**
 * Elección de turno al entrar a una junta.
 *
 * Faltaba dejar ver que el turno no es un detalle administrativo: define cuánto vas
 * a pagar de prima y cuánta garantía te van a exigir. Aquí se muestran las dos cifras
 * en cada turno, para que la decisión se tome con la información a la vista.
 *
 * Cómo se resuelve la tensión con el sorteo (decisión de diseño, no estaba en los
 * documentos): en juntas de turnos acordados eliges tu posición directamente; en
 * juntas por sorteo el orden se sortea igual —cambiarlo sería injusto entre
 * desconocidos—, pero puedes PEDIRLE al organizador una posición temprana. Es una
 * solicitud, no una reserva, y la pantalla lo dice con esas palabras.
 *
 * Un turno cuya garantía supera tu saldo no se bloquea: se marca como "necesitas
 * aval" y se deja elegir, porque pedir un aval es justamente la salida prevista.
 */
export function SelectorTurno({
  junta,
  score,
  saldoDisponible,
  turnoElegido,
  onElegir,
}: {
  junta: Junta;
  score: number;
  saldoDisponible: number;
  turnoElegido: number | null;
  onElegir: (turno: number) => void;
}) {
  const ocupados = new Set(junta.participantes.map((p) => p.turno));
  const esSorteo = junta.asignacionTurnos === "sorteo";

  return (
    <div>
      <h3 className="text-h3 font-semibold text-minka-text">
        {esSorteo ? "¿Prefieres algún turno?" : "Elige tu turno"}
      </h3>
      <p className="mt-1 text-body text-minka-muted">
        {esSorteo
          ? "El orden se sortea cuando el grupo esté completo. Si te urge cobrar temprano, puedes pedirle una posición al organizador."
          : "Mientras más temprano cobras, más prima pagas y más garantía te piden."}
      </p>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {Array.from({ length: junta.totalParticipantes }, (_, i) => i + 1).map(
          (turno) => {
            const ocupado = ocupados.has(turno);
            const prima = calcularPrima(
              turno,
              junta.totalParticipantes,
              junta.cuota,
              junta.modo
            );
            const garantia = calcularGarantia(
              turno,
              junta.totalParticipantes,
              junta.cuota,
              score,
              junta.modo
            );
            const necesitaAval = garantia > saldoDisponible;
            const seleccionado = turnoElegido === turno;

            return (
              <li key={turno}>
                <button
                  type="button"
                  disabled={ocupado}
                  onClick={() => onElegir(turno)}
                  aria-pressed={seleccionado}
                  className={cn(
                    "flex w-full min-h-[68px] flex-col items-start justify-center gap-1 rounded-lg border-2 px-4 py-3 text-left transition-colors",
                    ocupado
                      ? "cursor-not-allowed border-minka-border bg-[#ece4d8] opacity-70"
                      : seleccionado
                        ? "border-minka-primary bg-[#f9ece9]"
                        : "border-minka-border bg-minka-surface hover:border-minka-muted"
                  )}
                >
                  <span className="flex w-full items-center justify-between gap-2">
                    <span className="text-body font-semibold text-minka-text">
                      Turno {turnoOrdinal(turno)}
                    </span>
                    {ocupado ? (
                      <Badge variant="muted">Ocupado</Badge>
                    ) : necesitaAval ? (
                      <Badge variant="late">Necesitas aval</Badge>
                    ) : turno === junta.totalParticipantes ? (
                      <Badge variant="success">Sin prima</Badge>
                    ) : null}
                  </span>

                  {!ocupado ? (
                    <span className="text-support text-minka-muted">
                      {junta.modo === "protegido"
                        ? `Prima ${soles(prima)} · garantía ${soles(garantia)}`
                        : "Sin prima ni garantía"}
                    </span>
                  ) : (
                    <span className="text-support text-minka-muted">
                      Ya lo tomó alguien del grupo
                    </span>
                  )}
                </button>
              </li>
            );
          }
        )}
      </ul>

      {turnoElegido !== null &&
      calcularGarantia(
        turnoElegido,
        junta.totalParticipantes,
        junta.cuota,
        score,
        junta.modo
      ) > saldoDisponible ? (
        <p className="mt-4 flex gap-3 rounded-lg border-2 border-minka-secondary bg-[#fbeed8] p-4 text-body text-minka-text">
          <Warning
            size={24}
            weight="fill"
            color="#E38E20"
            className="shrink-0"
            aria-hidden="true"
          />
          <span>
            Para este turno necesitas más garantía de la que tienes disponible
            ({soles(saldoDisponible)}). Puedes entrar igual y pedir un aval antes de
            cobrar, o elegir un turno más tarde.
          </span>
        </p>
      ) : null}

      {esSorteo ? (
        <p className="mt-4 flex gap-3 rounded-lg border border-minka-border bg-minka-surface p-4 text-body text-minka-text">
          <Info
            size={24}
            weight="duotone"
            color="#8A7A6D"
            className="shrink-0"
            aria-hidden="true"
          />
          <span>
            Lo que elijas aquí se le envía al organizador como pedido. Si no lo
            aprueba, entras al sorteo normal con todos los demás.
          </span>
        </p>
      ) : (
        <p className="mt-4 flex gap-3 rounded-lg border border-minka-border bg-minka-surface p-4 text-body text-minka-text">
          <Lightning
            size={24}
            weight="duotone"
            color="#E38E20"
            className="shrink-0"
            aria-hidden="true"
          />
          <span>
            En el último turno no pagas prima y no te piden garantía. Es la opción más
            barata si no tienes apuro.
          </span>
        </p>
      )}
    </div>
  );
}
