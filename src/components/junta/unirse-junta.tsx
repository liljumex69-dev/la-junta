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
import { ETIQUETA_FRECUENCIA, soles, turnoOrdinal } from "@/lib/minka/format";
import {
  ETIQUETA_NIVEL,
  calcularGarantia,
  calcularPrima,
  nivelDeConfianza,
} from "@/lib/minka/rules";
import { buscarPorCodigo } from "@/lib/minka/mock-data";
import type { Junta } from "@/lib/minka/types";

/**
 * Unirse a una junta.
 *
 * Muestra las reglas YA FIJADAS por el organizador — el que se une no negocia nada,
 * solo decide si entra. Y según el modo, cambia lo que tiene que entender antes:
 *
 * - Tradicional: pantalla de consentimiento explícito. No basta con un aviso; hay que
 *   marcar una casilla reconociendo que no hay garantía. Es la decisión más riesgosa
 *   que puede tomar en el producto y tiene que ser consciente.
 * - Protegido: ve su propio score y exactamente cuánta garantía necesitaría para
 *   cobrar temprano, para que entienda su situación antes de entrar, no después.
 */
export function UnirseJunta({
  codigoInicial,
  score,
}: {
  codigoInicial?: string;
  score: number;
}) {
  const [codigo, setCodigo] = useState(codigoInicial ?? "");
  const [junta, setJunta] = useState<Junta | null>(
    codigoInicial ? (buscarPorCodigo(codigoInicial) ?? null) : null
  );
  const [error, setError] = useState<string | null>(null);
  const [buscando, setBuscando] = useState(false);
  const [acepto, setAcepto] = useState(false);
  const [uniendo, setUniendo] = useState(false);
  const [listo, setListo] = useState(false);

  async function buscar(e: React.FormEvent) {
    e.preventDefault();
    if (buscando) return;
    setBuscando(true);
    setError(null);

    // TODO: conectar a smart contract — resolver el código contra el contrato y traer
    // las reglas reales de la junta (cuota, frecuencia, turnos, modo, participantes).
    await new Promise((r) => setTimeout(r, 700));

    const encontrada = buscarPorCodigo(codigo);
    if (!encontrada) {
      setError(
        "No encontramos ninguna junta con ese código. Revisa que esté bien escrito."
      );
      setJunta(null);
    } else {
      setJunta(encontrada);
    }
    setBuscando(false);
  }

  async function unirse() {
    if (uniendo || !junta) return;
    setUniendo(true);

    // TODO: conectar a smart contract — registrar al usuario como participante de
    // esta junta. En modo protegido el contrato debe además reservar su posición
    // sin turno asignado hasta que se complete el grupo y se ejecute el sorteo.
    await new Promise((r) => setTimeout(r, 1000));
    setUniendo(false);
    setListo(true);
  }

  if (listo && junta) {
    return (
      <div className="flex flex-col items-center py-10 text-center" role="status">
        <span className="grid size-20 place-items-center rounded-full bg-[#e6ecdf]">
          <CheckCircle size={52} weight="fill" color="#4B6B3A" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-h2 font-semibold text-minka-text">
          Ya estás en la junta
        </h2>
        <p className="mt-2 max-w-sm text-body text-minka-muted">
          Entraste a “{junta.nombre}”. Te avisamos por WhatsApp cuando el grupo esté
          completo y se repartan los turnos.
        </p>
        <Button asChild size="lg" className="mt-7">
          <Link href="/inicio">Ir a mis juntas</Link>
        </Button>
      </div>
    );
  }

  // Paso 1: buscar por código
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
          y <strong>TIALUCHA</strong> es tradicional.
        </p>
      </form>
    );
  }

  // Paso 2: reglas de la junta + lo que cambia según el modo
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
  const nivel = nivelDeConfianza(score);
  const faltan = junta.totalParticipantes - junta.participantes.length;

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => {
          setJunta(null);
          setAcepto(false);
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
        </div>
        <p className="mt-2 flex items-center gap-2 text-body text-minka-muted">
          <UsersThree size={22} weight="duotone" aria-hidden="true" />
          {junta.participantes.length} de {junta.totalParticipantes} personas —
          faltan {faltan}
        </p>
      </div>

      {/* Reglas ya fijadas: el que entra no negocia, solo decide */}
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
        /* Modo protegido: su score y qué necesitaría para un turno temprano */
        <div className="space-y-4">
          <div className="rounded-lg border-2 border-minka-border bg-minka-surface p-4">
            <h3 className="text-h3 font-semibold text-minka-text">
              Tu situación en esta junta
            </h3>

            <div className="mt-3 flex items-center justify-between gap-4">
              <span className="text-body text-minka-muted">Tu historial</span>
              <span className="text-body font-semibold text-minka-text">
                {ETIQUETA_NIVEL[nivel]} · {score} de 100
              </span>
            </div>

            <div className="mt-4 border-t border-minka-border pt-4">
              <p className="text-body text-minka-text">
                Si te toca el {turnoOrdinal(1)} turno, antes de cobrar tendrías que
                tener bloqueada una garantía de{" "}
                <strong className="font-semibold">{soles(garantiaPrimerTurno)}</strong>{" "}
                y pagarías una prima de{" "}
                <strong className="font-semibold">{soles(primaPrimerTurno)}</strong>{" "}
                una sola vez.
              </p>
              <p className="mt-3 text-body text-minka-muted">
                Mientras más tarde sea tu turno, menos garantía y menos prima. En el
                último turno no pagas prima y no necesitas garantía.
              </p>
            </div>
          </div>

          <p className="flex gap-3 rounded-lg border border-minka-border bg-minka-bg p-4 text-body text-minka-text">
            <Info size={24} weight="duotone" color="#BF312A" className="shrink-0" aria-hidden="true" />
            <span>
              ¿No tienes la garantía? Puedes pedirle a alguien de confianza que te
              avale, o esperar un turno más tarde. Nadie te obliga a cobrar temprano.
            </span>
          </p>
        </div>
      ) : (
        /* Modo tradicional: consentimiento explícito, no un simple aviso */
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
              aria-describedby="texto-consentimiento"
            />
            <span id="texto-consentimiento" className="text-body font-semibold text-minka-text">
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
        disabled={uniendo || (junta.modo === "tradicional" && !acepto)}
      >
        {uniendo ? (
          <>
            <Spinner />
            Uniéndote a la junta…
          </>
        ) : (
          "Unirme a esta junta"
        )}
      </Button>
    </div>
  );
}
