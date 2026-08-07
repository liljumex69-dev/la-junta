"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle, UsersThree, Warning } from "@phosphor-icons/react/ssr";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthShell } from "@/components/minka/auth-shell";
import { Spinner } from "@/components/minka/spinner";
import { ETIQUETA_FRECUENCIA, soles } from "@/lib/minka/format";
import { useSesion } from "@/lib/minka/prototipo/sesion";

/**
 * Invitación por enlace.
 *
 * Resuelve el escenario que faltaba: a alguien le comparten un enlace por WhatsApp y
 * entra a la junta sin dar vueltas.
 *
 * - Si ya tiene sesión, ve la junta y entra de un toque.
 * - Si no la tiene, pasa por el registro llevando el código consigo y queda inscrito
 *   automáticamente al terminar — nunca tiene que buscar dónde escribir un código.
 */
export default function InvitacionPage() {
  const { codigo } = useParams<{ codigo: string }>();
  const router = useRouter();
  const { listo, usuario, buscarPorCodigo, unirseAJunta } = useSesion();
  const [entrando, setEntrando] = useState(false);

  if (!listo) {
    return (
      <AuthShell titulo="Te invitaron a una junta">
        <div className="space-y-4" aria-busy="true">
          <Skeleton className="h-28 w-full bg-minka-surface" />
          <Skeleton className="h-12 w-full bg-minka-surface" />
        </div>
      </AuthShell>
    );
  }

  const junta = buscarPorCodigo(codigo);

  if (!junta) {
    return (
      <AuthShell titulo="Esta invitación no funciona" volverA="/">
        <div className="flex flex-col items-center py-8 text-center">
          <Warning size={48} weight="duotone" color="#E38E20" aria-hidden="true" />
          <p className="mt-4 max-w-sm text-body text-minka-muted">
            El enlace está mal o la junta ya no existe. Pídele a quien te invitó que
            te lo mande de nuevo.
          </p>
          <Button asChild size="lg" className="mt-7">
            <Link href="/">Ir al inicio</Link>
          </Button>
        </div>
      </AuthShell>
    );
  }

  const yaEstoy = usuario
    ? junta.participantes.some((p) => p.id === usuario.id)
    : false;
  const faltan = junta.totalParticipantes - junta.participantes.length;
  const organizador = junta.participantes.find(
    (p) => p.id === junta.organizadorId
  );

  async function entrar() {
    if (entrando) return;
    setEntrando(true);
    await new Promise((r) => setTimeout(r, 900));
    unirseAJunta(junta!);
    router.push(`/junta/${junta!.id}`);
  }

  return (
    <AuthShell
      titulo="Te invitaron a una junta"
      descripcion={
        organizador
          ? `${organizador.nombre} te está invitando a participar.`
          : "Te están invitando a participar."
      }
      volverA="/"
    >
      <div className="space-y-6">
        <div className="rounded-lg border-2 border-minka-border bg-minka-surface p-5">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-h3 font-semibold text-minka-text">
              {junta.nombre}
            </h2>
            {junta.modo === "protegido" ? (
              <Badge variant="outline">Protegida</Badge>
            ) : (
              <Badge variant="muted">Tradicional</Badge>
            )}
          </div>

          <p className="mt-3 text-body text-minka-text">
            <strong className="font-semibold">{soles(junta.cuota)}</strong>{" "}
            {ETIQUETA_FRECUENCIA[junta.frecuencia].toLowerCase()} ·{" "}
            {junta.totalParticipantes} personas
          </p>
          <p className="mt-1 text-body text-minka-text">
            Cuando te toque, recibes{" "}
            <strong className="font-semibold">
              {soles(junta.cuota * junta.totalParticipantes)}
            </strong>{" "}
            de una sola vez.
          </p>

          <p className="mt-4 flex items-center gap-2 text-support text-minka-muted">
            <UsersThree size={20} weight="duotone" aria-hidden="true" />
            {junta.participantes.length} de {junta.totalParticipantes} ya entraron
            {faltan > 0 ? ` · faltan ${faltan}` : " · grupo completo"}
          </p>
        </div>

        {yaEstoy ? (
          <div className="rounded-lg border-2 border-minka-success bg-[#eef2e9] p-5">
            <p className="flex items-center gap-2 text-body font-semibold text-minka-success">
              <CheckCircle size={24} weight="fill" aria-hidden="true" />
              Ya estás en esta junta
            </p>
            <Button asChild size="lg" className="mt-4 w-full">
              <Link href={`/junta/${junta.id}`}>Ver la junta</Link>
            </Button>
          </div>
        ) : usuario ? (
          <Button size="lg" className="w-full" onClick={entrar} disabled={entrando}>
            {entrando ? (
              <>
                <Spinner />
                Entrando a la junta…
              </>
            ) : (
              "Entrar a esta junta"
            )}
          </Button>
        ) : (
          <div className="space-y-3">
            <Button asChild size="lg" className="w-full">
              <Link href={`/registro?junta=${junta.codigoInvitacion}`}>
                Crear mi cuenta y entrar
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full">
              <Link href="/entrar">Ya tengo cuenta</Link>
            </Button>
            <p className="text-support text-minka-muted">
              Solo necesitas tu número de celular. Al terminar quedas dentro de la
              junta, sin escribir ningún código.
            </p>
          </div>
        )}
      </div>
    </AuthShell>
  );
}
