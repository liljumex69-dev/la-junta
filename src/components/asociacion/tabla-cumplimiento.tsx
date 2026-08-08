import { Badge } from "@/components/ui/badge";
import { ETIQUETA_ESTADO_CUOTA, formatoPeriodo, soles } from "@/lib/junta/format";
import type { CuotaComerciante, Usuario } from "@/lib/junta/types";

const VARIANTE_ESTADO: Record<CuotaComerciante["estado"], "success" | "late" | "danger"> = {
  pagado: "success",
  pendiente: "late",
  mora: "danger",
};

/**
 * Historial de cumplimiento por puesto/comerciante: cuotas al día, pendientes o en
 * mora. Sin ningún mecanismo de garantía o aval individual — ese concepto no
 * existe en Junta. Es, en cambio, la base declarada para un futuro acceso a
 * microcrédito real.
 */
export function TablaCumplimiento({
  cuotas,
  usuarios,
}: {
  cuotas: CuotaComerciante[];
  usuarios: Usuario[];
}) {
  if (cuotas.length === 0) {
    return (
      <p className="rounded-lg border border-marca-borde bg-marca-superficie p-4 text-support text-marca-tenue">
        Todavía no hay cuotas registradas.
      </p>
    );
  }

  function nombreDe(comercianteId: string): string {
    return usuarios.find((u) => u.id === comercianteId)?.nombre ?? "Puesto sin registrar";
  }

  function puestoDe(comercianteId: string): string {
    return usuarios.find((u) => u.id === comercianteId)?.numeroPuesto ?? "—";
  }

  const ordenadas = [...cuotas].sort((a, b) => b.periodo.localeCompare(a.periodo));

  return (
    <div className="overflow-x-auto rounded-lg border border-marca-borde">
      <table className="w-full min-w-[520px] border-collapse text-body">
        <thead>
          <tr className="border-b border-marca-borde bg-marca-fondo text-support font-semibold text-marca-tenue">
            <th className="p-3 text-left">Periodo</th>
            <th className="p-3 text-left">Comerciante</th>
            <th className="p-3 text-left">Puesto</th>
            <th className="p-3 text-right">Monto</th>
            <th className="p-3 text-right">Estado</th>
          </tr>
        </thead>
        <tbody>
          {ordenadas.map((c) => (
            <tr key={c.id} className="border-b border-marca-borde last:border-0 odd:bg-marca-superficie">
              <td className="p-3 whitespace-nowrap text-marca-texto">
                {formatoPeriodo(c.periodo)}
              </td>
              <td className="p-3 text-marca-texto">{nombreDe(c.comercianteId)}</td>
              <td className="p-3 text-marca-tenue">{puestoDe(c.comercianteId)}</td>
              <td className="p-3 text-right font-semibold text-marca-texto">
                {soles(c.monto)}
              </td>
              <td className="p-3 text-right">
                <Badge variant={VARIANTE_ESTADO[c.estado]}>
                  {ETIQUETA_ESTADO_CUOTA[c.estado]}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
