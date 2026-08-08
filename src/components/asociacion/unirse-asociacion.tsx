"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CaretLeft,
  CheckCircle,
  HandCoins,
  Users,
  Warning,
} from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/common/spinner";
import { soles } from "@/lib/junta/format";
import { formatoUmbral } from "@/lib/junta/rules";
import { useJunta } from "@/lib/junta/context";
import type { Asociacion } from "@/lib/junta/types";

/**
 * Unirse a una asociación.
 *
 * Dos pasos: encontrar la asociación por código, y confirmar el puesto. El
 * documento de producto lo resume en tres frases — código, datos del puesto,
 * confirmación de cupo — así que la pantalla no necesita más ceremonia que esa.
 */
export function UnirseAsociacion({
  codigoInicial,
}: {
  codigoInicial?: string;
}) {
  const { usuario, buscarAsociacionPorCodigo, unirseAsociacion } = useJunta();

  const [codigo, setCodigo] = useState(codigoInicial ?? "");
  const [asociacion, setAsociacion] = useState<Asociacion | null>(
    codigoInicial ? (buscarAsociacionPorCodigo(codigoInicial) ?? null) : null
  );
  const [error, setError] = useState<string | null>(null);
  const [buscando, setBuscando] = useState(false);
  const [numeroPuesto, setNumeroPuesto] = useState("");
  const [uniendo, setUniendo] = useState(false);
  const [listo, setListo] = useState(false);

  async function buscar(e: React.FormEvent) {
    e.preventDefault();
    if (buscando) return;
    setBuscando(true);
    setError(null);

    // TODO: conectar a Safe/smart contract — resolver el código contra el contrato
    // y traer las reglas reales de la asociación.
    await new Promise((r) => setTimeout(r, 700));

    const encontrada = buscarAsociacionPorCodigo(codigo);
    if (!encontrada) {
      setError(
        "No encontramos ninguna asociación con ese código. Revisa que esté bien escrito."
      );
      setAsociacion(null);
    } else {
      setAsociacion(encontrada);
    }
    setBuscando(false);
  }

  async function unirse() {
    if (uniendo || !asociacion || numeroPuesto.trim().length === 0) return;
    setUniendo(true);

    // TODO: conectar a Safe/smart contract — registrar al comerciante como
    // beneficiario del fondo de esta asociación.
    await new Promise((r) => setTimeout(r, 1000));

    unirseAsociacion(asociacion.id, numeroPuesto.trim());
    setUniendo(false);
    setListo(true);
  }

  /* ---------------- Confirmación ---------------- */
  if (listo && asociacion) {
    return (
      <div className="flex flex-col items-center py-10 text-center" role="status">
        <span className="grid size-20 place-items-center rounded-full bg-[#e3ede6]">
          <CheckCircle size={52} weight="fill" color="#4C8C5C" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-h2 font-semibold text-marca-texto">
          Ya estás dentro
        </h2>
        <p className="mt-2 max-w-sm text-body text-marca-tenue">
          Tu puesto {numeroPuesto} quedó registrado en &ldquo;
          {asociacion.nombreMercado}&rdquo;. Ya puedes pagar tu cuota y ver el fondo
          en todo momento.
        </p>
        <div className="mt-7 flex w-full max-w-xs flex-col gap-3">
          <Button asChild size="lg">
            <Link href="/fondo/pagar">Pagar mi primera cuota</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/inicio">Ir al inicio</Link>
          </Button>
        </div>
      </div>
    );
  }

  /* ---------------- Paso 1: buscar por código ---------------- */
  if (!asociacion) {
    return (
      <form onSubmit={buscar} className="space-y-6">
        <div>
          <Label htmlFor="codigo" className="text-body font-semibold">
            Código de tu asociación
          </Label>
          <Input
            id="codigo"
            className="mt-2 text-h3 font-semibold tracking-widest uppercase"
            placeholder="VES2026"
            autoCapitalize="characters"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
            aria-describedby="ayuda-codigo"
            aria-invalid={error ? true : undefined}
          />
          <p id="ayuda-codigo" className="mt-2 text-support text-marca-tenue">
            Te lo comparte un directivo de tu mercado, por WhatsApp o en persona.
          </p>
          {error ? (
            <p className="mt-3 flex gap-2 text-body font-semibold text-marca-peligro">
              <Warning size={22} weight="fill" className="shrink-0" aria-hidden="true" />
              {error}
            </p>
          ) : null}
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={codigo.trim().length < 4 || buscando}
        >
          {buscando ? (
            <>
              <Spinner />
              Buscando tu asociación…
            </>
          ) : (
            "Buscar asociación"
          )}
        </Button>

        <p className="rounded-lg border border-marca-borde bg-marca-superficie p-4 text-support text-marca-tenue">
          Para probar el prototipo: <strong>VES2026</strong> es la asociación demo
          del Mercado Villa El Salvador.
        </p>
      </form>
    );
  }

  /* ---------------- Paso 2: confirmar puesto ---------------- */
  const yaPerteneceAqui = usuario?.asociacionId === asociacion.id;
  const perteneceAOtra = !!usuario?.asociacionId && !yaPerteneceAqui;

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => {
          setAsociacion(null);
          setNumeroPuesto("");
        }}
        className="touch-target -ml-3 flex items-center gap-1 rounded-md pr-3 text-body font-semibold text-marca-texto transition-colors hover:bg-[#ece5d3]"
      >
        <CaretLeft size={22} weight="bold" aria-hidden="true" />
        Usar otro código
      </button>

      <div>
        <h2 className="text-h2 font-semibold text-marca-texto">
          {asociacion.nombreMercado}
        </h2>
        <p className="mt-2 flex items-center gap-2 text-body text-marca-tenue">
          <Users size={22} weight="duotone" aria-hidden="true" />
          {asociacion.numeroPuestos} puestos · firma {formatoUmbral(asociacion)}
        </p>
      </div>

      {yaPerteneceAqui ? (
        <div className="rounded-lg border-2 border-marca-primario bg-[#e3ede6] p-5">
          <p className="flex items-center gap-2 text-body font-semibold text-[#1F5C3D]">
            <CheckCircle size={24} weight="fill" aria-hidden="true" />
            Ya perteneces a esta asociación
          </p>
          <Button asChild size="lg" className="mt-4 w-full">
            <Link href="/fondo">Ver el fondo</Link>
          </Button>
        </div>
      ) : perteneceAOtra ? (
        <p className="rounded-lg border border-marca-secundario bg-[#f5e9d3] p-4 text-body text-marca-texto">
          Tu cuenta ya pertenece a otra asociación. En este prototipo cada cuenta
          pertenece a un solo mercado a la vez.
        </p>
      ) : (
        <>
          <div className="rounded-lg border border-marca-borde bg-marca-superficie p-4">
            <p className="flex items-center gap-2 text-body font-semibold text-marca-texto">
              <HandCoins size={22} weight="duotone" color="#1F5C3D" aria-hidden="true" />
              Tu cuota será de {soles(50)} al mes
            </p>
            <p className="mt-1 text-support text-marca-tenue">
              {asociacion.configuracion.mora.activa
                ? `Si te atrasas, hay un recargo de ${asociacion.configuracion.mora.porcentaje}%.`
                : "Esta asociación no cobra mora por atraso."}
            </p>
          </div>

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
            <p className="mt-2 text-support text-marca-tenue">
              Con este número te identifican los demás comerciantes y el
              directorio.
            </p>
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={unirse}
            disabled={uniendo || numeroPuesto.trim().length === 0}
          >
            {uniendo ? (
              <>
                <Spinner />
                Registrando tu puesto…
              </>
            ) : (
              "Confirmar mi puesto"
            )}
          </Button>
        </>
      )}
    </div>
  );
}
