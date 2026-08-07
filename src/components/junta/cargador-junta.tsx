"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Warning } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSesion } from "@/lib/minka/prototipo/sesion";
import type { Junta, Participante } from "@/lib/minka/types";

/**
 * Resuelve la junta de la URL contra el estado de la sesión y se la entrega a la
 * pantalla que la necesita. Centraliza los tres estados posibles (cargando, no
 * encontrada, lista) para que ninguna pantalla de junta tenga que repetirlos.
 */
export function CargadorJunta({
  children,
}: {
  children: (datos: { junta: Junta; yo: Participante }) => React.ReactNode;
}) {
  const params = useParams<{ id: string }>();
  const { listo, usuario, juntas } = useSesion();

  if (!listo || !usuario) {
    return (
      <div className="space-y-4" aria-busy="true">
        <Skeleton className="h-10 w-2/3 bg-minka-surface" />
        <Skeleton className="h-40 w-full bg-minka-surface" />
        <Skeleton className="h-60 w-full bg-minka-surface" />
      </div>
    );
  }

  const junta = juntas.find((j) => j.id === params.id);
  const yo = junta?.participantes.find((p) => p.id === usuario.id);

  if (!junta || !yo) {
    return (
      <div className="flex flex-col items-center py-14 text-center">
        <Warning size={48} weight="duotone" color="#E38E20" aria-hidden="true" />
        <h1 className="mt-5 text-h2 font-semibold text-minka-text">
          No encontramos esta junta
        </h1>
        <p className="mt-2 max-w-sm text-body text-minka-muted">
          Puede que ya no estés en ella, o que el enlace esté mal.
        </p>
        <Button asChild size="lg" className="mt-7">
          <Link href="/inicio">Ir a mis juntas</Link>
        </Button>
      </div>
    );
  }

  return <>{children({ junta, yo })}</>;
}
