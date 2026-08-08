"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CaretLeft,
  CheckCircle,
  Info,
  Plus,
  Trash,
  Users,
} from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OpcionRadio } from "@/components/common/opcion-radio";
import { Spinner } from "@/components/common/spinner";
import { CompartirAsociacion } from "@/components/asociacion/compartir-asociacion";
import { ETIQUETA_CARGO } from "@/lib/junta/format";
import { useJunta } from "@/lib/junta/context";
import type { Asociacion, CargoDirectivo, DirectivoInicial } from "@/lib/junta/types";

const CARGOS: { valor: CargoDirectivo; titulo: string; descripcion: string }[] = [
  { valor: "presidente", titulo: "Presidente", descripcion: "Representa a la asociación y coordina al directorio." },
  { valor: "tesorero", titulo: "Tesorero", descripcion: "Propone los gastos del fondo con más frecuencia." },
  { valor: "secretario", titulo: "Secretario", descripcion: "Lleva las actas y las comunicaciones del directorio." },
  { valor: "vocal", titulo: "Vocal", descripcion: "Firma las propuestas junto con el resto del directorio." },
];

const CARGOS_LISTA: CargoDirectivo[] = ["presidente", "tesorero", "secretario", "vocal"];

/**
 * Crear asociación.
 *
 * Asistente paso a paso: una decisión por pantalla, como en el registro. El punto
 * central que ninguna otra pantalla puede diluir es el umbral de firmas — por eso
 * tiene su propio paso, con la cuenta de firmantes hecha en voz alta.
 *
 * El fundador nombra al resto del directorio por nombre y cargo (todavía no tienen
 * cuenta en el prototipo: la tendrán cuando se registren con el enlace que reciban).
 * Ese directorio es lo que define cuántos firmantes hay en total y, por lo tanto,
 * qué umbral tiene sentido pedir.
 */
