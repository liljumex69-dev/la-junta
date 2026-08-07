"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoogleLogo } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/minka/spinner";

/** Acceso de una persona que ya tiene cuenta. Mismo patrón que el registro. */
export function EntrarForm() {
  const router = useRouter();
  const [telefono, setTelefono] = useState("");
  const [entrando, setEntrando] = useState(false);

  const digitos = telefono.replace(/\D/g, "");
  const valido = digitos.length === 9;

  function formatear(valor: string) {
    const d = valor.replace(/\D/g, "").slice(0, 9);
    return d.replace(/(\d{3})(\d{0,3})(\d{0,3})/, (_, a, b, c) =>
      [a, b, c].filter(Boolean).join(" ")
    );
  }

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    if (!valido || entrando) return;
    setEntrando(true);

    // TODO: conectar a smart contract — autenticar y recuperar la wallet asociada
    // a este número para poder firmar las operaciones de sus juntas.
    await new Promise((r) => setTimeout(r, 900));
    router.push("/inicio");
  }

  return (
    <div className="space-y-6">
      <form onSubmit={entrar} className="space-y-4">
        <div>
          <Label htmlFor="telefono-entrar" className="text-body font-semibold">
            Tu número de celular
          </Label>
          <div className="mt-2 flex gap-2">
            <span className="grid h-12 w-16 shrink-0 place-items-center rounded-md border-2 border-minka-border bg-[#ece4d8] text-body font-semibold text-minka-text">
              +51
            </span>
            <Input
              id="telefono-entrar"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="987 654 321"
              value={telefono}
              onChange={(e) => setTelefono(formatear(e.target.value))}
            />
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={!valido || entrando}>
          {entrando ? (
            <>
              <Spinner />
              Entrando…
            </>
          ) : (
            "Entrar"
          )}
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-minka-border" />
        <span className="text-support text-minka-muted">o</span>
        <span className="h-px flex-1 bg-minka-border" />
      </div>

      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full"
        onClick={() => router.push("/inicio")}
      >
        <GoogleLogo size={22} weight="bold" aria-hidden="true" />
        Continuar con Google
      </Button>
    </div>
  );
}
