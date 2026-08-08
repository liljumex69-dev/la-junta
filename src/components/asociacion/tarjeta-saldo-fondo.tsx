import { Vault } from "@phosphor-icons/react/ssr";

import { soles } from "@/lib/junta/format";

/**
 * Saldo del fondo, siempre visible.
 *
 * El documento lo pide en la pantalla de inicio y en el panel del fondo: es el
 * primer número que cualquier miembro de la asociación necesita ver, y transmitir
 * transparencia significa que nunca está escondido detrás de un toque.
 */
export function TarjetaSaldoFondo({ saldo }: { saldo: number }) {
  return (
    <div className="rounded-lg border-2 border-marca-primario bg-[#e9f0ec] p-5">
      <div className="flex items-center gap-2">
        <Vault size={24} weight="duotone" color="#1F5C3D" aria-hidden="true" />
        <p className="text-body font-semibold text-[#1F5C3D]">
          Saldo del fondo, ahora mismo
        </p>
      </div>
      <p className="mt-2 text-[40px] leading-none font-semibold text-marca-texto">
        {soles(saldo)}
      </p>
      <p className="mt-3 text-support text-marca-tenue">
        Protegido con firma múltiple. Verificable por cualquier miembro, en todo
        momento.
      </p>
    </div>
  );
}
