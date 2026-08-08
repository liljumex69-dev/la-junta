"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/common/spinner";
import { cn } from "@/lib/utils";

const LARGO = 6;

/**
 * Verificación del código enviado por mensaje.
 *
 * Seis casillas grandes en vez de un campo único: es el patrón que este público ya
 * reconoce de la banca por celular. En el prototipo cualquier código de 6 dígitos
 * es válido.
 */
export function CodigoForm({
  telefono,
  codigoAsociacion,
}: {
  telefono: string;
  codigoAsociacion?: string;
}) {
  const router = useRouter();
  const [digitos, setDigitos] = useState<string[]>(Array(LARGO).fill(""));
  const [verificando, setVerificando] = useState(false);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const codigo = digitos.join("");
  const completo = codigo.length === LARGO;

  function escribir(i: number, valor: string) {
    const limpio = valor.replace(/\D/g, "");
    if (!limpio) {
      setDigitos((d) => d.map((v, k) => (k === i ? "" : v)));
      return;
    }
    if (limpio.length > 1) {
      const nuevos = limpio.slice(0, LARGO).split("");
      setDigitos(Array.from({ length: LARGO }, (_, k) => nuevos[k] ?? ""));
      refs.current[Math.min(nuevos.length, LARGO - 1)]?.focus();
      return;
    }
    setDigitos((d) => d.map((v, k) => (k === i ? limpio : v)));
    if (i < LARGO - 1) refs.current[i + 1]?.focus();
  }

  function retroceder(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digitos[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  }

  async function verificar(e: React.FormEvent) {
    e.preventDefault();
    if (!completo || verificando) return;
    setVerificando(true);

    // TODO: conectar a Safe/smart contract — validar el código con el proveedor de
    // SMS antes de crear la identidad del usuario.
    await new Promise((r) => setTimeout(r, 900));

    const params = new URLSearchParams({ tel: telefono.replace(/\D/g, "") });
    if (codigoAsociacion) params.set("asociacion", codigoAsociacion);
    router.push(`/registro/perfil?${params.toString()}`);
  }

  return (
    <form onSubmit={verificar} className="space-y-6">
      <fieldset>
        <legend className="text-body font-semibold text-marca-texto">
          Escribe el código de 6 dígitos
        </legend>
        <div className="mt-3 flex justify-between gap-2">
          {digitos.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              maxLength={LARGO}
              value={d}
              onChange={(e) => escribir(i, e.target.value)}
              onKeyDown={(e) => retroceder(i, e)}
              aria-label={`Dígito ${i + 1} de ${LARGO}`}
              className={cn(
                "h-14 w-full min-w-0 rounded-md border-2 bg-marca-superficie text-center text-[24px] font-semibold text-marca-texto outline-none transition-colors",
                d ? "border-marca-primario" : "border-marca-borde",
                "focus-visible:border-marca-primario focus-visible:ring-3 focus-visible:ring-marca-primario/25"
              )}
            />
          ))}
        </div>
      </fieldset>

      <p className="text-body text-marca-tenue">
        Lo enviamos al <strong className="text-marca-texto">+51 {telefono}</strong>.
      </p>

      <Button type="submit" size="lg" className="w-full" disabled={!completo || verificando}>
        {verificando ? (
          <>
            <Spinner />
            Confirmando tu número…
          </>
        ) : (
          "Confirmar"
        )}
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="lg"
        className="w-full"
        onClick={() => refs.current[0]?.focus()}
      >
        No me llegó, enviar de nuevo
      </Button>
    </form>
  );
}
