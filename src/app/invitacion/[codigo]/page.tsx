"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle, Users, Warning } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthShell } from "@/components/common/auth-shell";
import { Spinner } from "@/components/common/spinner";
import { formatoUmbral } from "@/lib/junta/rules";
import { useJunta } from "@/lib/junta/context";

/**
 * Invitación por enlace.
 *
 * Resuelve el escenario que el documento describe como "código o link de
 * invitación": a alguien le comparten un enlace por WhatsApp y entra a la
 * asociación sin dar vueltas.
 *
 * - Si ya tiene sesión, confirma su puesto y entra de un toque.
 * - Si no la tiene, pasa por el registro llevando el código consigo y termina
 *   exactamente en esta misma pantalla para confirmar su puesto.
 */
export default function InvitacionPage() {
  const { codigo } = useParams<{ codigo: string }>();
  const router = useRouter();
  const { listo, usuario, buscarAsociacionPorCodigo, unirseAsociacion } = useJunta();
  const [numeroPuesto, setNumeroPuesto] = useState("");
  const [entrando, setEntrando] = useState(false);

  if (!listo) {
    return (
      <AuthShell titulo="Te invitaron a una asociación">
        <div className="space-y-4" aria-busy="true">
          <Skeleton className="h-28 w-full bg-marca-superficie" />
          <Skeleton className="h-12 w-full bg-marca-superficie" />
        </div>
      </AuthShell>
    );
  }

  const asociacion = buscarAsociacionPorCodigo(codigo);

  if (!asociacion) {
    return (
      <AuthShell titulo="Esta invitación no funciona" volverA="/">
        <div className="flex flex-col items-center py-8 text-center">
          <Warning size={48} weight="duotone" color="#B8863B" aria-hidden="true" />
          <p className="mt-4 max-w-sm text-body text-marca-tenue">
            El enlace está mal o la asociación ya no existe. Pídele a tu directorio
            que te lo mande de nuevo.
          </p>
          <Button asChild size="lg" className="mt-7">
            <Link href="/">Ir al inicio</Link>
          </Button>
        </div>
      </AuthShell>
    );
  }

  const yaEstoy = usuario?.asociacionId === asociacion.id;

  async function confirmarPuesto() {
    if (entrando || numeroPuesto.trim().length === 0) return;
    setEntrando(true);
    await new Promise((r) => setTimeout(r, 900));
    unirseAsociacion(asociacion!.id, numeroPuesto.trim());
    router.push("/fondo");
  }

  return (
    <AuthShell
      titulo="Te invitaron a una asociación"
      descripcion={`Registra tu puesto en ${asociacion.nombreMercado}.`}
      volverA="/"
    >
      <div className="space-y-6">
        <div className="rounded-lg border-2 border-marca-borde bg-marca-superficie p-5">
          <h2 className="text-h3 font-semibold text-marca-texto">
            {asociacion.nombreMercado}
          </h2>
          <p className="mt-2 flex items-center gap-2 text-support text-marca-tenue">
            <Users size={20} weight="duotone" aria-hidden="true" />
            {asociacion.numeroPuestos} puestos · firma {formatoUmbral(asociacion)}
          </p>
        </div>

        {yaEstoy ? (
          <div className="rounded-lg border-2 border-marca-primario bg-[#e3ede6] p-5">
            <p className="flex items-center gap-2 text-body font-semibold text-[#1F5C3D]">
              <CheckCircle size={24} weight="fill" aria-hidden="true" />
              Ya estás en esta asociación
            </p>
            <Button asChild size="lg" className="mt-4 w-full">
              <Link href="/fondo">Ver el fondo</Link>
            </Button>
          </div>
        ) : usuario ? (
          usuario.asociacionId ? (
            <p className="rounded-lg border border-marca-secundario bg-[#f5e9d3] p-4 text-body text-marca-texto">
              Tu cuenta ya pertenece a otra asociación. En este prototipo cada
              cuenta pertenece a un solo mercado a la vez.
            </p>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="numero-puesto" className="text-body font-semibold">
                  Número de tu puesto
                </Label>
                <Input
                  id="numero-puesto"
                  className="mt-2"
                  placeholder="A-14"
                  value={numeroPuesto}
                  onChange={(e) => setNumeroPuesto(e.target.value)}
                />
              </div>
              <Button
                size="lg"
                className="w-full"
                onClick={confirmarPuesto}
                disabled={entrando || numeroPuesto.trim().length === 0}
              >
                {entrando ? (
                  <>
                    <Spinner />
                    Registrando tu puesto…
                  </>
                ) : (
                  "Confirmar mi puesto"
                )}
              </Button>
            </div>
          )
        ) : (
          <div className="space-y-3">
            <Button asChild size="lg" className="w-full">
              <Link href={`/registro?asociacion=${asociacion.codigoInvitacion}`}>
                Crear mi cuenta y entrar
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full">
              <Link href="/entrar">Ya tengo cuenta</Link>
            </Button>
            <p className="text-support text-marca-tenue">
              Solo necesitas tu número de celular. Al terminar confirmas tu puesto
              en esta misma pantalla.
            </p>
          </div>
        )}
      </div>
    </AuthShell>
  );
}
