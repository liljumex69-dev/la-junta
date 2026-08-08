"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle, DownloadSimple, Info, Users, Warning } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Aparecer } from "@/components/common/aparecer";
import { CompartirAsociacion } from "@/components/asociacion/compartir-asociacion";
import { etiquetaCargo } from "@/lib/junta/format";
import { esDirectivo, formatoUmbral } from "@/lib/junta/rules";
import { descargarCSV } from "@/lib/junta/csv";
import { useJunta } from "@/lib/junta/context";

const PORCENTAJES_MORA = [3, 5, 10];

/**
 * Configuración de la asociación: umbral de firmas, firmantes autorizados, tasa
 * de mora y notificaciones. Solo directivos — son las reglas que gobiernan el
 * fondo de todos, no una preferencia personal.
 */
export default function ConfiguracionPage() {
  const { usuario, asociacion, directivosDelDirectorio, configurarAsociacion } = useJunta();
  const [guardado, setGuardado] = useState<string | null>(null);

  if (!usuario || !asociacion) return null;

  if (!esDirectivo(usuario)) {
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <Warning size={48} weight="duotone" color="#B8863B" aria-hidden="true" />
        <p className="mt-4 max-w-sm text-body text-marca-tenue">
          Solo el directorio puede cambiar la configuración de la asociación.
        </p>
        <Button asChild size="lg" className="mt-7">
          <Link href="/inicio">Ir al inicio</Link>
        </Button>
      </div>
    );
  }

  const { configuracion } = asociacion;

  function avisar(mensaje: string) {
    setGuardado(mensaje);
    setTimeout(() => setGuardado(null), 2500);
  }

  function cambiarUmbral(delta: number) {
    const siguiente = Math.min(
      configuracion.totalFirmantes,
      Math.max(1, configuracion.umbralFirmas + delta)
    );
    if (siguiente === configuracion.umbralFirmas) return;
    configurarAsociacion({ umbralFirmas: siguiente });
    avisar(`Umbral actualizado a ${siguiente} de ${configuracion.totalFirmantes}.`);
  }

  function cambiarMoraActiva(activa: boolean) {
    configurarAsociacion({ mora: { ...configuracion.mora, activa } });
    avisar(activa ? "Mora activada." : "Mora desactivada.");
  }

  function cambiarMoraPorcentaje(porcentaje: number) {
    configurarAsociacion({ mora: { ...configuracion.mora, porcentaje } });
    avisar(`Recargo por mora actualizado a ${porcentaje}%.`);
  }

  function cambiarNotificaciones(activas: boolean) {
    configurarAsociacion({ notificacionesActivas: activas });
    avisar(activas ? "Notificaciones activadas." : "Notificaciones desactivadas.");
  }

  const exportarCSV = () => {
    descargarCSV(
      `directorio-${asociacion.codigoInvitacion}.csv`,
      ["Nombre", "Cargo", "Firmante"],
      directivosDelDirectorio.map((d) => [d.nombre, etiquetaCargo(d.cargo), "Sí"])
    );
  };

  return (
    <div className="space-y-6">
      <Aparecer>
        <h1 className="text-display font-semibold text-marca-texto">
          Configuración de la asociación
        </h1>
        <p className="mt-1 text-body text-marca-tenue">{asociacion.nombreMercado}</p>
      </Aparecer>

      {guardado ? (
        <p
          role="status"
          className="flex items-center gap-2 rounded-lg border border-marca-primario bg-[#e3ede6] p-3 text-support font-semibold text-[#1F5C3D]"
        >
          <CheckCircle size={18} weight="fill" aria-hidden="true" />
          {guardado}
        </p>
      ) : null}

      {/* Umbral de firmas */}
      <section className="space-y-3">
        <h2 className="text-h2 font-semibold text-marca-texto">
          Umbral de firmas
        </h2>
        <p className="text-body text-marca-tenue">
          Ningún gasto se ejecuta hasta reunir este número de firmas.
        </p>
        <div className="flex items-center justify-center gap-6 rounded-lg border-2 border-marca-borde bg-marca-superficie p-6">
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            onClick={() => cambiarUmbral(-1)}
            disabled={configuracion.umbralFirmas <= 1}
            aria-label="Menos firmas"
          >
            −
          </Button>
          <div className="text-center">
            <p className="text-[40px] leading-none font-semibold text-marca-texto">
              {configuracion.umbralFirmas}
            </p>
            <p className="mt-1 text-support text-marca-tenue">
              de {configuracion.totalFirmantes}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            onClick={() => cambiarUmbral(1)}
            disabled={configuracion.umbralFirmas >= configuracion.totalFirmantes}
            aria-label="Más firmas"
          >
            +
          </Button>
        </div>
        <p className="flex gap-3 rounded-lg border border-marca-borde bg-marca-fondo p-4 text-body text-marca-texto">
          <Info size={22} weight="duotone" color="#1F5C3D" className="shrink-0" aria-hidden="true" />
          <span>
            Vigente: {formatoUmbral(asociacion)}. Las propuestas ya enviadas
            conservan el umbral con el que se crearon.
          </span>
        </p>
      </section>

      {/* Firmantes autorizados */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-h2 font-semibold text-marca-texto">
            Firmantes autorizados
          </h2>
          <Button variant="ghost" onClick={exportarCSV}>
            <DownloadSimple size={18} weight="bold" aria-hidden="true" />
            CSV
          </Button>
        </div>
        <ul className="divide-y divide-marca-borde rounded-lg border border-marca-borde bg-marca-superficie">
          {directivosDelDirectorio.map((d) => (
            <li key={d.id} className="flex items-center gap-3 p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#e9f0ec] text-support font-semibold text-[#1F5C3D]">
                <Users size={20} weight="duotone" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-body font-semibold text-marca-texto">
                  {d.nombre}
                </p>
                <p className="text-support text-marca-tenue">{etiquetaCargo(d.cargo)}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="text-support text-marca-tenue">
          Para agregar o quitar firmantes, coordina con el resto del directorio —
          cada uno necesita su propia cuenta verificada.
        </p>
      </section>

      {/* Mora */}
      <section className="space-y-3">
        <h2 className="text-h2 font-semibold text-marca-texto">Tasa de mora</h2>
        <div className="flex items-center justify-between gap-4 rounded-lg border border-marca-borde bg-marca-superficie p-4">
          <div>
            <Label htmlFor="mora-activa" className="text-body font-semibold">
              Cobrar mora por atraso
            </Label>
            <p className="mt-1 text-support text-marca-tenue">
              Puede desactivarse por completo, sin recargos.
            </p>
          </div>
          <Switch
            id="mora-activa"
            checked={configuracion.mora.activa}
            onCheckedChange={cambiarMoraActiva}
            aria-label="Cobrar mora por atraso"
          />
        </div>
        {configuracion.mora.activa ? (
          <div>
            <Label htmlFor="mora-porcentaje-config" className="text-body font-semibold">
              Porcentaje de recargo
            </Label>
            <div className="mt-2 flex items-center gap-2">
              {PORCENTAJES_MORA.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => cambiarMoraPorcentaje(p)}
                  className={
                    "touch-target flex-1 rounded-md border-2 text-body font-semibold transition-colors " +
                    (configuracion.mora.porcentaje === p
                      ? "border-marca-primario bg-[#e9f0ec] text-marca-primario"
                      : "border-marca-borde bg-marca-superficie text-marca-texto")
                  }
                >
                  {p}%
                </button>
              ))}
              <div className="relative w-24 shrink-0">
                <Input
                  id="mora-porcentaje-config"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={100}
                  step="0.5"
                  className="h-11 pr-7 text-center"
                  value={configuracion.mora.porcentaje}
                  onChange={(e) =>
                    cambiarMoraPorcentaje(Math.min(100, Math.max(0, Number(e.target.value))))
                  }
                  aria-label="Porcentaje de recargo específico"
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-support text-marca-tenue">
                  %
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </section>

      {/* Compartir / QR */}
      <section className="rounded-lg border border-marca-borde bg-marca-superficie p-5">
        <CompartirAsociacion asociacion={asociacion} />
      </section>

      {/* Notificaciones */}
      <section className="space-y-3">
        <h2 className="text-h2 font-semibold text-marca-texto">Notificaciones</h2>
        <div className="flex items-center justify-between gap-4 rounded-lg border border-marca-borde bg-marca-superficie p-4">
          <div>
            <Label htmlFor="notificaciones" className="text-body font-semibold">
              Avisar sobre propuestas y cuotas
            </Label>
            <p className="mt-1 text-support text-marca-tenue">
              Nuevas propuestas, cuotas vencidas y anuncios del tablón.
            </p>
          </div>
          <Switch
            id="notificaciones"
            checked={configuracion.notificacionesActivas}
            onCheckedChange={cambiarNotificaciones}
            aria-label="Avisar sobre propuestas y cuotas"
          />
        </div>
      </section>
    </div>
  );
}
