"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Warning } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/minka/spinner";
import { LogoGoogle } from "@/components/minka/logo-google";
import { nivelDe } from "@/lib/minka/niveles";
import { useSesion } from "@/lib/minka/prototipo/sesion";

/**
 * Acceso de alguien que ya tiene cuenta.
 *
 * En el prototipo no hay contraseña ni verificación real: el número resuelve contra
 * los perfiles guardados. Debajo se listan los perfiles disponibles para poder
 * recorrer la demo desde cada punto de vista sin memorizar números — esa sección
 * desaparece en producción.
 */
export function EntrarForm() {
  const router = useRouter();
  const { usuarios, entrar, entrarPorTelefono } = useSesion();

  const [telefono, setTelefono] = useState("");
  const [entrando, setEntrando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const digitos = telefono.replace(/\D/g, "");
  const valido = digitos.length === 9;

  function formatear(valor: string) {
    const d = valor.replace(/\D/g, "").slice(0, 9);
    return d.replace(/(\d{3})(\d{0,3})(\d{0,3})/, (_, a, b, c) =>
      [a, b, c].filter(Boolean).join(" ")
    );
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!valido || entrando) return;
    setEntrando(true);
    setError(null);

    // TODO: conectar a backend — autenticar de verdad y recuperar la wallet asociada.
    await new Promise((r) => setTimeout(r, 900));

    const encontrado = entrarPorTelefono(digitos);
    if (!encontrado) {
      setError(
        "No encontramos una cuenta con ese número. Revísalo o crea una cuenta nueva."
      );
      setEntrando(false);
      return;
    }
    router.push("/inicio");
  }

  return (
    <div className="space-y-6">
      <form onSubmit={enviar} className="space-y-4">
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
              aria-invalid={error ? true : undefined}
            />
          </div>
          {error ? (
            <p className="mt-3 flex gap-2 text-body font-semibold text-minka-danger">
              <Warning size={22} weight="fill" className="shrink-0" aria-hidden="true" />
              {error}
            </p>
          ) : null}
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
        onClick={() => {
          if (usuarios[0]) entrar(usuarios[0].id);
          router.push("/inicio");
        }}
      >
        <LogoGoogle />
        Continuar con Google
      </Button>

      {/* Solo para recorrer la demo desde cada punto de vista. */}
      <div className="rounded-lg border border-minka-border bg-minka-surface p-4">
        <p className="text-support font-semibold text-minka-muted">
          Perfiles de prueba (demo)
        </p>
        <ul className="mt-3 space-y-2">
          {usuarios.map((u) => {
            const nivel = nivelDe(u.score);
            return (
              <li key={u.id}>
                <button
                  type="button"
                  onClick={() => {
                    entrar(u.id);
                    router.push("/inicio");
                  }}
                  className="flex min-h-[56px] w-full items-center gap-3 rounded-md border border-minka-border bg-minka-bg px-3 text-left transition-colors hover:bg-[#f0e8db]"
                >
                  <span
                    className="grid size-10 shrink-0 place-items-center rounded-full text-support font-semibold"
                    style={{ backgroundColor: nivel.fondo, color: nivel.color }}
                    aria-hidden="true"
                  >
                    {u.iniciales}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-body font-semibold text-minka-text">
                      {u.nombre}
                    </span>
                    <span className="block text-support text-minka-muted">
                      +51 {u.telefono} · {nivel.nombre}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
