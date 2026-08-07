"use client";

import Link from "next/link";
import { Plus, SignIn, UsersThree } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { JuntaCard } from "@/components/minka/junta-card";
import { TarjetaNivel } from "@/components/minka/tarjeta-nivel";
import { Aparecer } from "@/components/minka/aparecer";
import { useSesion } from "@/lib/minka/prototipo/sesion";
import { soles } from "@/lib/minka/format";

export default function InicioPage() {
  const { usuario, misJuntas } = useSesion();
  if (!usuario) return null;

  // Cuotas que el usuario ya puso: los ciclos anteriores más el actual si ya aportó.
  const totalAportado = misJuntas.reduce((suma, junta) => {
    const yo = junta.participantes.find((p) => p.id === usuario.id)!;
    const yaAporteEsteCiclo =
      yo.estadoPago === "pagado" || yo.estadoPago === "tarde";
    const ciclos = Math.max(
      0,
      junta.cicloActual - 1 + (yaAporteEsteCiclo ? 1 : 0)
    );
    return suma + junta.cuota * ciclos;
  }, 0);

  const sinJuntas = misJuntas.length === 0;

  return (
    <div className="space-y-6">
      <Aparecer>
        <h1 className="text-display font-semibold text-minka-text">
          Hola, {usuario.nombre.split(" ")[0]}
        </h1>
        <p className="mt-1 text-body text-minka-muted">
          {sinJuntas
            ? "Bienvenida a Minka. Empieza creando tu junta o entrando a una con un código."
            : `Tienes ${misJuntas.length} ${
                misJuntas.length === 1 ? "junta activa" : "juntas activas"
              } y llevas ${soles(totalAportado)} aportados.`}
        </p>
      </Aparecer>

      <Aparecer retraso={0.05}>
        <TarjetaNivel usuario={usuario} />
      </Aparecer>

      <Aparecer retraso={0.1}>
        <div className="grid grid-cols-2 gap-3">
          <Button asChild size="lg" className="h-auto flex-col gap-1.5 py-4">
            <Link href="/crear">
              <Plus size={26} weight="bold" aria-hidden="true" />
              Crear junta
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-auto flex-col gap-1.5 py-4"
          >
            <Link href="/unirse">
              <SignIn size={26} weight="bold" aria-hidden="true" />
              Unirme a una junta
            </Link>
          </Button>
        </div>
      </Aparecer>

      <section>
        <h2 className="text-h2 font-semibold text-minka-text">Mis juntas</h2>

        {sinJuntas ? (
          <Card className="mt-4">
            <CardContent className="flex flex-col items-center py-8 text-center">
              <UsersThree
                size={48}
                weight="duotone"
                color="#BF312A"
                aria-hidden="true"
              />
              <h3 className="mt-4 text-h3 font-semibold text-minka-text">
                Todavía no estás en ninguna junta
              </h3>
              <p className="mt-2 max-w-xs text-body text-minka-muted">
                Crea la tuya con la gente que ya conoces y compárteles el enlace, o
                entra a una con el código que te pasen.
              </p>
              <div className="mt-6 flex w-full max-w-xs flex-col gap-3">
                <Button asChild size="lg">
                  <Link href="/crear">Crear mi primera junta</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/unirse">Tengo un código</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-4 space-y-4">
            {misJuntas.map((junta, i) => (
              <Aparecer key={junta.id} retraso={0.05 * i}>
                <JuntaCard
                  junta={junta}
                  yo={junta.participantes.find((p) => p.id === usuario.id)!}
                />
              </Aparecer>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
