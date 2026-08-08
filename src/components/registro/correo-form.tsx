"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/common/spinner";

/** Registro por correo: opción de respaldo, para quien no quiere dar su celular. */
export function CorreoForm({ codigoAsociacion }: { codigoAsociacion?: string }) {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [enviando, setEnviando] = useState(false);

  const valido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!valido || enviando) return;
    setEnviando(true);

    // TODO: conectar a Safe/smart contract — misma creación de identidad que en el
    // registro por celular, cambiando solo el método de verificación.
    await new Promise((r) => setTimeout(r, 900));

    const params = new URLSearchParams();
    if (codigoAsociacion) params.set("asociacion", codigoAsociacion);
    router.push(`/registro/perfil?${params.toString()}`);
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
          placeholder="elena@correo.com"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          aria-describedby="ayuda-correo"
        />
        <p id="ayuda-correo" className="mt-2 text-support text-marca-tenue">
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
          className="touch-target inline-flex items-center rounded-md px-2 text-body font-semibold text-marca-primario underline underline-offset-4"
        >
          Mejor usar mi número de celular
        </Link>
      </p>
    </form>
  );
}
