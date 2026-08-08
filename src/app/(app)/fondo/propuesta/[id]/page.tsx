"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { CaretLeft, CheckCircle, Signature, Warning } from "@phosphor-icons/react/ssr";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/common/spinner";
import { soles } from "@/lib/junta/format";
import { esDirectivo, firmasFaltantes, puedeEjecutarse, yaFirmo } from "@/lib/junta/rules";
import { useJunta } from "@/lib/junta/context";
import { cn } from "@/lib/utils";

const LARGO_PIN = 4;

/**
 * Firmar / aprobar una propuesta de gasto.
 *
 * El documento marca esta pantalla como la más delicada del producto: "no es un
 * trámite de papel ni firma escaneada — es autorización real de movimiento de
 * fondos". Por eso lleva confirmación de PIN, no solo un toque, y el contador de
 * firmas es lo primero que se ve.
 */
export default function FirmarPropuestaPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { usuario, propuestas, firmarPropuesta } = useJunta();

  const [digitos, setDigitos] = useState<string[]>(Array(LARGO_PIN).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [firmando, setFirmando] = useState(false);
  const [resultado, setResultado] = useState<"ejecutada" | "firmada" | null>(null);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const propuesta = propuestas.find((p) => p.id === id);

  if (!usuario) return null;

  if (!propuesta) {
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <Warning size={48} weight="duotone" color="#B8863B" aria-hidden="true" />
        <p className="mt-4 max-w-sm text-body text-marca-tenue">
          No encontramos esta propuesta. Puede que ya no exista.
        </p>
        <Button asChild size="lg" className="mt-7">
          <Link href="/fondo">Volver al fondo</Link>
        </Button>
      </div>
    );
  }

  const directivo = esDirectivo(usuario);
  const completa = puedeEjecutarse(propuesta);
  const yo_firme = yaFirmo(propuesta, usuario.id);
  const faltan = firmasFaltantes(propuesta);
  const pin = digitos.join("");
  const pinCompleto = pin.length === LARGO_PIN;

  function escribir(i: number, valor: string) {
    const limpio = valor.replace(/\D/g, "");
    setError(null);
    if (!limpio) {
      setDigitos((d) => d.map((v, k) => (k === i ? "" : v)));
      return;
    }
    if (limpio.length > 1) {
      const nuevos = limpio.slice(0, LARGO_PIN).split("");
      setDigitos(Array.from({ length: LARGO_PIN }, (_, k) => nuevos[k] ?? ""));
      refs.current[Math.min(nuevos.length, LARGO_PIN - 1)]?.focus();
      return;
    }
    setDigitos((d) => d.map((v, k) => (k === i ? limpio : v)));
    if (i < LARGO_PIN - 1) refs.current[i + 1]?.focus();
  }

  function retroceder(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digitos[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  }

  const firmar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinCompleto || firmando) return;
    setFirmando(true);
    setError(null);

    // TODO: conectar a Safe/smart contract — la confirmación real es una firma
    // criptográfica del Safe (passkey o clave del dispositivo), este PIN solo
    // simula esa fricción en el prototipo.
    await new Promise((r) => setTimeout(r, 900));

    const resultadoFirma = firmarPropuesta(propuesta.id, pin);
    if (!resultadoFirma.ok) {
      setError(resultadoFirma.error);
      setDigitos(Array(LARGO_PIN).fill(""));
      refs.current[0]?.focus();
      setFirmando(false);
      return;
    }

    setFirmando(false);
    setResultado(resultadoFirma.ejecutada ? "ejecutada" : "firmada");
  };

  /* ---------------- Confirmación tras firmar ---------------- */
  if (resultado) {
    const ejecutada = resultado === "ejecutada";
    return (
      <div className="flex flex-col items-center py-10 text-center" role="status">
        <span className="grid size-20 place-items-center rounded-full bg-[#e3ede6]">
          <CheckCircle size={52} weight="fill" color="#4C8C5C" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-h2 font-semibold text-marca-texto">
          {ejecutada ? "Gasto ejecutado" : "Firma registrada"}
        </h1>
        <p className="mt-2 max-w-sm text-body text-marca-tenue">
          {ejecutada
            ? `Se juntaron las firmas necesarias y el gasto de ${soles(propuesta.monto)} ya salió del fondo.`
            : `Tu firma quedó registrada. Falta ${faltan} de los demás directivos.`}
        </p>
        <div className="mt-7 flex w-full max-w-xs flex-col gap-3">
          <Button asChild size="lg">
            <Link href="/fondo">Ver el fondo</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/inicio">Ir al inicio</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => router.push("/fondo")}
        className="touch-target -ml-3 flex items-center gap-1 rounded-md pr-3 text-body font-semibold text-marca-texto transition-colors hover:bg-[#ece5d3]"
      >
        <CaretLeft size={22} weight="bold" aria-hidden="true" />
        Volver al fondo
      </button>

      <div className="rounded-lg border border-marca-borde bg-marca-superficie p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-support text-marca-tenue">{propuesta.categoria}</p>
            <p className="mt-0.5 text-[32px] leading-none font-semibold text-marca-peligro">
              {soles(propuesta.monto)}
            </p>
          </div>
          {propuesta.estado === "ejecutada" ? (
            <Badge variant="success">Ejecutada</Badge>
          ) : (
            <Badge variant={completa ? "success" : "outline"}>
              {propuesta.firmas.length} de {propuesta.umbralRequerido} firmas
            </Badge>
          )}
        </div>
        <p className="mt-4 text-body text-marca-texto">{propuesta.motivo}</p>
        <p className="mt-3 text-support text-marca-tenue">
          Propuesto por {propuesta.propuestoPorNombre} · {propuesta.fecha}
        </p>
      </div>

      {propuesta.estado === "pendiente" ? (
        <div
          className="h-2 w-full overflow-hidden rounded-sm bg-[#ece5d3]"
          role="progressbar"
          aria-valuenow={propuesta.firmas.length}
          aria-valuemin={0}
          aria-valuemax={propuesta.umbralRequerido}
          aria-label={`${propuesta.firmas.length} de ${propuesta.umbralRequerido} firmas`}
        >
          <span
            className="block h-full rounded-sm bg-marca-primario transition-[width] duration-200"
            style={{
              width: `${(propuesta.firmas.length / propuesta.umbralRequerido) * 100}%`,
            }}
          />
        </div>
      ) : null}

      <div>
        <p className="text-support font-semibold text-marca-tenue">
          Firmantes hasta ahora
        </p>
        <ul className="mt-2 space-y-2">
          {propuesta.firmas.map((f) => (
            <li
              key={f.directivoId}
              className="flex items-center gap-2 text-body text-marca-texto"
            >
              <CheckCircle size={20} weight="fill" color="#4C8C5C" aria-hidden="true" />
              {f.directivoNombre}
            </li>
          ))}
          {propuesta.firmas.length === 0 ? (
            <li className="text-body text-marca-tenue">Todavía nadie ha firmado.</li>
          ) : null}
        </ul>
      </div>

      {propuesta.estado !== "pendiente" ? (
        <p className="rounded-lg border border-marca-primario bg-[#e3ede6] p-4 text-body font-semibold text-[#1F5C3D]">
          Esta propuesta ya {propuesta.estado === "ejecutada" ? "se ejecutó" : "fue rechazada"}.
        </p>
      ) : !directivo ? (
        <p className="rounded-lg border border-marca-borde bg-marca-superficie p-4 text-body text-marca-tenue">
          Solo el directorio puede firmar propuestas de gasto.
        </p>
      ) : yo_firme ? (
        <p className="flex items-center gap-2 rounded-lg border border-marca-primario bg-[#e3ede6] p-4 text-body font-semibold text-[#1F5C3D]">
          <CheckCircle size={22} weight="fill" aria-hidden="true" />
          Ya firmaste esta propuesta. Faltan {faltan}{" "}
          {faltan === 1 ? "firma" : "firmas"} de los demás directivos.
        </p>
      ) : (
        <form onSubmit={firmar} className="space-y-5">
          <fieldset>
            <legend className="flex items-center gap-2 text-body font-semibold text-marca-texto">
              <Signature size={20} weight="duotone" aria-hidden="true" />
              Ingresa tu PIN para firmar
            </legend>
            <div className="mt-3 flex justify-center gap-3">
              {digitos.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  type="password"
                  inputMode="numeric"
                  maxLength={LARGO_PIN}
                  value={d}
                  onChange={(e) => escribir(i, e.target.value)}
                  onKeyDown={(e) => retroceder(i, e)}
                  aria-label={`Dígito ${i + 1} de ${LARGO_PIN} del PIN`}
                  aria-invalid={error ? true : undefined}
                  className={cn(
                    "h-14 w-14 rounded-md border-2 bg-marca-superficie text-center text-[24px] font-semibold text-marca-texto outline-none transition-colors",
                    d ? "border-marca-primario" : "border-marca-borde",
                    "focus-visible:border-marca-primario focus-visible:ring-3 focus-visible:ring-marca-primario/25"
                  )}
                />
              ))}
            </div>
            {error ? (
              <p className="mt-3 flex items-center justify-center gap-2 text-body font-semibold text-marca-peligro">
                <Warning size={20} weight="fill" aria-hidden="true" />
                {error}
              </p>
            ) : (
              <p className="mt-3 text-center text-support text-marca-tenue">
                PIN de prueba: 1234
              </p>
            )}
          </fieldset>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={!pinCompleto || firmando}
          >
            {firmando ? (
              <>
                <Spinner />
                Verificando tu firma…
              </>
            ) : (
              "Firmar y aprobar"
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
