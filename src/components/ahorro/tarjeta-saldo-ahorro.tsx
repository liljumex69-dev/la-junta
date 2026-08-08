import { Lock, PiggyBank } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { soles } from "@/lib/junta/format";

/**
 * Saldo del ahorro personal: grande y claro, sin métricas alrededor — el
 * documento pide que se lea "de un vistazo", a diferencia del dashboard del
 * directorio. El botón de retiro está visible pero deshabilitado: el mecanismo
 * real todavía está "pendiente de definir con el equipo" según el documento de
 * producto, así que se muestra el hueco en vez de inventar un flujo.
 */
export function TarjetaSaldoAhorro({ saldo }: { saldo: number }) {
  return (
    <div className="rounded-lg border-2 border-marca-secundario bg-[#f5e9d3] p-5">
      <div className="flex items-center gap-2">
        <PiggyBank size={24} weight="duotone" color="#7a5a26" aria-hidden="true" />
        <p className="text-body font-semibold text-[#7a5a26]">Mi ahorro personal</p>
      </div>
      <p className="mt-2 text-[40px] leading-none font-semibold text-marca-texto">
        {soles(saldo)}
      </p>
      <p className="mt-3 text-support text-marca-tenue">
        Separado del fondo colectivo. Solo tú lo controlas — ninguna firma de
        terceros necesaria para depositar.
      </p>
      <Button
        size="lg"
        variant="outline"
        disabled
        className="mt-4 w-full opacity-70"
        aria-disabled="true"
      >
        <Lock size={18} weight="bold" aria-hidden="true" />
        Retirar — Próximamente
      </Button>
    </div>
  );
}
