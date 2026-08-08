"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Buildings, SignIn } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useJunta } from "@/lib/junta/context";

/** Rutas donde alguien sin asociación todavía debe poder entrar: son el destino
 * mismo de elegir un camino, no una pantalla que depende de tener asociación. */
const RUTAS_SIN_ASOCIACION = ["/crear", "/unirse"];

/**
 * Protege las pantallas con sesión.
 *
 * El estado vive en memoria (Context de React), así que "cargando" nunca dura más
 * que el primer render — pero igual se contempla el skeleton porque el sistema de
 * diseño lo pide para carga de contenido, no un spinner centrado.
 *
 * Dos casos sin acceso directo, cada uno con su salida propia en vez de una
 * redirección silenciosa:
 * - Sin sesión: se ofrece entrar o crear cuenta.
 * - Con sesión pero sin asociación todavía (recién registrado, o llegó a un enlace
 *   directo antes de elegir): se ofrece fundar o unirse, salvo que ya esté
 *   precisamente en esas dos pantallas.
 */
export function GuardiaSesion({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
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

  if (!usuario.asociacionId && !RUTAS_SIN_ASOCIACION.includes(pathname)) {
    return (
      <div className="flex flex-col items-center py-14 text-center">
        <SignIn size={52} weight="duotone" color="#1F5C3D" aria-hidden="true" />
        <h1 className="mt-5 text-h2 font-semibold text-marca-texto">
          Todavía no elegiste tu camino
        </h1>
        <p className="mt-2 max-w-sm text-body text-marca-tenue">
          Antes de ver el fondo necesitas fundar la asociación de tu mercado, o
          unirte a la que ya existe.
        </p>
        <div className="mt-7 flex w-full max-w-xs flex-col gap-3">
          <Button asChild size="lg">
            <Link href="/crear">Fundar mi asociación</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/unirse">Tengo un código</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
