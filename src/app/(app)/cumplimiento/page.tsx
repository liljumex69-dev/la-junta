"use client";

import { DownloadSimple, Info } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Aparecer } from "@/components/common/aparecer";
import { TablaCumplimiento } from "@/components/asociacion/tabla-cumplimiento";
import { tasaDeCumplimiento } from "@/lib/junta/rules";
import { descargarCSV } from "@/lib/junta/csv";
import { useJunta } from "@/lib/junta/context";

/**
 * Historial de cumplimiento: quién está al día, pendiente o en mora — por
 * puesto/comerciante. Sin ningún mecanismo de aval o garantía individual, y con
 * una nota explícita de para qué sirve a futuro: es la base de un eventual
 * acceso a microcrédito real, no una calificación que castiga.
 */
export default function CumplimientoPage() {
  const { asociacion, cuotas, usuarios } = useJunta();

  if (!asociacion) return null;

  const cumplimiento = tasaDeCumplimiento(cuotas);

  function exportarCSV() {
    descargarCSV(
      `cumplimiento-${asociacion!.codigoInvitacion}.csv`,
      ["Periodo", "Comerciante", "Puesto", "Monto", "Estado", "Fecha de pago"],
      cuotas.map((c) => {
        const u = usuarios.find((x) => x.id === c.comercianteId);
        return [
          c.periodo,
          u?.nombre ?? "Puesto sin registrar",
          u?.numeroPuesto ?? "—",
          c.monto,
          c.estado,
          c.fechaPago ?? "",
        ];
      })
    );
  }

  return (
    <div className="space-y-6">
      <Aparecer>
        <h1 className="text-display font-semibold text-marca-texto">
          Historial de cumplimiento
        </h1>
        <p className="mt-1 text-body text-marca-tenue">{asociacion.nombreMercado}</p>
      </Aparecer>

      <Aparecer retraso={0.05}>
        <div className="rounded-lg border-2 border-marca-primario bg-[#e9f0ec] p-5">
          <p className="text-support font-semibold text-[#1F5C3D]">
            Tasa de cumplimiento
          </p>
          <p className="mt-1 text-[40px] leading-none font-semibold text-marca-texto">
            {cumplimiento}%
          </p>
          <p className="mt-3 text-support text-marca-tenue">
            Porcentaje de cuotas al día sobre el total registrado.
          </p>
        </div>
      </Aparecer>

      <p className="flex gap-3 rounded-lg border border-marca-borde bg-marca-fondo p-4 text-body text-marca-texto">
        <Info size={24} weight="duotone" color="#1F5C3D" className="shrink-0" aria-hidden="true" />
        <span>
          Este historial es la base para un futuro acceso a microcrédito real. No
          hay ningún aval ni garantía individual detrás — el cumplimiento se
          construye pagando la cuota a tiempo, nada más.
        </span>
      </p>

      <div className="grid grid-cols-3 gap-3">
        <Button variant="outline" onClick={exportarCSV}>
          <DownloadSimple size={18} weight="bold" aria-hidden="true" />
          CSV (SUNAT)
        </Button>
        <Button
          variant="outline"
          onClick={() => alert("Exportar PDF: disponible próximamente.")}
        >
          <DownloadSimple size={18} weight="bold" aria-hidden="true" />
          PDF
        </Button>
        <Button
          variant="outline"
          onClick={() => alert("Exportar Excel: disponible próximamente.")}
        >
          <DownloadSimple size={18} weight="bold" aria-hidden="true" />
          Excel
        </Button>
      </div>

      <TablaCumplimiento cuotas={cuotas} usuarios={usuarios} />

      <p className="text-support text-marca-tenue">
        {cuotas.length} {cuotas.length === 1 ? "cuota registrada" : "cuotas registradas"}
        {" "}en total.
      </p>
    </div>
  );
}
