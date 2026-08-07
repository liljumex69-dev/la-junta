"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CheckCircle,
  Clock,
  Plus,
  UsersThree,
} from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/minka/spinner";

interface Contacto {
  id: string;
  nombre: string;
  iniciales: string;
  confirmado: boolean;
}

/**
 * Recuperación de cuenta por contactos de confianza.
 *
 * Nunca una frase semilla. Pedirle a una vendedora de mercado que guarde 12 palabras
 * en papel y no las pierda es trasladarle un problema que el producto tiene que
 * resolver. En su lugar, 2 o 3 personas que ya la conocen confirman que es ella —
 * que es exactamente como funciona la confianza en una junta de verdad.
 */
export function RecuperarCuenta({ contactos }: { contactos: Contacto[] }) {
  const [enCurso, setEnCurso] = useState(false);
  const [iniciando, setIniciando] = useState(false);
  const [confirmados, setConfirmados] = useState<string[]>([]);

  const requeridos = Math.min(2, contactos.length);
  const suficientes = confirmados.length >= requeridos;

  async function iniciar() {
    if (iniciando) return;
    setIniciando(true);

    // TODO: conectar a smart contract — abrir el proceso de recuperación social y
    // notificar a los contactos de confianza para que firmen la restitución del acceso.
    await new Promise((r) => setTimeout(r, 1000));
    setIniciando(false);
    setEnCurso(true);
  }

  // Simulación de las confirmaciones que irían llegando de cada contacto.
  // TODO: conectar a smart contract — reemplazar por la lectura de las firmas reales.
  useEffect(() => {
    if (!enCurso || suficientes) return;
    const id = window.setTimeout(() => {
      setConfirmados((previos) => {
        const siguiente = contactos.find((c) => !previos.includes(c.id));
        return siguiente ? [...previos, siguiente.id] : previos;
      });
    }, 2600);
    return () => window.clearTimeout(id);
  }, [enCurso, confirmados, contactos, suficientes]);

  return (
    <div className="space-y-6">
      <div className="flex gap-3 rounded-lg border border-minka-border bg-minka-surface p-4">
        <UsersThree
          size={28}
          weight="duotone"
          color="#BF312A"
          className="shrink-0"
          aria-hidden="true"
        />
        <p className="text-body text-minka-text">
          En Minka no hay una clave secreta que puedas perder. Si cambias de celular o
          pierdes el acceso, {requeridos} de tus contactos de confianza confirman que
          eres tú y vuelves a entrar.
        </p>
      </div>

      <section>
        <h2 className="text-h2 font-semibold text-minka-text">
          Tus contactos de confianza
        </h2>
        <p className="mt-1 text-body text-minka-muted">
          Personas que te conocen y con las que ya has estado en juntas.
        </p>

        <ul className="mt-4 space-y-3">
          {contactos.map((c) => {
            const confirmo = confirmados.includes(c.id);
            return (
              <li key={c.id}>
                <Card>
                  <CardContent className="flex items-center gap-3">
                    <span
                      className="grid size-12 shrink-0 place-items-center rounded-full bg-[#ece4d8] text-body font-semibold text-minka-text"
                      aria-hidden="true"
                    >
                      {c.iniciales}
                    </span>
                    <span className="min-w-0 flex-1 text-body font-semibold text-minka-text">
                      {c.nombre}
                    </span>

                    {!enCurso ? null : confirmo ? (
                      <span className="flex items-center gap-1.5 text-support font-semibold text-minka-success">
                        <CheckCircle size={22} weight="fill" aria-hidden="true" />
                        Confirmó
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-support font-semibold text-minka-muted">
                        <Clock size={22} weight="duotone" aria-hidden="true" />
                        Esperando
                      </span>
                    )}
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>

        {!enCurso ? (
          <Button variant="outline" size="lg" className="mt-4 w-full">
            <Plus size={22} weight="bold" aria-hidden="true" />
            Agregar otro contacto
          </Button>
        ) : null}
      </section>

      {enCurso ? (
        <div
          className={
            suficientes
              ? "rounded-lg border-2 border-minka-success bg-[#eef2e9] p-5"
              : "rounded-lg border-2 border-minka-border bg-minka-surface p-5"
          }
          role="status"
          aria-live="polite"
        >
          {suficientes ? (
            <>
              <h2 className="flex items-center gap-2 text-h3 font-semibold text-minka-success">
                <CheckCircle size={26} weight="fill" aria-hidden="true" />
                Ya puedes volver a entrar
              </h2>
              <p className="mt-3 text-body text-minka-text">
                {confirmados.length} de tus contactos confirmaron que eres tú. Tus
                juntas y tu historial quedaron intactos.
              </p>
              <Button asChild size="lg" className="mt-5 w-full">
                <Link href="/inicio">Entrar a mi cuenta</Link>
              </Button>
            </>
          ) : (
            <>
              <h2 className="text-h3 font-semibold text-minka-text">
                Esperando confirmaciones
              </h2>
              <p className="mt-2 text-body text-minka-text">
                {confirmados.length} de {requeridos} confirmaron. Les llegó un aviso
                por WhatsApp para verificar que eres tú.
              </p>
              <p className="mt-3 text-body text-minka-muted">
                Puedes cerrar esta pantalla: te avisamos apenas terminen.
              </p>
            </>
          )}
        </div>
      ) : (
        <section>
          <h2 className="text-h2 font-semibold text-minka-text">
            ¿Perdiste el acceso?
          </h2>
          <p className="mt-2 text-body text-minka-muted">
            Les avisamos a tus contactos para que confirmen que eres tú. Nadie más que
            ellos puede aprobarlo.
          </p>
          <Button
            size="lg"
            className="mt-4 w-full"
            onClick={iniciar}
            disabled={iniciando}
          >
            {iniciando ? (
              <>
                <Spinner />
                Avisando a tus contactos…
              </>
            ) : (
              "Recuperar mi cuenta"
            )}
          </Button>
        </section>
      )}
    </div>
  );
}
