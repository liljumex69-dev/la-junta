"use client";

import Link from "next/link";
import { HandCoins, Signature } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Aparecer } from "@/components/common/aparecer";
import { TarjetaSaldoFondo } from "@/components/asociacion/tarjeta-saldo-fondo";
import { TarjetaPropuesta } from "@/components/asociacion/tarjeta-propuesta";
import { ListaMovimientos } from "@/components/asociacion/lista-movimientos";
import { DashboardDirectivo } from "@/components/asociacion/dashboard-directivo";
import { calcularSaldoFondo, esDirectivo } from "@/lib/junta/rules";
import { useJunta } from "@/lib/junta/context";

export default function FondoPage() {
  const { usuario, asociacion, movimientosFondo, propuestas, cuotas } = useJunta();

  if (!usuario || !asociacion) return null;

  const directivo = esDirectivo(usuario);
  const saldo = calcularSaldoFondo(movimientosFondo);
  const propuestasPendientes = propuestas.filter((p) => p.estado === "pendiente");

  return (
    <div className="space-y-6">
      <Aparecer>
        <h1 className="text-display font-semibold text-marca-texto">El fondo</h1>
        <p className="mt-1 text-body text-marca-tenue">{asociacion.nombreMercado}</p>
      </Aparecer>

      <Aparecer retraso={0.05}>
        <TarjetaSaldoFondo saldo={saldo} />
      </Aparecer>

      <div className="grid grid-cols-2 gap-3">
        {!directivo ? (
          <Button asChild size="lg" className="col-span-2">
            <Link href="/fondo/pagar">
              <HandCoins size={22} weight="fill" aria-hidden="true" />
              Pagar mi cuota
            </Link>
          </Button>
        ) : (
          <>
            <Button asChild size="lg">
              <Link href="/fondo/proponer">
                <HandCoins size={20} weight="fill" aria-hidden="true" />
                Proponer gasto
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#propuestas">
                <Signature size={20} weight="duotone" aria-hidden="true" />
                Ver propuestas
              </a>
            </Button>
          </>
        )}
      </div>

      {propuestasPendientes.length > 0 ? (
        <section id="propuestas">
          <h2 className="text-h2 font-semibold text-marca-texto">
            Propuestas activas
          </h2>
          <div className="mt-4 space-y-3">
            {propuestasPendientes.map((p, i) => (
              <Aparecer key={p.id} retraso={0.05 * i}>
                <TarjetaPropuesta
                  propuesta={p}
                  usuarioId={usuario.id}
                  esDirectivo={directivo}
                />
              </Aparecer>
            ))}
          </div>
        </section>
      ) : null}

      {directivo ? (
        <Aparecer retraso={0.1}>
          <DashboardDirectivo movimientos={movimientosFondo} cuotas={cuotas} />
        </Aparecer>
      ) : null}

      <section>
        <h2 className="text-h2 font-semibold text-marca-texto">
          Historial de movimientos
        </h2>
        <div className="mt-4">
          <ListaMovimientos movimientos={movimientosFondo} />
        </div>
      </section>
    </div>
  );
}