export function CrearAsociacionWizard() {
  const { crearAsociacion } = useJunta();

  const [paso, setPaso] = useState(0);
  const [nombreMercado, setNombreMercado] = useState("");
  const [numeroPuestos, setNumeroPuestos] = useState(50);
  const [cargo, setCargo] = useState<CargoDirectivo>("presidente");
  const [directivos, setDirectivos] = useState<DirectivoInicial[]>([
    { nombre: "", cargo: "tesorero" },
    { nombre: "", cargo: "vocal" },
  ]);
  const [umbralFirmas, setUmbralFirmas] = useState(3);
  const [moraActiva, setMoraActiva] = useState(true);
  const [moraPorcentaje, setMoraPorcentaje] = useState(5);
  const [creando, setCreando] = useState(false);
  const [creada, setCreada] = useState<Asociacion | null>(null);

  const directivosValidos = directivos.filter((d) => d.nombre.trim().length >= 3);
  const totalFirmantes = 1 + directivosValidos.length;
  const pasos = ["Tu mercado", "Tu directorio", "Umbral de firmas", "Tasa de mora", "Revisar"];

  function actualizarDirectivo(i: number, cambio: Partial<DirectivoInicial>) {
    setDirectivos((d) => d.map((x, k) => (k === i ? { ...x, ...cambio } : x)));
  }

  async function crear() {
    if (creando) return;
    setCreando(true);
    await new Promise((r) => setTimeout(r, 1200));

    const nueva = crearAsociacion({
      nombreMercado,
      numeroPuestos,
      umbralFirmas,
      cargo,
      directivosIniciales: directivosValidos,
      moraActiva,
      moraPorcentaje,
    });

    setCreada(nueva);
    setCreando(false);
  }

  /* ---------------- Pantalla final ---------------- */
  if (creada) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center py-6 text-center" role="status">
          <span className="grid size-20 place-items-center rounded-full bg-[#e3ede6]">
            <CheckCircle size={52} weight="fill" color="#4C8C5C" aria-hidden="true" />
          </span>
          <h2 className="mt-5 text-h2 font-semibold text-marca-texto">
            Tu asociación está fundada
          </h2>
          <p className="mt-2 text-body text-marca-tenue">
            El fondo de &ldquo;{creada.nombreMercado}&rdquo; ya existe, protegido con
            firma múltiple.
          </p>
        </div>

        <div className="rounded-lg border border-marca-borde bg-marca-superficie p-5">
          <CompartirAsociacion asociacion={creada} />
        </div>

        <div className="space-y-3">
          <Button asChild size="lg" className="w-full">
            <Link href="/fondo">Ver el panel del fondo</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full">
            <Link href="/inicio">Ir al inicio</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          {paso > 0 ? (
            <button
              type="button"
              onClick={() => setPaso((p) => p - 1)}
              className="touch-target -ml-3 flex items-center gap-1 rounded-md pr-3 text-body font-semibold text-marca-texto transition-colors hover:bg-[#ece5d3]"
            >
              <CaretLeft size={22} weight="bold" aria-hidden="true" />
              Atrás
            </button>
          ) : (
            <span />
          )}
          <span className="text-support font-semibold text-marca-secundario">
            Paso {paso + 1} de {pasos.length}
          </span>
        </div>

        <div
          className="mt-3 h-2 w-full overflow-hidden rounded-sm bg-[#ece5d3]"
          role="progressbar"
          aria-valuenow={paso + 1}
          aria-valuemin={1}
          aria-valuemax={pasos.length}
          aria-label="Progreso al fundar la asociación"
        >
          <span
            className="block h-full rounded-sm bg-marca-primario transition-[width] duration-200"
            style={{ width: `${((paso + 1) / pasos.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Paso 1 — datos del mercado */}
      {paso === 0 && (
        <div className="space-y-6">
          <h2 className="text-h2 font-semibold text-marca-texto">
            ¿Cuál es tu mercado?
          </h2>

          <div>
            <Label htmlFor="nombre-mercado" className="text-body font-semibold">
              Nombre del mercado
            </Label>
            <Input
              id="nombre-mercado"
              className="mt-2"
              placeholder="Mercado Villa El Salvador"
              value={nombreMercado}
              onChange={(e) => setNombreMercado(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="puestos" className="text-body font-semibold">
              Número de puestos del mercado
            </Label>
            <Input
              id="puestos"
              type="number"
              inputMode="numeric"
              min={1}
              className="mt-2"
              value={numeroPuestos}
              onChange={(e) => setNumeroPuestos(Math.max(1, Number(e.target.value)))}
            />
            <p className="mt-2 text-support text-marca-tenue">
              No hace falta el número exacto — ayuda a estimar el fondo esperado.
            </p>
          </div>
        </div>
      )}

      {/* Paso 2 — directorio */}
      {paso === 1 && (
        <div className="space-y-6">
          <h2 className="text-h2 font-semibold text-marca-texto">
            Tu directorio
          </h2>
          <p className="text-body text-marca-tenue">
            Tú eres uno de los firmantes. Agrega al resto del directorio — cada uno
            recibirá un enlace para registrarse cuando la asociación esté lista.
          </p>

          <div>
            <Label className="text-body font-semibold">Tu cargo</Label>
            <div className="mt-2 space-y-3">
              {CARGOS.map((c) => (
                <OpcionRadio
                  key={c.valor}
                  name="mi-cargo"
                  seleccionado={cargo === c.valor}
                  onSelect={() => setCargo(c.valor)}
                  titulo={c.titulo}
                  descripcion={c.descripcion}
                />
              ))}
            </div>
          </div>

          <div>
            <Label className="text-body font-semibold">Los demás directivos</Label>
            <div className="mt-2 space-y-3">
              {directivos.map((d, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    placeholder="Nombre completo"
                    value={d.nombre}
                    onChange={(e) => actualizarDirectivo(i, { nombre: e.target.value })}
                    aria-label={`Nombre del directivo ${i + 1}`}
                  />
                  <Select
                    value={d.cargo}
                    onValueChange={(v) => actualizarDirectivo(i, { cargo: v as CargoDirectivo })}
                  >
                    <SelectTrigger className="h-12 w-40 shrink-0 border-2 border-marca-borde bg-marca-superficie text-body">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CARGOS_LISTA.map((c) => (
                        <SelectItem key={c} value={c}>
                          {ETIQUETA_CARGO[c]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Quitar este directivo"
                    onClick={() => setDirectivos((ds) => ds.filter((_, k) => k !== i))}
                  >
                    <Trash size={20} weight="duotone" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              className="mt-3 w-full"
              onClick={() => setDirectivos((ds) => [...ds, { nombre: "", cargo: "vocal" }])}
            >
              <Plus size={20} weight="bold" aria-hidden="true" />
              Agregar directivo
            </Button>
          </div>

          <p className="flex gap-3 rounded-lg border border-marca-borde bg-marca-fondo p-4 text-body text-marca-texto">
            <Users size={24} weight="duotone" color="#1F5C3D" className="shrink-0" aria-hidden="true" />
            <span>
              Con tu directorio actual son{" "}
              <strong className="font-semibold">{totalFirmantes} firmantes</strong>{" "}
              en total. Puedes agregar más directivos después desde la
              configuración.
            </span>
          </p>
        </div>
      )}

      {/* Paso 3 — umbral de firmas */}
      {paso === 2 && (
        <div className="space-y-6">
          <h2 className="text-h2 font-semibold text-marca-texto">
            ¿Cuántas firmas se necesitan?
          </h2>
          <p className="text-body text-marca-tenue">
            Ningún gasto se ejecuta hasta reunir este número de firmas. Mientras más
            alto, más seguro — pero también más lento para actuar.
          </p>

          <div className="flex items-center justify-center gap-6 rounded-lg border-2 border-marca-borde bg-marca-superficie p-6">
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              onClick={() => setUmbralFirmas((n) => Math.max(1, n - 1))}
              disabled={umbralFirmas <= 1}
              aria-label="Menos firmas"
            >
              −
            </Button>
            <div className="text-center">
              <p className="text-[40px] leading-none font-semibold text-marca-texto">
                {umbralFirmas}
              </p>
              <p className="mt-1 text-support text-marca-tenue">de {totalFirmantes}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              onClick={() => setUmbralFirmas((n) => Math.min(totalFirmantes, n + 1))}
              disabled={umbralFirmas >= totalFirmantes}
              aria-label="Más firmas"
            >
              +
            </Button>
          </div>

          <p className="flex gap-3 rounded-lg border border-marca-borde bg-marca-fondo p-4 text-body text-marca-texto">
            <Info size={24} weight="duotone" color="#1F5C3D" className="shrink-0" aria-hidden="true" />
            <span>
              Con {umbralFirmas} de {totalFirmantes}, ni tú solo ni ningún otro
              directivo por separado puede mover el fondo. Siempre van a necesitar
              ponerse de acuerdo entre varios.
            </span>
          </p>
        </div>
      )}

      {/* Paso 4 — mora */}
      {paso === 3 && (
        <div className="space-y-6">
          <h2 className="text-h2 font-semibold text-marca-texto">
            ¿Cobran mora por atraso?
          </h2>
          <p className="text-body text-marca-tenue">
            Es tu decisión como asociación. Puedes desactivarla del todo si
            prefieren no cobrar recargos.
          </p>

          <OpcionRadio
            name="mora"
            seleccionado={moraActiva}
            onSelect={() => setMoraActiva(true)}
            titulo="Sí, cobrar mora"
            descripcion="Un recargo se suma a la cuota si se paga después de la fecha."
          />
          <OpcionRadio
            name="mora"
            seleccionado={!moraActiva}
            onSelect={() => setMoraActiva(false)}
            titulo="No cobrar mora"
            descripcion="La cuota vale lo mismo la pagues cuando la pagues."
          />

          {moraActiva ? (
            <div>
              <Label className="text-body font-semibold">Porcentaje de recargo</Label>
              <div className="mt-2 flex gap-2">
                {[3, 5, 10].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setMoraPorcentaje(p)}
                    className={
                      "touch-target flex-1 rounded-md border-2 text-body font-semibold transition-colors " +
                      (moraPorcentaje === p
                        ? "border-marca-primario bg-[#e9f0ec] text-marca-primario"
                        : "border-marca-borde bg-marca-superficie text-marca-texto")
                    }
                  >
                    {p}%
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Paso 5 — resumen */}
      {paso === 4 && (
        <div className="space-y-5">
          <h2 className="text-h2 font-semibold text-marca-texto">
            Revisa antes de fundar
          </h2>

          <dl className="divide-y divide-marca-borde rounded-lg border border-marca-borde bg-marca-superficie">
            {[
              ["Mercado", nombreMercado || "Sin nombre"],
              ["Puestos", String(numeroPuestos)],
              ["Tu cargo", ETIQUETA_CARGO[cargo]],
              ["Directorio", `${totalFirmantes} firmantes en total`],
              ["Umbral de firmas", `${umbralFirmas} de ${totalFirmantes}`],
              ["Mora", moraActiva ? `${moraPorcentaje}% de recargo` : "Desactivada"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 p-4">
                <dt className="text-body text-marca-tenue">{k}</dt>
                <dd className="text-right text-body font-semibold text-marca-texto">
                  {v}
                </dd>
              </div>
            ))}
          </dl>

          <p className="rounded-lg border border-marca-borde bg-marca-fondo p-4 text-body text-marca-texto">
            Estas reglas quedan fijas al fundar. Cambiar el umbral o la mora después
            se hace desde la configuración, y siempre requiere el acuerdo del
            directorio.
          </p>

          <Button
            size="lg"
            className="w-full"
            onClick={crear}
            disabled={creando || nombreMercado.trim().length < 3}
          >
            {creando ? (
              <>
                <Spinner />
                Fundando tu asociación…
              </>
            ) : (
              "Fundar la asociación"
            )}
          </Button>
        </div>
      )}

      {paso < 4 && (
        <Button
          size="lg"
          className="w-full"
          onClick={() => setPaso((p) => p + 1)}
          disabled={paso === 0 && nombreMercado.trim().length < 3}
        >
          Continuar
        </Button>
      )}
    </div>
  );
}
