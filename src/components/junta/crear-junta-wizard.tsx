"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CaretLeft,
  CheckCircle,
  Copy,
  Info,
  Minus,
  Plus,
  ShareNetwork,
  WhatsappLogo,
} from "@phosphor-icons/react/ssr";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OpcionRadio } from "@/components/minka/opcion-radio";
import { Spinner } from "@/components/minka/spinner";
import { ETIQUETA_FRECUENCIA, soles } from "@/lib/minka/format";
import { LIMITES_PLAN, calcularPrima, puedeCrearJuntaPublica } from "@/lib/minka/rules";
import type {
  AsignacionTurnos,
  FrecuenciaCuota,
  ModoJunta,
  VisibilidadJunta,
} from "@/lib/minka/types";

/**
 * Crear junta.
 *
 * Es un asistente paso a paso, no un formulario largo: una decisión por pantalla.
 * Para alguien con poca familiaridad con apps, ver seis campos a la vez es la
 * diferencia entre terminar y abandonar.
 *
 * Las reglas duras del producto se aplican aquí, no como validación al final:
 * - Junta pública solo si el organizador ya completó 2 juntas. No lo desbloquea ningún plan.
 * - Junta pública es siempre modo protegido, sin opción.
 * - Turnos manuales solo en juntas privadas.
 */
const FRECUENCIAS: FrecuenciaCuota[] = ["semanal", "quincenal", "mensual"];
const MONTOS_SUGERIDOS = [50, 100, 200, 300];

