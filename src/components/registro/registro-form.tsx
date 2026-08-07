"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Envelope } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/minka/spinner";
import { LogoGoogle } from "@/components/minka/logo-google";

/**
 * Registro.
 *
 * El número de celular es la opción principal: es el mismo identificador que este
 * público ya usa en Yape, así que no hay nada nuevo que aprender. Google queda como
 * alternativa rápida y el correo como respaldo, nunca como protagonista.
 *
 * En ningún momento se menciona "wallet", "cripto", "clave privada" ni "frase semilla":
 * la wallet se crea en segundo plano y el usuario no necesita saber que existe.
 */
export function RegistroForm({
  invitadoPor,
  codigoJunta,
}: {
  invitadoPor?: string;
  codigoJunta?: string;
}) {
  const router = useRouter();
  const [telefono, setTelefono] = useState("");
  const [enviando, setEnviando] = useState(false);

  const digitos = telefono.replace(/\D/g, "");
  const valido = digitos.length === 9;

  function formatear(valor: string) {
    const d = valor.replace(/\D/g, "").slice(0, 9);
    return d.replace(/(\d{3})(\d{0,3})(\d{0,3})/, (_, a, b, c) =>
      [a, b, c].filter(Boolean).join(" ")
    );
  }

  async function enviarCodigo(e: React.FormEvent) {
    e.preventDefault();
    if (!valido || enviando) return;
    setEnviando(true);

    // TODO: conectar a smart contract — al confirmar el código se debe crear la
    // cuenta y desplegar/derivar la wallet del usuario en Arbitrum en segundo plano,
    // sin exponer nunca la clave ni pedirle al usuario que la respalde.
    await new Promise((r) => setTimeout(r, 900));

    const params = new URLSearchParams({ tel: digitos });
    if (invitadoPor) params.set("invita", invitadoPor);
    if (codigoJunta) params.set("junta", codigoJunta);
    router.push(`/registro/codigo?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      {invitadoPor ? (
        <p className="rounded-lg border border-minka-secondary bg-[#fbeed8] p-4 text-body text-minka-text">
          <strong className="font-semibold">{invitadoPor}</strong> te invitó a
          Minka. Cuando completes tu registro, van a quedar conectados en tu
          historial.
        </p>
      ) : null}

      <form onSubmit={enviarCodigo} className="space-y-4">
        <div>
          <Label htmlFor="telefono" className="text-body font-semibold">
            Tu número de celular
          </Label>
          <div className="mt-2 flex gap-2">
            <span className="grid h-12 w-16 shrink-0 place-items-center rounded-md border-2 border-minka-border bg-[#ece4d8] text-body font-semibold text-minka-text">
              +51
            </span>
            <Input
              id="telefono"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="987 654 321"
              value={telefono}
              onChange={(e) => setTelefono(formatear(e.target.value))}
              aria-describedby="ayuda-telefono"
            />
          </div>
          <p id="ayuda-telefono" className="mt-2 text-support text-minka-muted">
            Te enviamos un código por mensaje para confirmar que es tuyo.
          </p>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={!valido || enviando}>
          {enviando ? (
            <>
              <Spinner />
              Enviando tu código…
            </>
          ) : (
            "Continuar"
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
          const params = new URLSearchParams();
          if (invitadoPor) params.set("invita", invitadoPor);
          if (codigoJunta) params.set("junta", codigoJunta);
          router.push(`/registro/perfil?${params.toString()}`);
        }}
      >
        <LogoGoogle />
        Continuar con Google
      </Button>

      {/* El correo es respaldo: se ofrece como enlace, no como botón, para que no
          compita visualmente con el celular ni con Google. */}
      <p className="text-center">
        <Link
          href="/registro/correo"
          className="touch-target inline-flex items-center gap-2 rounded-md px-2 text-body font-semibold text-minka-primary underline underline-offset-4"
        >
          <Envelope size={20} weight="duotone" aria-hidden="true" />
          Prefiero usar mi correo
        </Link>
      </p>

      <p className="text-support text-minka-muted">
        Al continuar aceptas las condiciones de uso de Minka. Ya tienes cuenta{" "}
        <Link
          href="/entrar"
          className="font-semibold text-minka-primary underline underline-offset-4"
        >
          entra aquí
        </Link>
        .
      </p>
    </div>
  );
}
