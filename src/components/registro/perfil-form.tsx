"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, UsersThree } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/minka/spinner";
import { SCORE_INICIAL, nivelDe } from "@/lib/minka/niveles";
import { useSesion } from "@/lib/minka/prototipo/sesion";

/**
 * Último paso del registro: cómo se va a llamar la persona dentro de sus juntas.
 *
 * Aquí se crea la cuenta de verdad en el estado del prototipo, con score neutral e
 * historial vacío. Si venía de un enlace de invitación, además queda inscrita en la
 * junta sin tener que buscar dónde escribir el código.
 */
export function PerfilForm({
  telefono,
  codigoJunta,
  invitadoPor,
}: {
  telefono?: string;
  codigoJunta?: string;
  invitadoPor?: string;
}) {
  const router = useRouter();
  const { registrar, buscarPorCodigo, unirseAJunta } = useSesion();

  const [nombre, setNombre] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [listo, setListo] = useState(false);
  const [juntaNombre, setJuntaNombre] = useState<string | null>(null);

  const valido = nombre.trim().length >= 3;
  const nivelInicial = nivelDe(SCORE_INICIAL);

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (!valido || guardando) return;
    setGuardando(true);

    // TODO: conectar a backend/contrato — crear la cuenta y derivar la wallet en
    // segundo plano, con score neutral inicial y la referencia de quién invitó.
    await new Promise((r) => setTimeout(r, 900));

    registrar({
      nombre,
      telefono: telefono || "900 000 000",
    });

    // Si llegó por un enlace de invitación, entra directo a la junta.
    if (codigoJunta) {
      const junta = buscarPorCodigo(codigoJunta);
      if (junta) {
        unirseAJunta(junta);
        setJuntaNombre(junta.nombre);
      }
    }

    setGuardando(false);
    setListo(true);
  }

  // Momento de éxito: un instante visual positivo antes de continuar.
  useEffect(() => {
    if (!listo) return;
    const id = window.setTimeout(() => router.push("/inicio"), 1600);
    return () => window.clearTimeout(id);
  }, [listo, router]);

  if (listo) {
    return (
      <div
        className="flex flex-col items-center py-10 text-center"
        role="status"
        aria-live="polite"
      >
        <span className="grid size-20 place-items-center rounded-full bg-[#e6ecdf]">
          <CheckCircle size={52} weight="fill" color="#4B6B3A" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-h2 font-semibold text-minka-text">
          Tu cuenta está lista
        </h2>
        <p className="mt-2 max-w-sm text-body text-minka-muted">
          Bienvenida a Minka, {nombre.trim().split(" ")[0]}.
          {juntaNombre
            ? ` Ya quedaste dentro de “${juntaNombre}”.`
            : " Te llevamos a tu inicio."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={guardar} className="space-y-6">
      {invitadoPor ? (
        <p className="rounded-lg border border-minka-secondary bg-[#fbeed8] p-4 text-body text-minka-text">
          Te invitó <strong className="font-semibold">{invitadoPor}</strong>.
        </p>
      ) : null}

      <div>
        <Label htmlFor="nombre" className="text-body font-semibold">
          ¿Cómo te llamas?
        </Label>
        <Input
          id="nombre"
          className="mt-2"
          autoComplete="name"
          placeholder="Rosa Quispe"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          aria-describedby="ayuda-nombre"
        />
        <p id="ayuda-nombre" className="mt-2 text-support text-minka-muted">
          Así te van a ver las personas de tus juntas. Usa el nombre con el que te
          conocen.
        </p>
      </div>

      <div className="flex gap-3 rounded-lg border border-minka-border bg-minka-surface p-4">
        <UsersThree
          size={28}
          weight="duotone"
          color="#BF312A"
          className="shrink-0"
          aria-hidden="true"
        />
        <p className="text-body text-minka-text">
          Empiezas en nivel{" "}
          <strong className="font-semibold">{nivelInicial.nombre}</strong>, sin nada en
          contra. Con cada cuota puntual tu historial sube, y te van pidiendo menos
          garantía para cobrar temprano.
        </p>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={!valido || guardando}>
        {guardando ? (
          <>
            <Spinner />
            Creando tu cuenta…
          </>
        ) : (
          "Entrar a Minka"
        )}
      </Button>
    </form>
  );
}
