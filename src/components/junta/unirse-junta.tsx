"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CaretLeft,
  CheckCircle,
  Info,
  UsersThree,
  Warning,
} from "@phosphor-icons/react/ssr";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/minka/spinner";
import { SelectorTurno } from "@/components/junta/selector-turno";
import { ETIQUETA_FRECUENCIA, soles, turnoOrdinal } from "@/lib/minka/format";
import { calcularGarantia, calcularPrima } from "@/lib/minka/rules";
import { nivelDe } from "@/lib/minka/niveles";
import { SALDO_GARANTIA_DISPONIBLE } from "@/lib/minka/mock-data";
import { useSesion } from "@/lib/minka/prototipo/sesion";
import type { Junta } from "@/lib/minka/types";

/**
 * Unirse a una junta.
 *
 * Tres pasos: encontrar la junta, entender sus reglas, y elegir posición.
 *
 * - Tradicional: consentimiento explícito con casilla. Es la decisión más riesgosa
 *   del producto y tiene que ser consciente.
 * - Protegido: además del score y la garantía, ahora se elige turno — porque el turno
 *   es lo que determina cuánta prima y cuánta garantía te tocan.
 */
export function UnirseJunta({
  codigoInicial,
}: {
  codigoInicial?: string;
}) {
  const { usuario, buscarPorCodigo, unirseAJunta, solicitarTurno } = useSesion();

  const [codigo, setCodigo] = useState(codigoInicial ?? "");
  const [junta, setJunta] = useState<Junta | null>(
    codigoInicial ? (buscarPorCodigo(codigoInicial) ?? null) : null
  );
  const [error, setError] = useState<string | null>(null);
  const [buscando, setBuscando] = useState(false);
  const [acepto, setAcepto] = useState(false);
  const [turno, setTurno] = useState<number | null>(null);
  const [uniendo, setUniendo] = useState(false);
  const [listo, setListo] = useState(false);

  if (!usuario) return null;
  const score = usuario.score;

  async function buscar(e: React.FormEvent) {
    e.preventDefault();
    if (buscando) return;
    setBuscando(true);
    setError(null);

    // TODO: conectar a smart contract — resolver el código contra el contrato y traer
    // las reglas reales de la junta.
    await new Promise((r) => setTimeout(r, 700));

    const encontrada = buscarPorCodigo(codigo);
    if (!encontrada) {
      setError(
        "No encontramos ninguna junta con ese código. Revisa que esté bien escrito."
      );
      setJunta(null);
    } else if (encontrada.participantes.some((p) => p.id === usuario!.id)) {
      setError("Ya estás en esta junta.");
      setJunta(null);
    } else {
      setJunta(encontrada);
    }
    setBuscando(false);
  }

  async function unirse() {
    if (uniendo || !junta) return;
    setUniendo(true);

    await new Promise((r) => setTimeout(r, 1000));

    const esSorteo = junta.asignacionTurnos === "sorteo";
    if (esSorteo && turno !== null) {
      // En sorteo el turno elegido es un pedido al organizador, no una reserva.
      solicitarTurno(junta.id, turno);
      unirseAJunta(junta);
    } else {
      unirseAJunta(junta, turno ?? undefined);
    }

    setUniendo(false);
    setListo(true);
  }

  /* ---------------- Confirmación ---------------- */
  if (listo && junta) {
    const esSorteo = junta.asignacionTurnos === "sorteo";
    return (
      <div className="flex flex-col items-center py-10 text-center" role="status">
        <span className="grid size-20 place-items-center rounded-full bg-[#e6ecdf]">
          <CheckCircle size={52} weight="fill" color="#4B6B3A" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-h2 font-semibold text-minka-text">
          Ya estás en la junta
        </h2>
        <p className="mt-2 max-w-sm text-body text-minka-muted">
          Entraste a “{junta.nombre}”.{" "}
          {esSorteo
            ? turno !== null
              ? `Le pedimos al organizador el turno ${turnoOrdinal(turno)}. Si no lo aprueba, entras al sorteo con todos.`
              : "Los turnos se sortean cuando el grupo esté completo."
            : turno !== null
              ? `Tu turno es el ${turnoOrdinal(turno)}.`
              : "Ya tienes tu turno asignado."}
        </p>
        <p className="mt-3 max-w-sm text-body text-minka-muted">
          Te avisamos por WhatsApp cuando el grupo esté completo.
        </p>
        <div className="mt-7 flex w-full max-w-xs flex-col gap-3">
          <Button asChild size="lg">
            <Link href={`/junta/${junta.id}`}>Ver la junta</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/inicio">Ir a mis juntas</Link>
          </Button>
        </div>
      </div>
    );
  }

  /* ---------------- Paso 1: buscar por código ---------------- */
  if (!junta) {
    return (
      <form onSubmit={buscar} className="space-y-6">
        <div>
          <Label htmlFor="codigo" className="text-body font-semibold">
            Código de la junta
          </Label>
          <Input
            id="codigo"
            className="mt-2 text-h3 font-semibold tracking-widest uppercase"
            placeholder="PANADEROS"
            autoCapitalize="characters"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
            aria-describedby="ayuda-codigo"
            aria-invalid={error ? true : undefined}
          />
          <p id="ayuda-codigo" className="mt-2 text-support text-minka-muted">
            Te lo comparte quien organiza la junta, por WhatsApp o en persona.
          </p>
          {error ? (
            <p className="mt-3 flex gap-2 text-body font-semibold text-minka-danger">
              <Warning size={22} weight="fill" className="shrink-0" aria-hidden="true" />
              {error}
            </p>
          ) : null}
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={codigo.trim().length < 4 || buscando}
        >
          {buscando ? (
            <>
              <Spinner />
              Buscando la junta…
            </>
          ) : (
            "Buscar junta"
          )}
        </Button>

        <p className="rounded-lg border border-minka-border bg-minka-surface p-4 text-support text-minka-muted">
          Para probar el prototipo: <strong>PANADEROS</strong> es una junta protegida
          por sorteo y <strong>TIALUCHA</strong> es tradicional con turnos acordados.
        </p>
      </form>
    );
  }

  /* ---------------- Paso 2: reglas + turno ---------------- */
  const primaPrimerTurno = calcularPrima(
    1,
    junta.totalParticipantes,
    junta.cuota,
    junta.modo
  );
  const garantiaPrimerTurno = calcularGarantia(
    1,
    junta.totalParticipantes,
    junta.cuota,
    score,
    junta.modo
  );
  const nivel = nivelDe(score);
  const faltan = junta.totalParticipantes - junta.participantes.length;
  const puedeConfirmar = junta.modo === "tradicional" ? acepto : true;

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => {
          setJunta(null);
          setAcepto(false);
          setTurno(null);
        }}
        className="touch-target -ml-3 flex items-center gap-1 rounded-md pr-3 text-body font-semibold text-minka-text transition-colors hover:bg-[#ece4d8]"
      >
        <CaretLeft size={22} weight="bold" aria-hidden="true" />
        Usar otro código
      </button>

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-h2 font-semibold text-minka-text">{junta.nombre}</h2>
          {junta.modo === "protegido" ? (
            <Badge variant="outline">Protegida</Badge>
          ) : (
            <Badge variant="muted">Tradicional</Badge>
          )}
          {junta.visibilidad === "publica" ? (
            <Badge variant="secondary">Pública</Badge>
          ) : null}
        </div>
        <p className="mt-2 flex items-center gap-2 text-body text-minka-muted">
          <UsersThree size={22} weight="duotone" aria-hidden="true" />
          {junta.participantes.length} de {junta.totalParticipantes} personas —
          faltan {faltan}
        </p>
      </div>

      <div>
        <h3 className="text-h3 font-semibold text-minka-text">
          Las reglas de esta junta
        </h3>
        <p className="mt-1 text-support text-minka-muted">
          Las fijó quien la organizó. Ya no se pueden cambiar.
        </p>
        <dl className="mt-3 divide-y divide-minka-border rounded-lg border border-minka-border bg-minka-surface">
          {[
            ["Cuota", `${soles(junta.cuota)} · ${ETIQUETA_FRECUENCIA[junta.frecuencia].toLowerCase()}`],
            ["Personas", `${junta.totalParticipantes} personas, ${junta.totalParticipantes} turnos`],
            ["Recibes en tu turno", soles(junta.cuota * junta.totalParticipantes)],
            ["Turnos", junta.asignacionTurnos === "sorteo" ? "Por sorteo, cuando se complete el grupo" : "Acordados por el grupo"],
            ["Protección", junta.modo === "protegido" ? "Con garantía y prima" : "Sin garantía ni prima"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 p-4">
              <dt className="text-body text-minka-muted">{k}</dt>
              <dd className="text-right text-body font-semibold text-minka-text">
                {v}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {junta.modo === "protegido" ? (
        <>
          <div className="rounded-lg border-2 border-minka-border bg-minka-surface p-4">
            <h3 className="text-h3 font-semibold text-minka-text">
              Tu situación en esta junta
            </h3>

            <div className="mt-3 flex items-center justify-between gap-4">
              <span className="text-body text-minka-muted">Tu nivel</span>
              <span
                className="rounded-sm px-2.5 py-1 text-body font-semibold"
                style={{ backgroundColor: nivel.fondo, color: nivel.color }}
              >
                {nivel.nombre} · {score} de 100
              </span>
            </div>

            <div className="mt-4 border-t border-minka-border pt-4">
              <p className="text-body text-minka-text">
                Si tomaras el {turnoOrdinal(1)} turno pagarías una prima de{" "}
                <strong className="font-semibold">{soles(primaPrimerTurno)}</strong> y
                necesitarías{" "}
                <strong className="font-semibold">{soles(garantiaPrimerTurno)}</strong>{" "}
                de garantía. En el último turno no pagas prima ni necesitas garantía.
              </p>
            </div>
          </div>

          <SelectorTurno
            junta={junta}
            score={score}
            saldoDisponible={SALDO_GARANTIA_DISPONIBLE}
            turnoElegido={turno}
            onElegir={setTurno}
          />

          <p className="flex gap-3 rounded-lg border border-minka-border bg-minka-bg p-4 text-body text-minka-text">
            <Info size={24} weight="duotone" color="#BF312A" className="shrink-0" aria-hidden="true" />
            <span>
              Puedes entrar sin elegir turno. Si no eliges, te toca uno de los últimos
              — que es el más barato.
            </span>
          </p>
        </>
      ) : (
        <div className="rounded-lg border-2 border-minka-secondary bg-[#fbeed8] p-5">
          <h3 className="flex items-center gap-2 text-h3 font-semibold text-minka-text">
            <Warning size={26} weight="fill" color="#E38E20" aria-hidden="true" />
            Esta junta no tiene garantía
          </h3>
          <p className="mt-3 text-body text-minka-text">
            Funciona igual que una junta de papel. Si alguien deja de pagar, Minka no
            puede devolverte tu dinero: lo tienen que resolver ustedes entre el grupo.
          </p>
          <p className="mt-3 text-body text-minka-text">
            A cambio, nadie paga prima y el pozo va completo siempre.
          </p>

          <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-md bg-minka-surface p-4">
            <Checkbox
              checked={acepto}
              onCheckedChange={(v) => setAcepto(v === true)}
              className="mt-0.5 size-6"
              aria-labelledby="texto-consentimiento"
            />
            <span
              id="texto-consentimiento"
              className="text-body font-semibold text-minka-text"
            >
              Entiendo que en esta junta no hay garantía y que, si alguien no paga, el
              grupo lo resuelve entre sí.
            </span>
          </label>
        </div>
      )}

      <Button
        size="lg"
        className="w-full"
        onClick={unirse}
        disabled={uniendo || !puedeConfirmar}
      >
        {uniendo ? (
          <>
            <Spinner />
            Uniéndote a la junta…
          </>
        ) : junta.asignacionTurnos === "sorteo" && turno !== null ? (
          `Unirme y pedir el turno ${turnoOrdinal(turno)}`
        ) : turno !== null ? (
          `Unirme con el turno ${turnoOrdinal(turno)}`
        ) : (
          "Unirme a esta junta"
        )}
      </Button>
    </div>
  );
}
