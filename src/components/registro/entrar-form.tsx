"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Warning } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/common/spinner";
import { LogoGoogle } from "@/components/common/logo-google";
import { ETIQUETA_CARGO } from "@/lib/junta/format";
import { useJunta } from "@/lib/junta/context";

/**
 * Acceso de alguien que ya tiene cuenta.
 *
 * En el prototipo no hay contraseña ni verificación real: el número resuelve contra
 * los perfiles guardados en memoria. Debajo se listan los perfiles disponibles para
 * poder recorrer la demo desde cada rol sin memorizar números — esa sección
 * desaparece en producción.
 */
export function EntrarForm() {
  const router = useRouter();
  const { usuarios, iniciarSesion, iniciarSesionPorTelefono } = useJunta();

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

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    if (!valido || entrando) return;
    setEntrando(true);
    setError(null);

    // TODO: conectar a Safe/smart contract — autenticar de verdad y recuperar el
    // firmante o beneficiario del Safe asociado a este número.
    await new Promise((r) => setTimeout(r, 900));

    const encontrado = iniciarSesionPorTelefono(digitos);
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
      <form onSubmit={entrar} className="space-y-4">
        <div>
          <Label htmlFor="telefono-entrar" className="text-body font-semibold">
            Tu número de celular
          </Label>
          <div className="mt-2 flex gap-2">
            <span className="grid h-12 w-16 shrink-0 place-items-center rounded-md border-2 border-marca-borde bg-[#ece5d3] text-body font-semibold text-marca-texto">
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
            <p className="mt-3 flex gap-2 text-body font-semibold text-marca-peligro">
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
        <span className="h-px flex-1 bg-marca-borde" />
        <span className="text-support text-marca-tenue">o</span>
        <span className="h-px flex-1 bg-marca-borde" />
      </div>

      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full"
        onClick={() => {
          if (usuarios[0]) iniciarSesion(usuarios[0].id);
          router.push("/inicio");
        }}
      >
        <LogoGoogle />
        Continuar con Google
      </Button>

      {/* Solo para recorrer la demo desde cada rol. */}
      <div className="rounded-lg border border-marca-borde bg-marca-superficie p-4">
        <p className="text-support font-semibold text-marca-tenue">
          Perfiles de prueba (demo)
        </p>
        <ul className="mt-3 space-y-2">
          {usuarios.map((u) => (
            <li key={u.id}>
              <button
                type="button"
                onClick={() => {
                  iniciarSesion(u.id);
                  router.push("/inicio");
                }}
                className="flex min-h-[56px] w-full items-center gap-3 rounded-md border border-marca-borde bg-marca-fondo px-3 text-left transition-colors hover:bg-[#ece5d3]"
              >
                <span
                  className="grid size-10 shrink-0 place-items-center rounded-full bg-[#e9f0ec] text-support font-semibold text-marca-primario"
                  aria-hidden="true"
                >
                  {u.iniciales}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-body font-semibold text-marca-texto">
                    {u.nombre}
                  </span>
                  <span className="block text-support text-marca-tenue">
                    +51 {u.telefono} ·{" "}
                    {u.rol === "directivo"
                      ? ETIQUETA_CARGO[u.cargo ?? "vocal"]
                      : `Puesto ${u.numeroPuesto ?? "—"}`}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
