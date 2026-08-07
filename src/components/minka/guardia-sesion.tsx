"use client";

import Link from "next/link";
import { UsersThree } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSesion } from "@/lib/minka/prototipo/sesion";

/**
 * Protege las pantallas con sesión.
 *
 * Mientras el estado se lee de `localStorage` se muestra un skeleton con el color de
 * superficie — el sistema de diseño pide skeleton para carga de contenido, no un
 * spinner centrado. Si no hay sesión, se ofrece entrar o crear cuenta en vez de
 * redirigir en silencio: una redirección automática deja a la persona sin entender
 * qué pasó.
 */
export function GuardiaSesion({ children }: { children: React.ReactNode }) {
  const { listo, usuario } = useSesion();

  if (!listo) {
    return (
      <div className="space-y-4" aria-busy="true" aria-live="polite">
        <span className="sr-only">Cargando tu información…</span>
        <Skeleton className="h-10 w-2/3 bg-minka-surface" />
        <Skeleton className="h-28 w-full bg-minka-surface" />
        <Skeleton className="h-44 w-full bg-minka-surface" />
        <Skeleton className="h-44 w-full bg-minka-surface" />
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="flex flex-col items-center py-14 text-center">
        <UsersThree size={52} weight="duotone" color="#BF312A" aria-hidden="true" />
        <h1 className="mt-5 text-h2 font-semibold text-minka-text">
          Entra para ver tus juntas
        </h1>
        <p className="mt-2 max-w-sm text-body text-minka-muted">
          Con tu número de celular puedes volver a tus juntas, tus cuotas y tu
          historial.
        </p>
        <div className="mt-7 flex w-full max-w-xs flex-col gap-3">
          <Button asChild size="lg">
            <Link href="/entrar">Entrar</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/registro">Crear una cuenta</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
