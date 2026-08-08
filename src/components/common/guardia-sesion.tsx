"use client";

import Link from "next/link";
import { Buildings } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useJunta } from "@/lib/junta/context";

/**
 * Protege las pantallas con sesión.
 *
 * El estado vive en memoria (Context de React), así que "cargando" nunca dura más
 * que el primer render — pero igual se contempla el skeleton porque el sistema de
 * diseño lo pide para carga de contenido, no un spinner centrado. Si no hay sesión,
 * se ofrece entrar o crear cuenta en vez de redirigir en silencio.
 */
export function GuardiaSesion({ children }: { children: React.ReactNode }) {
  const { listo, usuario } = useJunta();

  if (!listo) {
    return (
      <div className="space-y-4" aria-busy="true" aria-live="polite">
        <span className="sr-only">Cargando tu información…</span>
        <Skeleton className="h-10 w-2/3 bg-marca-superficie" />
        <Skeleton className="h-28 w-full bg-marca-superficie" />
        <Skeleton className="h-44 w-full bg-marca-superficie" />
        <Skeleton className="h-44 w-full bg-marca-superficie" />
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="flex flex-col items-center py-14 text-center">
        <Buildings size={52} weight="duotone" color="#1F5C3D" aria-hidden="true" />
        <h1 className="mt-5 text-h2 font-semibold text-marca-texto">
          Entra para ver tu asociación
        </h1>
        <p className="mt-2 max-w-sm text-body text-marca-tenue">
          Con tu número de celular puedes volver al fondo, tus cuotas y tu
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