export function CrearJuntaWizard({
  juntasCompletadas,
  juntasActivas,
  plan,
}: {
  juntasCompletadas: number;
  juntasActivas: number;
  plan: "gratuito" | "pro";
}) {
  const limites = LIMITES_PLAN[plan];
  const puedePublica = puedeCrearJuntaPublica(juntasCompletadas);

  const [paso, setPaso] = useState(0);
  const [nombre, setNombre] = useState("");
  const [cuota, setCuota] = useState(100);
  const [frecuencia, setFrecuencia] = useState<FrecuenciaCuota>("mensual");
  const [participantes, setParticipantes] = useState(6);
  const [visibilidad, setVisibilidad] = useState<VisibilidadJunta>("privada");
  const [modo, setModo] = useState<ModoJunta>("protegido");
  const [turnos, setTurnos] = useState<AsignacionTurnos>("sorteo");
  const [creando, setCreando] = useState(false);
  const [codigo, setCodigo] = useState<string | null>(null);

  // Una junta pública no admite modo tradicional ni turnos manuales.
  const modoEfectivo: ModoJunta = visibilidad === "publica" ? "protegido" : modo;
  const turnosEfectivos: AsignacionTurnos =
    visibilidad === "publica" ? "sorteo" : turnos;

  const excedeCuota = cuota > limites.maxCuota;
  const excedeParticipantes = participantes > limites.maxParticipantes;
  const sinCupo = juntasActivas >= limites.maxJuntasSimultaneas;

  const pasos = [
    "Cuánto y cada cuánto",
    "Quiénes pueden entrar",
    "Cómo se protege",
    "Cómo se reparten los turnos",
    "Revisa y crea",
  ];
  // El paso "cómo se protege" no se muestra en juntas públicas: no hay nada que elegir.
  const pasosVisibles =
    visibilidad === "publica" ? pasos.filter((_, i) => i !== 2) : pasos;

  function siguiente() {
    setPaso((p) => {
      const next = p + 1;
      return visibilidad === "publica" && next === 2 ? 3 : next;
    });
  }

  function anterior() {
    setPaso((p) => {
      const prev = p - 1;
      return visibilidad === "publica" && prev === 2 ? 1 : Math.max(0, prev);
    });
  }

  async function crear() {
    if (creando) return;
    setCreando(true);

    // TODO: conectar a smart contract — desplegar la junta en Arbitrum con estos
    // parámetros (cuota, frecuencia, número de turnos, modo, visibilidad, método de
    // asignación de turnos) y devolver la dirección del contrato y el código de invitación.
    await new Promise((r) => setTimeout(r, 1100));

    setCodigo(
      nombre
        .toUpperCase()
        .replace(/[^A-Z]/g, "")
        .slice(0, 5)
        .padEnd(5, "X") + participantes
    );
    setCreando(false);
  }

  const primaTurno1 = calcularPrima(1, participantes, cuota, modoEfectivo);

  // Pantalla final: la junta ya existe, ahora hay que llenarla.
  if (codigo) {
    const enlace = `https://minka.pe/unirse?codigo=${codigo}`;
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center py-6 text-center" role="status">
          <span className="grid size-20 place-items-center rounded-full bg-[#e6ecdf]">
            <CheckCircle size={52} weight="fill" color="#4B6B3A" aria-hidden="true" />
          </span>
          <h2 className="mt-5 text-h2 font-semibold text-minka-text">
            Tu junta está creada
          </h2>
          <p className="mt-2 text-body text-minka-muted">
            Ahora invita a las {participantes - 1} personas que faltan. La junta
            arranca cuando estén todas.
          </p>
        </div>

        <div className="rounded-lg border-2 border-minka-border bg-minka-surface p-5 text-center">
          <p className="text-support font-semibold text-minka-muted">
            Código para compartir
          </p>
          <p className="mt-2 text-[32px] font-semibold tracking-[0.15em] text-minka-text">
            {codigo}
          </p>
        </div>

        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full"
            onClick={() => {
              // TODO: conectar a smart contract — el enlace debe apuntar a la junta
              // real desplegada, no a un código generado en el cliente.
              window.open(
                `https://wa.me/?text=${encodeURIComponent(
                  `Te invito a nuestra junta "${nombre}" en Minka. Entra con el código ${codigo}: ${enlace}`
                )}`,
                "_blank"
              );
            }}
          >
            <WhatsappLogo size={24} weight="fill" aria-hidden="true" />
            Invitar por WhatsApp
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="w-full"
            onClick={() => {
              navigator.clipboard?.writeText(enlace);
              toast.success("Enlace copiado");
            }}
          >
            <Copy size={22} weight="duotone" aria-hidden="true" />
            Copiar enlace
          </Button>

          <Button asChild size="lg" variant="ghost" className="w-full">
            <Link href="/inicio">Ir a mis juntas</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progreso del asistente */}
      <div>
        <div className="flex items-center justify-between">
          {paso > 0 ? (
            <button
              type="button"
              onClick={anterior}
              className="touch-target -ml-3 flex items-center gap-1 rounded-md pr-3 text-body font-semibold text-minka-text transition-colors hover:bg-[#ece4d8]"
            >
              <CaretLeft size={22} weight="bold" aria-hidden="true" />
              Atrás
            </button>
          ) : (
            <span />
          )}
          <span className="text-support font-semibold text-minka-secondary">
            Paso {pasosVisibles.indexOf(pasos[paso]) + 1} de {pasosVisibles.length}
          </span>
        </div>

        <div
          className="mt-3 h-2 w-full overflow-hidden rounded-sm bg-[#e9e0d2]"
          role="progressbar"
          aria-valuenow={pasosVisibles.indexOf(pasos[paso]) + 1}
          aria-valuemin={1}
          aria-valuemax={pasosVisibles.length}
          aria-label="Progreso de creación de la junta"
        >
          <span
            className="block h-full rounded-sm bg-minka-primary transition-[width] duration-200"
            style={{
              width: `${
                ((pasosVisibles.indexOf(pasos[paso]) + 1) / pasosVisibles.length) *
                100
              }%`,
            }}
          />
        </div>
      </div>

      {sinCupo ? (
        <p className="rounded-lg border-2 border-minka-secondary bg-[#fbeed8] p-4 text-body text-minka-text">
          Ya tienes {juntasActivas} juntas activas, el máximo de tu plan{" "}
          {limites.etiqueta}.{" "}
          <Link
            href="/planes"
            className="font-semibold text-minka-primary underline underline-offset-4"
          >
            Mira los planes
          </Link>{" "}
          si necesitas más al mismo tiempo.
        </p>
      ) : null}

      {/* Paso 1 — cuánto y cada cuánto */}
      {paso === 0 && (
        <div className="space-y-6">
          <h2 className="text-h2 font-semibold text-minka-text">
            ¿Cuánto y cada cuánto?
          </h2>

          <div>
            <Label htmlFor="nombre-junta" className="text-body font-semibold">
              Nombre de la junta
            </Label>
            <Input
              id="nombre-junta"
              className="mt-2"
              placeholder="Ahorro del mercado"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <p className="mt-2 text-support text-minka-muted">
              Como la conocen entre ustedes.
            </p>
          </div>

          <div>
            <Label htmlFor="cuota" className="text-body font-semibold">
              Cuota de cada persona
            </Label>
            <div className="mt-2 flex gap-2">
              <span className="grid h-12 w-14 shrink-0 place-items-center rounded-md border-2 border-minka-border bg-[#ece4d8] text-body font-semibold text-minka-text">
                S/
              </span>
              <Input
                id="cuota"
                type="number"
                inputMode="numeric"
                min={10}
                value={cuota}
                onChange={(e) => setCuota(Number(e.target.value))}
                className="text-h3 font-semibold"
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {MONTOS_SUGERIDOS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setCuota(m)}
                  className={
                    "touch-target rounded-md border-2 px-4 text-body font-semibold transition-colors " +
                    (cuota === m
                      ? "border-minka-primary bg-[#f9ece9] text-minka-primary"
                      : "border-minka-border bg-minka-surface text-minka-text")
                  }
                >
                  {soles(m)}
                </button>
              ))}
            </div>
            {excedeCuota ? (
              <p className="mt-3 text-body font-semibold text-minka-danger">
                Tu plan {limites.etiqueta} permite hasta {soles(limites.maxCuota)}{" "}
                por cuota.{" "}
                <Link href="/planes" className="underline underline-offset-4">
                  Ver planes
                </Link>
              </p>
            ) : null}
          </div>

          <fieldset>
            <legend className="text-body font-semibold text-minka-text">
              Cada cuánto se aporta
            </legend>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {FRECUENCIAS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFrecuencia(f)}
                  aria-pressed={frecuencia === f}
                  className={
                    "touch-target rounded-md border-2 px-2 text-body font-semibold capitalize transition-colors " +
                    (frecuencia === f
                      ? "border-minka-primary bg-[#f9ece9] text-minka-primary"
                      : "border-minka-border bg-minka-surface text-minka-text")
                  }
                >
                  {f}
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            <Label className="text-body font-semibold">
              Cuántas personas van a participar
            </Label>
            <div className="mt-2 flex items-center justify-between rounded-md border-2 border-minka-border bg-minka-surface p-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setParticipantes((n) => Math.max(3, n - 1))}
                aria-label="Quitar una persona"
                disabled={participantes <= 3}
              >
                <Minus size={24} weight="bold" />
              </Button>
              <span
                className="text-[28px] font-semibold text-minka-text"
                aria-live="polite"
              >
                {participantes}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setParticipantes((n) => n + 1)}
                aria-label="Agregar una persona"
              >
                <Plus size={24} weight="bold" />
              </Button>
            </div>
            <p className="mt-2 text-support text-minka-muted">
              Son {participantes} turnos: uno para cada persona.
            </p>
            {excedeParticipantes ? (
              <p className="mt-2 text-body font-semibold text-minka-danger">
                Tu plan {limites.etiqueta} permite hasta{" "}
                {limites.maxParticipantes} personas.{" "}
                <Link href="/planes" className="underline underline-offset-4">
                  Ver planes
                </Link>
              </p>
            ) : null}
          </div>

          <div className="rounded-lg border border-minka-border bg-minka-surface p-4">
            <p className="text-body text-minka-text">
              Cuando te toque, vas a recibir{" "}
              <strong className="font-semibold">
                {soles(cuota * participantes)}
              </strong>{" "}
              de una sola vez.
            </p>
          </div>
        </div>
      )}

      {/* Paso 2 — quiénes pueden entrar */}
      {paso === 1 && (
        <div className="space-y-4">
          <h2 className="text-h2 font-semibold text-minka-text">
            ¿Quiénes pueden entrar?
          </h2>

          <OpcionRadio
            name="visibilidad"
            seleccionado={visibilidad === "privada"}
            onSelect={() => setVisibilidad("privada")}
            titulo="Privada"
            descripcion="Solo entra quien tenga tu código. Tú eliges a quién invitas. Es la forma normal de empezar."
          />

          <OpcionRadio
            name="visibilidad"
            seleccionado={visibilidad === "publica"}
            onSelect={() => puedePublica && setVisibilidad("publica")}
            titulo="Pública"
            descripcion="Cualquier persona de Minka puede pedir entrar, aunque no la conozcas. Siempre lleva garantía activada."
            deshabilitado={!puedePublica}
            motivoDeshabilitado={
              !puedePublica
                ? `Necesitas 2 juntas completas para organizar juntas públicas. Llevas ${juntasCompletadas}. Esto se gana con historial, no se compra con ningún plan.`
                : undefined
            }
          />
        </div>
      )}

      {/* Paso 3 — cómo se protege (solo juntas privadas) */}
      {paso === 2 && visibilidad === "privada" && (
        <div className="space-y-4">
          <h2 className="text-h2 font-semibold text-minka-text">
            ¿Cómo se protege el grupo?
          </h2>

          <OpcionRadio
            name="modo"
            seleccionado={modo === "protegido"}
            onSelect={() => setModo("protegido")}
            titulo="Protegida"
            etiqueta={<Badge variant="success">Recomendada</Badge>}
            descripcion={`Quien cobra temprano deja una garantía y paga una prima pequeña (${soles(
              primaTurno1
            )} en el primer turno, nada en el último). Si alguien no paga, esa garantía y el fondo del grupo cubren a los demás.`}
          />

          <OpcionRadio
            name="modo"
            seleccionado={modo === "tradicional"}
            onSelect={() => setModo("tradicional")}
            titulo="Tradicional"
            descripcion="Como la junta de papel: sin garantía y sin prima, el pozo va completo siempre. Si alguien no paga, lo resuelven entre ustedes."
          />

          {modo === "tradicional" ? (
            <p className="flex gap-3 rounded-lg border-2 border-minka-secondary bg-[#fbeed8] p-4 text-body text-minka-text">
              <Info
                size={24}
                weight="fill"
                color="#E38E20"
                className="shrink-0"
                aria-hidden="true"
              />
              <span>
                Sin garantía, Minka no puede devolverle el dinero a nadie si alguien
                deja de pagar. Úsala solo con gente que conoces de verdad.
              </span>
            </p>
          ) : null}
        </div>
      )}

      {/* Paso 4 — turnos */}
      {paso === 3 && (
        <div className="space-y-4">
          <h2 className="text-h2 font-semibold text-minka-text">
            ¿Cómo se reparten los turnos?
          </h2>

          <OpcionRadio
            name="turnos"
            seleccionado={turnosEfectivos === "sorteo"}
            onSelect={() => setTurnos("sorteo")}
            titulo="Por sorteo"
            descripcion="El orden se sortea solo, delante de todos, cuando la junta se llena. Nadie lo puede cambiar después."
          />

          <OpcionRadio
            name="turnos"
            seleccionado={turnosEfectivos === "manual"}
            onSelect={() => visibilidad === "privada" && setTurnos("manual")}
            titulo="Lo acordamos entre nosotros"
            descripcion="Tú asignas el orden según lo que ya hayan hablado. Todos lo ven antes de que la junta arranque."
            deshabilitado={visibilidad === "publica"}
            motivoDeshabilitado={
              visibilidad === "publica"
                ? "En juntas públicas los turnos siempre se sortean: entre desconocidos, elegir el orden a mano no sería justo."
                : undefined
            }
          />
        </div>
      )}

      {/* Paso 5 — resumen */}
      {paso === 4 && (
        <div className="space-y-5">
          <h2 className="text-h2 font-semibold text-minka-text">
            Revisa antes de crear
          </h2>

          <dl className="divide-y divide-minka-border rounded-lg border border-minka-border bg-minka-surface">
            {[
              ["Nombre", nombre || "Sin nombre"],
              ["Cuota", `${soles(cuota)} · ${ETIQUETA_FRECUENCIA[frecuencia].toLowerCase()}`],
              ["Personas", `${participantes} personas, ${participantes} turnos`],
              ["Recibes en tu turno", soles(cuota * participantes)],
              ["Quién puede entrar", visibilidad === "privada" ? "Privada, solo con código" : "Pública"],
              ["Protección", modoEfectivo === "protegido" ? "Con garantía y prima" : "Tradicional, sin garantía"],
              ["Turnos", turnosEfectivos === "sorteo" ? "Por sorteo" : "Acordados entre ustedes"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 p-4">
                <dt className="text-body text-minka-muted">{k}</dt>
                <dd className="text-right text-body font-semibold text-minka-text">
                  {v}
                </dd>
              </div>
            ))}
          </dl>

          <p className="flex gap-3 rounded-lg border border-minka-border bg-minka-bg p-4 text-body text-minka-text">
            <ShareNetwork
              size={24}
              weight="duotone"
              color="#BF312A"
              className="shrink-0"
              aria-hidden="true"
            />
            <span>
              Una vez creada, estas reglas ya no se pueden cambiar — ni por ti. Es lo
              que hace que el grupo pueda confiar.
            </span>
          </p>

          <Button
            size="lg"
            className="w-full"
            onClick={crear}
            disabled={creando || sinCupo || excedeCuota || excedeParticipantes}
          >
            {creando ? (
              <>
                <Spinner />
                Generando tu junta…
              </>
            ) : (
              "Crear la junta"
            )}
          </Button>
        </div>
      )}

      {paso < 4 && (
        <Button
          size="lg"
          className="w-full"
          onClick={siguiente}
          disabled={
            (paso === 0 &&
              (nombre.trim().length < 3 || excedeCuota || excedeParticipantes)) ||
            sinCupo
          }
        >
          Continuar
        </Button>
      )}
    </div>
  );
}
