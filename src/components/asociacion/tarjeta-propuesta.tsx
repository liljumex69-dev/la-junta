import Link from "next/link";
import { CheckCircle, Info, Signature } from "@phosphor-icons/react/ssr";

import { Badge } from "@/components/ui/badge";
import { soles } from "@/lib/junta/format";
import { firmasFaltantes, puedeEjecutarse, yaFirmo } from "@/lib/junta/rules";
import type { PropuestaGasto } from "@/lib/junta/types";

/**
 * Una propuesta de gasto, con su conteo de firmas siempre visible.
 *
 * El contador ("2 de 3") es el elemento central: es lo que demuestra, en cada
 * pantalla donde aparece, que un gasto no se mueve hasta juntar el acuerdo de
 * varios directivos.
 */
export function TarjetaPropuesta({
  propuesta,
  usuarioId,
  esDirectivo,
}: {
  propuesta: PropuestaGasto;
  usuarioId?: string;
  esDirectivo: boolean;
}) {
  const faltan = firmasFaltantes(propuesta);
  const completa = puedeEjecutarse(propuesta);
  const yo_firme = usuarioId ? yaFirmo(propuesta, usuarioId) : false;

  return (
    <div className="rounded-lg border border-marca-borde bg-marca-superficie p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {/* Es un gasto — dinero que sale del fondo si se junta el umbral —
              por eso va en rojo igual que en el historial de movimientos. */}
          <p className="text-h3 font-semibold text-marca-peligro">
            {soles(propuesta.monto)}
          </p>
          <p className="mt-0.5 text-support text-marca-tenue">
            {propuesta.categoria} · propuesto por {propuesta.propuestoPorNombre}
          </p>
        </div>
        {propuesta.estado === "ejecutada" ? (
          <Badge variant="success">Ejecutada</Badge>
        ) : (
          <Badge variant={completa ? "success" : "outline"}>
            {propuesta.firmas.length} de {propuesta.umbralRequerido} firmas
          </Badge>
        )}
      </div>

      <p className="mt-2 text-body text-marca-texto">{propuesta.motivo}</p>

      {propuesta.estado === "pendiente" ? (
        <div
          className="mt-3 h-2 w-full overflow-hidden rounded-sm bg-[#ece5d3]"
          role="progressbar"
          aria-valuenow={propuesta.firmas.length}
          aria-valuemin={0}
          aria-valuemax={propuesta.umbralRequerido}
          aria-label={`${propuesta.firmas.length} de ${propuesta.umbralRequerido} firmas`}
        >
          <span
            className="block h-full rounded-sm bg-marca-primario transition-[width] duration-200"
            style={{
              width: `${(propuesta.firmas.length / propuesta.umbralRequerido) * 100}%`,
            }}
          />
        </div>
      ) : null}

      {propuesta.estado === "pendiente" ? (
        esDirectivo ? (
          yo_firme ? (
            <p className="mt-3 flex items-center gap-2 text-support font-semibold text-marca-exito">
              <CheckCircle size={18} weight="fill" aria-hidden="true" />
              Ya firmaste. Faltan {faltan} {faltan === 1 ? "firma" : "firmas"}.
            </p>
          ) : (
            <Link
              href={`/fondo/propuesta/${propuesta.id}`}
              className="touch-target mt-3 flex items-center gap-2 rounded-md text-support font-semibold text-marca-primario underline underline-offset-4"
            >
              <Signature size={18} weight="duotone" aria-hidden="true" />
              Revisar y firmar
            </Link>
          )
        ) : (
          // Un comerciante no firma — solo el directorio lo hace — pero merece la
          // misma claridad: qué está pasando y por qué no hay un botón para él acá.
          <p className="mt-3 flex items-center gap-2 text-support text-marca-tenue">
            <Info size={18} weight="duotone" aria-hidden="true" />
            Firman los directivos. Faltan {faltan} {faltan === 1 ? "firma" : "firmas"} para ejecutarse.
          </p>
        )
      ) : null}
    </div>
  );
}
