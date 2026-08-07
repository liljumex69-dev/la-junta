import Link from "next/link";
import { Plus, SignIn, UsersThree } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { JuntaCard } from "@/components/minka/junta-card";
import { JUNTAS, USUARIO_ACTUAL, miParticipacion } from "@/lib/minka/mock-data";
import { soles } from "@/lib/minka/format";

export const metadata = { title: "Inicio — Minka" };

export default function InicioPage() {
  // TODO: conectar a smart contract — listar las juntas en las que este usuario
  // participa (como miembro y como organizador) leyendo el contrato.
  const misJuntas = JUNTAS.map((junta) => ({
    junta,
    yo: miParticipacion(junta),
  })).filter((x) => x.yo !== undefined);

  // Cuotas que el usuario ya puso: todos los ciclos anteriores, más el actual si ya aportó.
  const totalAhorrado = misJuntas.reduce((suma, { junta, yo }) => {
    const yaAporteEsteCiclo =
      yo!.estadoPago === "pagado" || yo!.estadoPago === "tarde";
    const ciclosAportados = junta.cicloActual - 1 + (yaAporteEsteCiclo ? 1 : 0);
    return suma + junta.cuota * ciclosAportados;
  }, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-display font-semibold text-minka-text">
          Hola, {USUARIO_ACTUAL.nombre.split(" ")[0]}
        </h1>
        <p className="mt-1 text-body text-minka-muted">
          Tienes {misJuntas.length} juntas activas y llevas {soles(totalAhorrado)}{" "}
          aportados.
        </p>
      </div>

      {/* Accesos rápidos */}
      <div className="grid grid-cols-2 gap-3">
        <Button asChild size="lg" className="h-auto flex-col gap-1.5 py-4">
          <Link href="/crear">
            <Plus size={26} weight="bold" aria-hidden="true" />
            Crear junta
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-auto flex-col gap-1.5 py-4">
          <Link href="/unirse">
            <SignIn size={26} weight="bold" aria-hidden="true" />
            Unirme a una junta
          </Link>
        </Button>
      </div>

      <section>
        <h2 className="text-h2 font-semibold text-minka-text">Mis juntas</h2>

        {misJuntas.length === 0 ? (
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
                Crea la tuya con la gente que ya conoces, o entra a una con el
                código que te compartan.
              </p>
              <Button asChild size="lg" className="mt-6">
                <Link href="/crear">Crear mi primera junta</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-4 space-y-4">
            {misJuntas.map(({ junta, yo }) => (
              <JuntaCard key={junta.id} junta={junta} yo={yo!} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
