"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Envelope } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/common/spinner";
import { LogoGoogle } from "@/components/common/logo-google";

/**
 * Registro.
 *
 * El número de celular es la opción principal: es el mismo identificador que este
 * público ya usa en Yape y Plin para pagar la cuota, así que no hay nada nuevo que
 * aprender. Google queda como alternativa rápida y el correo como respaldo, nunca
 * como protagonista.
 *
 * En ningún momento se menciona "wallet", "gas" ni fricción cripto: la custodia del
 * fondo vive en un Safe que el usuario nunca necesita entender ni administrar.
 */
export function RegistroForm({
  codigoAsociacion,
}: {
  codigoAsociacion?: string;
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

  function conParametros(ruta: string) {
    const params = new URLSearchParams({ tel: digitos });
    if (codigoAsociacion) params.set("asociacion", codigoAsociacion);
    return `${ruta}?${params.toString()}`;
  }

  async function enviarCodigo(e: React.FormEvent) {
    e.preventDefault();
    if (!valido || enviando) return;
    setEnviando(true);

    // TODO: conectar a Safe/smart contract — al confirmar el código se crea la
    // identidad del usuario. La wallet o firmante del Safe se prepara en segundo
    // plano, sin exponer nunca una clave ni pedirle al usuario que la respalde.
    await new Promise((r) => setTimeout(r, 900));

    router.push(conParametros("/registro/codigo"));
  }

  return (
    <div className="space-y-6">
      {codigoAsociacion ? (
        <p className="rounded-lg border border-marca-secundario bg-[#f5e9d3] p-4 text-body text-marca-texto">
          Te invitaron a unirte a una asociación con el código{" "}
          <strong className="font-semibold">{codigoAsociacion}</strong>. Termina tu
          registro y quedas dentro.
        </p>
      ) : null}

      <form onSubmit={enviarCodigo} className="space-y-4">
        <div>
          <Label htmlFor="telefono" className="text-body font-semibold">
            Tu número de celular
          </Label>
          <div className="mt-2 flex gap-2">
            <span className="grid h-12 w-16 shrink-0 place-items-center rounded-md border-2 border-marca-borde bg-[#ece5d3] text-body font-semibold text-marca-texto">
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
          <p id="ayuda-telefono" className="mt-2 text-support text-marca-tenue">
            Te enviamos un código por mensaje para confirmar que es tuyo. Es el
            mismo número con el que pagas tu cuota por Yape o Plin.
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
          const params = new URLSearchParams();
          if (codigoAsociacion) params.set("asociacion", codigoAsociacion);
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
          href={
            codigoAsociacion
              ? `/registro/correo?asociacion=${codigoAsociacion}`
              : "/registro/correo"
          }
          className="touch-target inline-flex items-center gap-2 rounded-md px-2 text-body font-semibold text-marca-primario underline underline-offset-4"
        >
          <Envelope size={20} weight="duotone" aria-hidden="true" />
          Prefiero usar mi correo
        </Link>
      </p>

      <p className="text-support text-marca-tenue">
        Al continuar aceptas las condiciones de uso de Junta. Ya tienes cuenta{" "}
        <Link
          href="/entrar"
          className="font-semibold text-marca-primario underline underline-offset-4"
        >
          entra aquí
        </Link>
        .
      </p>
    </div>
  );
}
