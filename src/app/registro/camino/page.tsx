"use client";

import Link from "next/link";
import { Buildings, SignIn } from "@phosphor-icons/react/ssr";

import { AuthShell } from "@/components/common/auth-shell";
import { useJunta } from "@/lib/junta/context";

/**
 * Bifurcación después del registro: fundar una asociación o unirse a una que ya
 * existe. El documento de producto la describe como los "dos caminos" que siguen a
 * cualquier registro nuevo — se resuelve aquí en vez de forzar una elección dentro
 * del formulario de registro, que ya tiene suficiente con nombre y DNI.
 */
export default function CaminoPage() {
  const { usuario } = useJunta();

  return (
    <AuthShell
      titulo={`Hola, ${usuario?.nombre.split(" ")[0] ?? ""}`}
      descripcion="¿Cómo quieres empezar?"
    >
      <div className="space-y-4">
        <Link
          href="/crear"
          className="block rounded-lg border-2 border-marca-borde bg-marca-superficie p-5 transition-colors hover:border-marca-primario hover:bg-[#e9f0ec]"
        >
          <Buildings size={30} weight="duotone" color="#1F5C3D" aria-hidden="true" />
          <h2 className="mt-3 text-h3 font-semibold text-marca-texto">
            Fundar la asociación de mi mercado
          </h2>
          <p className="mt-1 text-body text-marca-tenue">
            Eres directivo y tu mercado todavía no tiene su fondo en Junta.
            Defines el umbral de firmas y el directorio inicial.
          </p>
        </Link>

        <Link
          href="/unirse"
          className="block rounded-lg border-2 border-marca-borde bg-marca-superficie p-5 transition-colors hover:border-marca-primario hover:bg-[#e9f0ec]"
        >
          <SignIn size={30} weight="duotone" color="#1F5C3D" aria-hidden="true" />
          <h2 className="mt-3 text-h3 font-semibold text-marca-texto">
            Ya tengo el código de mi mercado
          </h2>
          <p className="mt-1 text-body text-marca-tenue">
            Tu asociación ya está en Junta. Entra con el código o el enlace que te
            compartieron.
          </p>
        </Link>
      </div>
    </AuthShell>
  );
}
