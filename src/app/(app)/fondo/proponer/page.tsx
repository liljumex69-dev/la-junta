"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Warning } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/common/spinner";
import { esDirectivo, formatoUmbral } from "@/lib/junta/rules";
import { useJunta } from "@/lib/junta/context";

/**
 * Proponer un gasto del fondo.
 *
 * Solo directivos. El documento es explícito: al enviar, la propuesta queda
 * registrada pero no mueve fondos todavía — necesita el umbral de firmas para
 * ejecutarse, así que este formulario no tiene nada de "confirmar pago".
 */
export default function ProponerGastoPage() {
  const router = useRouter();
  const { usuario, asociacion, proponerGasto } = useJunta();

  const [monto, setMonto] = useState("");
  const [categoria, setCategoria] = useState(asociacion?.categorias[0] ?? "Otras");
  const [motivo, setMotivo] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (!usuario || !asociacion) return null;

  if (!esDirectivo(usuario)) {
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <Warning size={48} weight="duotone" color="#B8863B" aria-hidden="true" />
        <p className="mt-4 max-w-sm text-body text-marca-tenue">
          Solo el directorio puede proponer gastos del fondo colectivo.
        </p>
        <Button asChild size="lg" className="mt-7">
          <Link href="/fondo">Volver al fondo</Link>
        </Button>
      </div>
    );
  }

  const montoNumero = Number(monto);
  const valido = montoNumero > 0 && motivo.trim().length >= 10;

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!valido || enviando) return;
    setEnviando(true);

    // TODO: conectar a Safe/smart contract — crear la transacción propuesta en el
    // Safe (sin ejecutar) y notificar a los demás firmantes.
    await new Promise((r) => setTimeout(r, 900));

    const propuesta = proponerGasto({ monto: montoNumero, motivo: motivo.trim(), categoria });
    setEnviando(false);
    router.push(`/fondo/propuesta/${propuesta.id}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-display font-semibold text-marca-texto">
          Proponer gasto
        </h1>
        <p className="mt-1 text-body text-marca-tenue">
          Necesita {asociacion ? formatoUmbral(asociacion) : ""} firmas para
          ejecutarse. No mueve fondos hasta llegar al umbral.
        </p>
      </div>

      <form onSubmit={enviar} className="space-y-5">
        <div>
          <Label htmlFor="monto" className="text-body font-semibold">
            Monto
          </Label>
          <div className="relative mt-2">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-body font-semibold text-marca-tenue">
              S/
            </span>
            <Input
              id="monto"
              type="number"
              inputMode="decimal"
              min={1}
              step="0.01"
              placeholder="0.00"
              className="pl-10 text-h3 font-semibold"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="categoria" className="text-body font-semibold">
            Categoría
          </Label>
          <Select value={categoria} onValueChange={setCategoria}>
            <SelectTrigger
              id="categoria"
              className="mt-2 h-12 w-full border-2 border-marca-borde bg-marca-superficie text-body"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {asociacion.categorias.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="motivo" className="text-body font-semibold">
            Motivo
          </Label>
          <Textarea
            id="motivo"
            className="mt-2 min-h-28"
            placeholder="Explica en qué se usará el dinero y por qué es necesario ahora."
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            aria-describedby="ayuda-motivo"
          />
          <p id="ayuda-motivo" className="mt-2 text-support text-marca-tenue">
            Los demás directivos ven este motivo antes de firmar.
          </p>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={!valido || enviando}>
          {enviando ? (
            <>
              <Spinner />
              Registrando propuesta…
            </>
          ) : (
            "Enviar propuesta"
          )}
        </Button>
      </form>
    </div>
  );
}
