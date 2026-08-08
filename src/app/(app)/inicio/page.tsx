"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  HandCoins,
  Megaphone,
  Signature,
  Warning,
} from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Aparecer } from "@/components/common/aparecer";
import { TarjetaSaldoFondo } from "@/components/asociacion/tarjeta-saldo-fondo";
import { TarjetaPropuesta } from "@/components/asociacion/tarjeta-propuesta";
import { soles } from "@/lib/junta/format";
import { calcularSaldoFondo, esDirectivo } from "@/lib/junta/rules";
import { useJunta } from "@/lib/junta/context";

export default function InicioPage() {
  const { usuario, asociacion, movimientosFondo, propuestas, cuotas, anuncios } =
    useJunta();

  if (!usuario || !asociacion) return null;

  const directivo = esDirectivo(usuario);
  const saldo = calcularSaldoFondo(movimientosFondo);

  const miCuotaPendiente = cuotas
    .filter((c) => c.comercianteId === usuario.id && c.estado !== "pagado")
    .sort((a, b) => a.periodo.localeCompare(b.periodo))[0];

  const propuestasPendientes = propuestas.filter((p) => p.estado === "pendiente");
  const esperandoMiFirma = directivo
    ? propuestasPendientes.filter(
        (p) => !p.firmas.some((f) => f.directivoId === usuario.id)
      )
    : [];

  return (
    <div className="space-y-6">
      <Aparecer>
        <h1 className="text-display font-semibold text-marca-texto">
          Hola, {usuario.nombre.split(" ")[0]}
        </h1>
        <p className="mt-1 text-body text-marca-tenue">{asociacion.nombreMercado}</p>
      </Aparecer>

      <Aparecer retraso={0.05}>
        <Link href="/fondo" className="block">
          <TarjetaSaldoFondo saldo={saldo} />
        </Link>
      </Aparecer>

      {/* Lo que le toca a esta persona ahora — comerciante: su cuota; directivo:
          las firmas que le esperan. */}
      {!directivo && miCuotaPendiente ? (
        <Aparecer retraso={0.1}>
          <Card className="border-2 border-marca-secundario">
            <CardContent>
              <p className="flex items-center gap-2 text-h3 font-semibold text-marca-texto">
                <Warning size={24} weight="fill" color="#B8863B" aria-hidden="true" />
                Tu cuota está {miCuotaPendiente.estado === "mora" ? "en mora" : "pendiente"}
              </p>
              <p className="mt-2 text-body text-marca-tenue">
                Vence el {miCuotaPendiente.fechaVencimiento}
              </p>
              <Button asChild size="lg" className="mt-4 w-full">
                <Link href="/fondo/pagar">
                  <HandCoins size={22} weight="fill" aria-hidden="true" />
                  Pagar mi cuota
                </Link>
              </Button>
            </CardContent>
          </Card>
        </Aparecer>
      ) : !directivo ? (
        <Aparecer retraso={0.1}>
          <Card className="border-2 border-marca-primario">
            <CardContent className="flex items-center gap-3">
              <CheckCircle size={28} weight="fill" color="#4C8C5C" aria-hidden="true" />
              <p className="text-body font-semibold text-marca-texto">
                Tu cuota de este mes ya está al día.
              </p>
            </CardContent>
          </Card>
        </Aparecer>
      ) : esperandoMiFirma.length > 0 ? (
        <Aparecer retraso={0.1}>
          <Card className="border-2 border-marca-secundario">
            <CardContent>
              <p className="flex items-center gap-2 text-h3 font-semibold text-marca-texto">
                <Signature size={24} weight="fill" color="#B8863B" aria-hidden="true" />
                {esperandoMiFirma.length}{" "}
                {esperandoMiFirma.length === 1
                  ? "propuesta espera tu firma"
                  : "propuestas esperan tu firma"}
              </p>
              <p className="mt-2 text-body text-marca-tenue">
                Ningún gasto se ejecuta sin el acuerdo de varios directivos.
              </p>
              <Button asChild size="lg" className="mt-4 w-full">
                <Link href={`/fondo/propuesta/${esperandoMiFirma[0].id}`}>
                  Revisar la primera
                  <ArrowRight size={20} weight="bold" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </Aparecer>
      ) : null}

      {/* Propuestas activas */}
      {propuestasPendientes.length > 0 ? (
        <section>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-h2 font-semibold text-marca-texto">
              Propuestas activas
            </h2>
            <Link
              href="/fondo"
              className="touch-target flex items-center rounded-md text-support font-semibold text-marca-primario"
            >
              Ver el fondo
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {propuestasPendientes.slice(0, 3).map((p, i) => (
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

      {/* Directivo: accesos rápidos */}
      {directivo ? (
        <div className="grid grid-cols-2 gap-3">
          <Button asChild size="lg" className="h-auto flex-col gap-1.5 py-4">
            <Link href="/fondo/proponer">
              <HandCoins size={24} weight="fill" aria-hidden="true" />
              Proponer gasto
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-auto flex-col gap-1.5 py-4">
            <Link href="/fondo">
              <Signature size={24} weight="duotone" aria-hidden="true" />
              Ver el fondo
            </Link>
          </Button>
        </div>
      ) : null}

      {/* Últimos anuncios */}
      {anuncios.length > 0 ? (
        <section>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-h2 font-semibold text-marca-texto">
              Tablón de anuncios
            </h2>
            <Link
              href="/anuncios"
              className="touch-target flex items-center rounded-md text-support font-semibold text-marca-primario"
            >
              Ver todos
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {anuncios.slice(0, 2).map((a, i) => (
              <Aparecer key={a.id} retraso={0.05 * i}>
                <Card>
                  <CardContent className="flex gap-3">
                    <Megaphone
                      size={24}
                      weight="duotone"
                      color="#B8863B"
                      className="mt-0.5 shrink-0"
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <p className="text-body font-semibold text-marca-texto">
                        {a.titulo}
                      </p>
                      <p className="mt-1 line-clamp-2 text-support text-marca-tenue">
                        {a.contenido}
                      </p>
                      <p className="mt-1 text-support text-marca-tenue">
                        {a.publicadoPorNombre} · {a.fecha}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Aparecer>
            ))}
          </div>
        </section>
      ) : null}

      <p className="text-support text-marca-tenue">
        Fondo actual: {soles(saldo)}. Verificable por cualquier miembro de{" "}
        {asociacion.nombreMercado} en todo momento.
      </p>
    </div>
  );
}
