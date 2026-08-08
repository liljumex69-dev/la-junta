"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, IdentificationCard } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/common/spinner";
import { useJunta } from "@/lib/junta/context";

/**
 * Último paso del registro: nombre y DNI.
 *
 * El DNI se pide porque, en el producto real, identifica al firmante o beneficiario
 * ante el Safe y ante el propio directorio del mercado — no es un dato decorativo.
 *
 * Al terminar, la cuenta ya existe con `asociacionId: null`, así que el siguiente
 * paso es elegir entre fundar una asociación o unirse a una con un código —
 * exactamente los dos caminos que describe el documento de producto.
 */
export function PerfilForm({
  telefono,
  codigoAsociacion,
}: {
  telefono?: string;
  codigoAsociacion?: string;
}) {
  const router = useRouter();
  const { registrar } = useJunta();

  const [nombre, setNombre] = useState("");
  const [dni, setDni] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [listo, setListo] = useState(false);

  const nombreValido = nombre.trim().length >= 3;
  const dniValido = /^\d{8}$/.test(dni);
  const valido = nombreValido && dniValido;

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (!valido || guardando) return;
    setGuardando(true);

    // TODO: conectar a Safe/smart contract — registrar la identidad del usuario.
    // Todavía no se le asigna ningún firmante ni beneficiario del Safe: eso ocurre
    // cuando funda o se une a una asociación en el siguiente paso.
    await new Promise((r) => setTimeout(r, 900));

    registrar({ nombre, dni, telefono: telefono || "900 000 000" });

    setGuardando(false);
    setListo(true);
  }

  useEffect(() => {
    if (!listo) return;
    const params = new URLSearchParams();
    if (codigoAsociacion) params.set("asociacion", codigoAsociacion);
    const destino = codigoAsociacion
      ? `/unirse?${params.toString()}`
      : "/registro/camino";
    const id = window.setTimeout(() => router.push(destino), 1400);
    return () => window.clearTimeout(id);
  }, [listo, router, codigoAsociacion]);

  if (listo) {
    return (
      <div
        className="flex flex-col items-center py-10 text-center"
        role="status"
        aria-live="polite"
      >
        <span className="grid size-20 place-items-center rounded-full bg-[#e3ede6]">
          <CheckCircle size={52} weight="fill" color="#4C8C5C" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-h2 font-semibold text-marca-texto">
          Tu cuenta está lista
        </h2>
        <p className="mt-2 text-body text-marca-tenue">
          Bienvenido a Junta, {nombre.trim().split(" ")[0]}.{" "}
          {codigoAsociacion
            ? "Ahora confirmamos tu puesto."
            : "Elige cómo quieres empezar."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={guardar} className="space-y-6">
      <div>
        <Label htmlFor="nombre" className="text-body font-semibold">
          ¿Cómo te llamas?
        </Label>
        <Input
          id="nombre"
          className="mt-2"
          autoComplete="name"
          placeholder="Elena Vásquez Rojas"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <p className="mt-2 text-support text-marca-tenue">
          Así te van a ver los demás miembros de tu asociación.
        </p>
      </div>

      <div>
        <Label htmlFor="dni" className="text-body font-semibold">
          Tu DNI
        </Label>
        <Input
          id="dni"
          className="mt-2"
          inputMode="numeric"
          maxLength={8}
          placeholder="45678912"
          value={dni}
          onChange={(e) => setDni(e.target.value.replace(/\D/g, "").slice(0, 8))}
          aria-invalid={dni.length > 0 && !dniValido ? true : undefined}
        />
        <p className="mt-2 text-support text-marca-tenue">
          Identifica tu puesto o tu cargo directivo ante la asociación.
        </p>
      </div>

      <div className="flex gap-3 rounded-lg border border-marca-borde bg-marca-superficie p-4">
        <IdentificationCard
          size={28}
          weight="duotone"
          color="#1F5C3D"
          className="shrink-0"
          aria-hidden="true"
        />
        <p className="text-body text-marca-texto">
          Con esto ya tienes cuenta. Lo que falta es fundar la asociación de tu
          mercado, o unirte a la que ya existe.
        </p>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={!valido || guardando}>
        {guardando ? (
          <>
            <Spinner />
            Creando tu cuenta…
          </>
        ) : (
          "Continuar"
        )}
      </Button>
    </form>
  );
}
