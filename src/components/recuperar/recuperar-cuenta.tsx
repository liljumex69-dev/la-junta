"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle, Clock, UsersThree } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/common/spinner";

interface Contacto {
  id: string;
  nombre: string;
  iniciales: string;
}

/**
 * Contactos de ejemplo para esta pantalla.
 *
 * Recuperar cuenta es, por definición, algo que pasa sin sesión activa — la
 * persona perdió el acceso a su número. Como el prototipo guarda los contactos
 * de confianza dentro del estado de un usuario ya logueado, aquí se usa un
 * ejemplo fijo para mostrar el patrón completo.
 *
 * TODO: conectar a Safe/smart contract — en producción, esta pantalla recibe el
 * número de teléfono a recuperar (paso anterior) y consulta los guardianes
 * reales configurados para esa cuenta, no una lista local.
 */
const CONTACTOS_DEMO: Contacto[] = [
  { id: "c-1", nombre: "Rosa Medina Quispe", iniciales: "RM" },
  { id: "c-2", nombre: "Julio Bautista Campos", iniciales: "JB" },
  { id: "c-3", nombre: "Marco Huamán Torres", iniciales: "MH" },
];

/**
 * Recuperación de cuenta por contactos de confianza.
 *
 * Nunca una frase semilla. Pedirle a un comerciante de mercado que guarde 12
 * palabras en papel y no las pierda es trasladarle un problema que el producto
 * tiene que resolver. En su lugar, 2 o 3 personas que ya lo conocen confirman
 * que es él — la misma confianza con la que ya funciona su asociación.
 */
export function RecuperarCuenta() {
  const [enCurso, setEnCurso] = useState(false);
  const [iniciando, setIniciando] = useState(false);
  const [confirmados, setConfirmados] = useState<string[]>([]);

  const requeridos = Math.min(2, CONTACTOS_DEMO.length);
  const suficientes = confirmados.length >= requeridos;

  async function iniciar() {
    if (iniciando) return;
    setIniciando(true);

    // TODO: conectar a Safe/smart contract — abrir el proceso de recuperación
    // social y notificar a los contactos de confianza para que confirmen.
    await new Promise((r) => setTimeout(r, 1000));
    setIniciando(false);
    setEnCurso(true);
  }

  // Simulación de las confirmaciones que irían llegando de cada contacto.
  useEffect(() => {
    if (!enCurso || suficientes) return;
    const id = window.setTimeout(() => {
      setConfirmados((previos) => {
        const siguiente = CONTACTOS_DEMO.find((c) => !previos.includes(c.id));
        return siguiente ? [...previos, siguiente.id] : previos;
      });
    }, 2600);
    return () => window.clearTimeout(id);
  }, [enCurso, confirmados, suficientes]);

  return (
    <div className="space-y-6">
      <div className="flex gap-3 rounded-lg border border-marca-borde bg-marca-superficie p-4">
        <UsersThree
          size={28}
          weight="duotone"
          color="#B8863B"
          className="shrink-0"
          aria-hidden="true"
        />
        <p className="text-body text-marca-texto">
          En Junta no hay ninguna clave secreta que puedas perder. Si cambias de
          celular o pierdes el acceso, {requeridos} de tus contactos de
          confianza confirman que eres tú y vuelves a entrar.
        </p>
      </div>

      <section>
        <h2 className="text-h2 font-semibold text-marca-texto">
          Tus contactos de confianza
        </h2>
        <p className="mt-1 text-body text-marca-tenue">
          Personas que te conocen y con las que ya compartes tu asociación.
        </p>

        <ul className="mt-4 space-y-3">
          {CONTACTOS_DEMO.map((c) => {
            const confirmo = confirmados.includes(c.id);
            return (
              <li key={c.id}>
                <Card>
                  <CardContent className="flex items-center gap-3">
                    <span
                      className="grid size-12 shrink-0 place-items-center rounded-full bg-[#ece5d3] text-body font-semibold text-marca-texto"
                      aria-hidden="true"
                    >
                      {c.iniciales}
                    </span>
                    <span className="min-w-0 flex-1 text-body font-semibold text-marca-texto">
                      {c.nombre}
                    </span>

                    {!enCurso ? null : confirmo ? (
                      <span className="flex items-center gap-1.5 text-support font-semibold text-marca-exito">
                        <CheckCircle size={22} weight="fill" aria-hidden="true" />
                        Confirmó
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-support font-semibold text-marca-tenue">
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
      </section>

      {enCurso ? (
        <div
          className={
            suficientes
              ? "rounded-lg border-2 border-marca-exito bg-[#e3ede6] p-5"
              : "rounded-lg border-2 border-marca-borde bg-marca-superficie p-5"
          }
          role="status"
          aria-live="polite"
        >
          {suficientes ? (
            <>
              <h2 className="flex items-center gap-2 text-h3 font-semibold text-marca-exito">
                <CheckCircle size={26} weight="fill" aria-hidden="true" />
                Ya puedes volver a entrar
              </h2>
              <p className="mt-3 text-body text-marca-texto">
                {confirmados.length} de tus contactos confirmaron que eres tú. Tu
                fondo, tus cuotas y tu historial quedaron intactos.
              </p>
              <Button asChild size="lg" className="mt-5 w-full">
                <Link href="/inicio">Entrar a mi cuenta</Link>
              </Button>
            </>
          ) : (
            <>
              <h2 className="text-h3 font-semibold text-marca-texto">
                Esperando confirmaciones
              </h2>
              <p className="mt-2 text-body text-marca-texto">
                {confirmados.length} de {requeridos} confirmaron. Les llegó un
                aviso por WhatsApp para verificar que eres tú.
              </p>
              <p className="mt-3 text-body text-marca-tenue">
                Puedes cerrar esta pantalla: te avisamos apenas terminen.
              </p>
            </>
          )}
        </div>
      ) : (
        <section>
          <h2 className="text-h2 font-semibold text-marca-texto">
            ¿Perdiste el acceso?
          </h2>
          <p className="mt-2 text-body text-marca-tenue">
            Les avisamos a tus contactos para que confirmen que eres tú. Nadie
            más que ellos puede aprobarlo.
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
