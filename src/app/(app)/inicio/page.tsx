"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  HandCoins,
  Megaphone,
  PushPin,
  Signature,
  Warning,
} from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Aparecer } from "@/components/common/aparecer";
import { TarjetaSaldoFondo } from "@/components/asociacion/tarjeta-saldo-fondo";
import { TarjetaPropuesta } from "@/components/asociacion/tarjeta-propuesta";
import { ListaMovimientos } from "@/components/asociacion/lista-movimientos";
import { DashboardDirectivo } from "@/components/asociacion/dashboard-directivo";
import { FormularioAnuncio } from "@/components/common/formulario-anuncio";
import { calcularSaldoFondo, esDirectivo } from "@/lib/junta/rules";
import { useJunta } from "@/lib/junta/context";

/**
 * Inicio — el panel del fondo, todo en un solo lugar.
 *
 * Antes existían dos pantallas casi idénticas ("Inicio" y "El fondo"): mismo
 * saldo, mismas propuestas activas, mismos botones de acción, repetidos.
 * Ahora es una sola, con dos columnas en pantallas anchas — el fondo y sus
 * propuestas a la izquierda, el tablón de anuncios como contenido secundario
 * a la derecha — para aprovechar el espacio en vez de dejarlo vacío a los
 * costados de una sola columna angosta.
 */
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

  // Fijados primero, igual que en el tablón — lo más importante arriba.
  const anunciosOrdenados = [
    ...anuncios.filter((a) => a.fijado),
    ...anuncios.filter((a) => !a.fijado),
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
      {/* Columna principal: el fondo, tu estado, propuestas, historial */}
      <div className="space-y-6 lg:col-span-2">
        <Aparecer>
          <h1 className="text-display font-semibold text-marca-texto">
            Hola, {usuario.nombre.split(" ")[0]}
          </h1>
          <p className="mt-1 text-body text-marca-tenue">{asociacion.nombreMercado}</p>
        </Aparecer>

        <Aparecer retraso={0.05}>
          <TarjetaSaldoFondo saldo={saldo} />
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
                <Button asChild size="lg" className="mt-4 w-full sm:w-auto">
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
                <Button asChild size="lg" className="mt-4 w-full sm:w-auto">
                  <Link href={`/fondo/propuesta/${esperandoMiFirma[0].id}`}>
                    Revisar la primera
                    <ArrowRight size={20} weight="bold" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </Aparecer>
        ) : null}

        {/* Acceso rápido a proponer — el de pagar ya vive en la tarjeta de
            estado de arriba, repetirlo aquí sería el mismo botón dos veces. */}
        {directivo ? (
          <Button asChild size="lg">
            <Link href="/fondo/proponer">
              <HandCoins size={22} weight="fill" aria-hidden="true" />
              Proponer gasto
            </Link>
          </Button>
        ) : null}

        {/* Propuestas activas */}
        {propuestasPendientes.length > 0 ? (
          <section>
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

      {/* Columna secundaria: tablón de anuncios, completo en esta misma vista —
          no necesita ser una sección aparte del sidebar. El encabezado y el
          formulario de publicar quedan fijos; solo la lista scrollea dentro de
          su propia altura, para recorrer todo el tablón sin depender del
          scroll de la página entera. */}
      <div className="flex flex-col gap-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)]">
        <h2 className="shrink-0 text-h2 font-semibold text-marca-texto">
          Tablón de anuncios
        </h2>

        {directivo ? (
          <div className="shrink-0">
            <FormularioAnuncio />
          </div>
        ) : null}

        {anunciosOrdenados.length === 0 ? (
          <p className="rounded-lg border border-marca-borde bg-marca-superficie p-4 text-support text-marca-tenue">
            Todavía no hay anuncios en el tablón.
          </p>
        ) : (
          <div className="space-y-3 overflow-y-auto lg:pr-1">
            {anunciosOrdenados.map((a, i) => (
              <Aparecer key={a.id} retraso={0.05 * i}>
                <Card className={a.fijado ? "border-2 border-marca-secundario" : undefined}>
                  <CardContent className="flex gap-3">
                    <Megaphone
                      size={24}
                      weight="duotone"
                      color="#B8863B"
                      className="mt-0.5 shrink-0"
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {a.fijado ? (
                          <PushPin size={14} weight="fill" color="#B8863B" aria-hidden="true" />
                        ) : null}
                        <p className="text-body font-semibold text-marca-texto">
                          {a.titulo}
                        </p>
                      </div>
                      <p className="mt-1 text-support text-marca-tenue">
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
        )}
      </div>
    </div>
  );
}
