import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  CalendarCheck,
  HandHeart,
  Minus,
  UsersThree,
} from "@phosphor-icons/react/ssr";

import { Card, CardContent } from "@/components/ui/card";
import { MedidorScore } from "@/components/historial/medidor-score";
import { RecuperarScore } from "@/components/historial/recuperar-score";
import { USUARIO_ACTUAL, USUARIO_CON_DEUDA } from "@/lib/minka/mock-data";

export const metadata = { title: "Mi historial — Minka" };

export default async function HistorialPage({
  searchParams,
}: PageProps<"/historial">) {
  const params = await searchParams;
  // Afordancia de prototipo: `?demo=incumplimiento` muestra el historial en su estado
  // malo, con el camino de redención visible.
  const usuario =
    params.demo === "incumplimiento" ? USUARIO_CON_DEUDA : USUARIO_ACTUAL;

  // TODO: conectar a smart contract — leer el score, las métricas de reputación y
  // el historial de eventos del usuario directamente del contrato.

  const metricas = [
    {
      icono: UsersThree,
      valor: String(usuario.personasDistintas),
      etiqueta: "personas distintas",
      nota: "Lo que más pesa: cumplir con gente nueva, no repetir con los mismos",
    },
    {
      icono: CalendarCheck,
      valor: `${usuario.puntualidad}%`,
      etiqueta: "de cuotas a tiempo",
      nota: `${usuario.cuotasPagadas} cuotas aportadas en total`,
    },
    {
      icono: HandHeart,
      valor: `${usuario.avalesDados} / ${usuario.avalesRecibidos}`,
      etiqueta: "avales dados / recibidos",
      nota: "Respaldar a alguien que cumple también construye tu historial",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span
          className="grid size-14 shrink-0 place-items-center rounded-full bg-minka-primary text-h3 font-semibold text-white"
          aria-hidden="true"
        >
          {usuario.iniciales}
        </span>
        <div>
          <h1 className="text-display font-semibold text-minka-text">
            {usuario.nombre}
          </h1>
          <p className="text-body text-minka-muted">
            +51 {usuario.telefono} · plan{" "}
            {usuario.plan === "pro" ? "Organizador Pro" : "Gratuito"}
          </p>
        </div>
      </div>

      <MedidorScore score={usuario.score} />

      {usuario.deudaConFondo > 0 ? (
        <RecuperarScore
          deuda={usuario.deudaConFondo}
          scoreActual={usuario.score}
        />
      ) : null}

      <section>
        <h2 className="text-h2 font-semibold text-minka-text">
          Cómo se construye
        </h2>
        <p className="mt-1 text-body text-minka-muted">
          Llevas {usuario.juntasCompletadas}{" "}
          {usuario.juntasCompletadas === 1 ? "junta completa" : "juntas completas"}.
        </p>

        <div className="mt-4 space-y-3">
          {metricas.map((m) => {
            const Icono = m.icono;
            return (
              <Card key={m.etiqueta}>
                <CardContent className="flex gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-[#f7e6d5]">
                    <Icono
                      size={26}
                      weight="duotone"
                      color="#BF312A"
                      aria-hidden="true"
                    />
                  </span>
                  <div className="min-w-0">
                    <p className="text-h3 font-semibold text-minka-text">
                      {m.valor}{" "}
                      <span className="text-body font-normal text-minka-muted">
                        {m.etiqueta}
                      </span>
                    </p>
                    <p className="mt-1 text-support text-minka-muted">{m.nota}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-h2 font-semibold text-minka-text">
          Todo lo que ha pasado
        </h2>

        <ul className="mt-4 divide-y divide-minka-border overflow-hidden rounded-lg border border-minka-border bg-minka-surface">
          {usuario.historial.map((evento) => {
            const sube = evento.impactoScore > 0;
            const baja = evento.impactoScore < 0;
            const Flecha = sube ? ArrowUp : baja ? ArrowDown : Minus;
            const color = sube ? "#4B6B3A" : baja ? "#9C3232" : "#8A7A6D";

            return (
              <li key={evento.id} className="flex gap-3 p-4">
                <span
                  className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full"
                  style={{ backgroundColor: `${color}1a` }}
                >
                  <Flecha size={20} weight="bold" color={color} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-body text-minka-text">{evento.descripcion}</p>
                  <p className="mt-1 text-support text-minka-muted">
                    {evento.fecha}
                    {evento.impactoScore !== 0 ? (
                      <>
                        {" · "}
                        <span style={{ color }} className="font-semibold">
                          {sube ? "+" : ""}
                          {evento.impactoScore} de historial
                        </span>
                      </>
                    ) : null}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="space-y-3">
        <Link
          href="/planes"
          className="flex min-h-[56px] items-center justify-between rounded-lg border border-minka-border bg-minka-surface px-4 text-body font-semibold text-minka-text transition-colors hover:bg-[#f0e8db]"
        >
          Mi plan
          <span className="text-body font-normal text-minka-muted">
            {usuario.plan === "pro" ? "Organizador Pro" : `Gratuito · S/ 0`}
          </span>
        </Link>

        <Link
          href="/recuperar"
          className="flex min-h-[56px] items-center rounded-lg border border-minka-border bg-minka-surface px-4 text-body font-semibold text-minka-text transition-colors hover:bg-[#f0e8db]"
        >
          Mis contactos de confianza
        </Link>

        <Link
          href="/soporte"
          className="flex min-h-[56px] items-center rounded-lg border border-minka-border bg-minka-surface px-4 text-body font-semibold text-minka-text transition-colors hover:bg-[#f0e8db]"
        >
          Centro de ayuda
        </Link>
      </div>

      <p className="text-support text-minka-muted">
        Tu historial es tuyo y te acompaña a cualquier junta de Minka, con quien sea.
        Nadie lo puede borrar ni comprar.
      </p>
    </div>
  );
}
