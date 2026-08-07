"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/minka/spinner";

/** Registro por correo: opción de respaldo, para quien no quiere dar su celular. */
export function CorreoForm() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [enviando, setEnviando] = useState(false);

  const valido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!valido || enviando) return;
    setEnviando(true);

    // TODO: conectar a smart contract — misma creación de cuenta y wallet que en el
    // registro por celular, cambiando solo el método de verificación.
    await new Promise((r) => setTimeout(r, 900));
    router.push("/registro/perfil");
  }

  return (
    <form onSubmit={enviar} className="space-y-6">
      <div>
        <Label htmlFor="correo" className="text-body font-semibold">
          Tu correo electrónico
        </Label>
        <Input
          id="correo"
          type="email"
          className="mt-2"
          autoComplete="email"
          placeholder="rosa@correo.com"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          aria-describedby="ayuda-correo"
        />
        <p id="ayuda-correo" className="mt-2 text-support text-minka-muted">
          Te enviamos un enlace para confirmar que es tuyo.
        </p>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={!valido || enviando}>
        {enviando ? (
          <>
            <Spinner />
            Enviando tu enlace…
          </>
        ) : (
          "Continuar"
        )}
      </Button>

      <p className="text-center">
        <Link
          href="/registro"
          className="touch-target inline-flex items-center rounded-md px-2 text-body font-semibold text-minka-primary underline underline-offset-4"
        >
          Mejor usar mi número de celular
        </Link>
      </p>
    </form>
  );
}
