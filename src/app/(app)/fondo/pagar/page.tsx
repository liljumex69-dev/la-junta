"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle, QrCode } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/common/spinner";
import { soles } from "@/lib/junta/format";
import { formatoPeriodo } from "@/lib/junta/format";
import { useJunta } from "@/lib/junta/context";

/**
 * Pagar cuota escaneando un QR (Yape o Plin).
 *
 * El documento lo resume en una frase: monto fijo, un solo paso de confirmación,
 * tal como el comerciante ya paga hoy cualquier otra cosa en su puesto. Por eso no
 * hay formulario — solo el QR, el monto, y confirmar.
 */
export default function PagarCuotaPage() {
  const { usuario, cuotas, pagarCuota } = useJunta();
  const [pagando, setPagando] = useState(false);
  const [pagado, setPagado] = useState(false);

  if (!usuario) return null;

  const miCuotaPendiente = cuotas
    .filter((c) => c.comercianteId === usuario.id && c.estado !== "pagado")
    .sort((a, b) => a.periodo.localeCompare(b.periodo))[0];

  async function pagar() {
    if (pagando || !miCuotaPendiente) return;
    setPagando(true);

    // TODO: conectar a Safe/smart contract — este paso hoy solo simula el escaneo;
    // el pago real llega vía Yape/Plin y se registra en el Safe de la asociación.
    await new Promise((r) => setTimeout(r, 1200));

    pagarCuota(miCuotaPendiente.id);
    setPagando(false);
    setPagado(true);
  }

  if (pagado) {
    return (
      <div className="flex flex-col items-center py-10 text-center" role="status">
        <span className="grid size-20 place-items-center rounded-full bg-[#e3ede6]">
          <CheckCircle size={52} weight="fill" color="#4C8C5C" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-h2 font-semibold text-marca-texto">
          Cuota pagada
        </h1>
        <p className="mt-2 max-w-sm text-body text-marca-tenue">
          Tu aporte ya forma parte del fondo colectivo. Cualquier miembro puede
          verlo en el historial del fondo.
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

  if (!miCuotaPendiente) {
    return (
      <div className="flex flex-col items-center py-10 text-center" role="status">
        <span className="grid size-20 place-items-center rounded-full bg-[#e3ede6]">
          <CheckCircle size={52} weight="fill" color="#4C8C5C" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-h2 font-semibold text-marca-texto">
          Ya estás al día
        </h1>
        <p className="mt-2 max-w-sm text-body text-marca-tenue">
          No tienes cuotas pendientes en este momento.
        </p>
        <Button asChild size="lg" className="mt-7">
          <Link href="/inicio">Ir al inicio</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-display font-semibold text-marca-texto">
          Pagar mi cuota
        </h1>
        <p className="mt-1 text-body text-marca-tenue">
          {formatoPeriodo(miCuotaPendiente.periodo)} · Puesto{" "}
          {usuario.numeroPuesto ?? "—"}
        </p>
      </div>

      <div className="rounded-lg border-2 border-marca-primario bg-[#e9f0ec] p-6 text-center">
        <p className="text-support font-semibold text-[#1F5C3D]">
          Monto a pagar
        </p>
        <p className="mt-1 text-[40px] leading-none font-semibold text-marca-texto">
          {soles(miCuotaPendiente.monto)}
        </p>
      </div>

      <div className="flex flex-col items-center rounded-lg border border-marca-borde bg-marca-superficie p-6">
        {/* TODO: conectar a Safe/smart contract — el QR real debe apuntar a la
            cuenta Yape/Plin verificada de la asociación, no a un mock visual. */}
        <div
          className="grid size-48 place-items-center rounded-md border-2 border-dashed border-marca-borde bg-white"
          role="img"
          aria-label="Código QR para pagar con Yape o Plin"
        >
          <QrCode size={96} weight="thin" color="#24312B" aria-hidden="true" />
        </div>
        <p className="mt-4 text-support text-marca-tenue">
          Escanea con tu app de Yape o Plin para pagar
        </p>
      </div>

      <Button size="lg" className="w-full" onClick={pagar} disabled={pagando}>
        {pagando ? (
          <>
            <Spinner />
            Confirmando tu pago…
          </>
        ) : (
          "Ya escaneé y pagué"
        )}
      </Button>

      <p className="text-support text-marca-tenue">
        Al confirmar, tu cuota queda registrada de inmediato en el fondo,
        visible para toda la asociación.
      </p>
    </div>
  );
}
