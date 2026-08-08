import Link from "next/link";
import { CaretLeft } from "@phosphor-icons/react/ssr";
import { Logo } from "@/components/common/logo";

/**
 * Contenedor de las pantallas de registro y acceso.
 *
 * Una sola columna, centrada, con el logo arriba: en estas pantallas el usuario
 * todavía no conoce el producto, así que la marca tiene que estar presente y
 * no debe competir con nada más.
 */
export function AuthShell({
  titulo,
  descripcion,
  volverA,
  paso,
  totalPasos,
  children,
}: {
  titulo: string;
  descripcion?: string;
  volverA?: string;
  paso?: number;
  totalPasos?: number;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-dvh flex-col px-4 py-6">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <div className="flex items-center gap-2">
          {volverA ? (
            <Link
              href={volverA}
              aria-label="Volver"
              className="touch-target -ml-3 grid place-items-center rounded-md text-marca-texto transition-colors hover:bg-[#ece5d3]"
            >
              <CaretLeft size={26} weight="bold" />
            </Link>
          ) : null}
          <Link href="/" aria-label="Junta, ir al inicio" className="flex">
            <Logo size={32} />
          </Link>
        </div>

        {paso && totalPasos ? (
          <p className="mt-8 text-support font-semibold text-marca-secundario">
            Paso {paso} de {totalPasos}
          </p>
        ) : null}

        <h1 className="mt-2 text-display font-semibold text-marca-texto">
          {titulo}
        </h1>
        {descripcion ? (
          <p className="mt-3 text-body text-marca-tenue">{descripcion}</p>
        ) : null}

        <div className="mt-8 flex-1">{children}</div>
      </div>
    </main>
  );
}
