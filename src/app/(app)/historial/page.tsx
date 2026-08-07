"use client";

import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  CalendarCheck,
  HandHeart,
  Minus,
  Sparkle,
  UsersThree,
} from "@phosphor-icons/react/ssr";

import { Card, CardContent } from "@/components/ui/card";
import { MedidorScore } from "@/components/historial/medidor-score";
import { RecuperarScore } from "@/components/historial/recuperar-score";
import { Aparecer } from "@/components/minka/aparecer";
import { useSesion } from "@/lib/minka/prototipo/sesion";
import { nivelDe } from "@/lib/minka/niveles";

export default function HistorialPage() {
  const { usuario } = useSesion();
  if (!usuario) return null;

  const nivel = nivelDe(usuario.score);
  const esNuevo = usuario.historial.length === 0;

  const metricas = [
    {
      icono: UsersThree,
      valor: String(usuario.personasDistintas),
      etiqueta: "personas distintas",
      nota: "Lo que más pesa: cumplir con gente nueva, no repetir con los mismos",
    },
    {
      icono: CalendarCheck,
      valor: usuario.cuotasPagadas > 0 ? `${usuario.puntualidad}%` : "—",
      etiqueta: "de cuotas a tiempo",
      nota:
        usuario.cuotasPagadas > 0
          ? `${usuario.cuotasPagadas} cuotas aportadas en total`
          : "Todavía no has aportado ninguna cuota",
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
      <Aparecer>
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
      </Aparecer>

      <Aparecer retraso={0.05}>
        <MedidorScore score={usuario.score} />
      </Aparecer>

      {usuario.deudaConFondo > 0 ? (
        <RecuperarScore
          deuda={usuario.deudaConFondo}
          scoreActual={usuario.score}
        />
      ) : null}

      {/* Estado vacío: alguien recién registrado no tiene nada que mirar todavía */}
      {esNuevo ? (
        <Card>
          <CardContent className="flex flex-col items-center py-8 text-center">
            <Sparkle size={44} weight="duotone" color={nivel.color} aria-hidden="true" />
            <h2 className="mt-4 text-h3 font-semibold text-minka-text">
              Tu historial empieza aquí
            </h2>
            <p className="mt-2 max-w-sm text-body text-minka-muted">
              Estás en nivel {nivel.nombre}, sin nada en contra. Con cada cuota que
              pagues a tiempo tu historial sube, y te van pidiendo menos garantía para
              cobrar temprano.
            </p>
            <Link
              href="/niveles"
              className="touch-target mt-4 inline-flex items-center rounded-md px-2 text-body font-semibold text-minka-primary underline underline-offset-4"
            >
              Ver cómo suben los niveles
            </Link>
          </CardContent>
        </Card>
      ) : null}

      <section>
        <h2 className="text-h2 font-semibold text-minka-text">Cómo se construye</h2>
        <p className="mt-1 text-body text-minka-muted">
          {usuario.juntasCompletadas === 0
            ? "Todavía no has completado ninguna junta."
            : `Llevas ${usuario.juntasCompletadas} ${
                usuario.juntasCompletadas === 1
                  ? "junta completa"
                  : "juntas completas"
              }.`}
        </p>

        <div className="mt-4 space-y-3">
          {metricas.map((m, i) => {
            const Icono = m.icono;
            return (
              <Aparecer key={m.etiqueta} retraso={0.04 * i}>
                <Card>
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
              </Aparecer>
            );
          })}
        </div>
      </section>

      {!esNuevo ? (
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
      ) : null}

      <div className="space-y-3">
        {[
          { href: "/niveles" as const, label: "Cómo suben los niveles", extra: nivel.nombre },
          {
            href: "/planes" as const,
            label: "Mi plan",
            extra: usuario.plan === "pro" ? "Organizador Pro" : "Gratuito · S/ 0",
          },
          { href: "/recuperar" as const, label: "Mis contactos de confianza", extra: "" },
          { href: "/soporte" as const, label: "Centro de ayuda", extra: "" },
        ].map((fila) => (
          <Link
            key={fila.href}
            href={fila.href}
            className="flex min-h-[56px] items-center justify-between rounded-lg border border-minka-border bg-minka-surface px-4 text-body font-semibold text-minka-text transition-colors hover:bg-[#f0e8db]"
          >
            {fila.label}
            {fila.extra ? (
              <span className="text-body font-normal text-minka-muted">
                {fila.extra}
              </span>
            ) : null}
          </Link>
        ))}
      </div>

      <p className="text-support text-minka-muted">
        Tu historial es tuyo y te acompaña a cualquier junta de Minka, con quien sea.
        Nadie lo puede borrar ni comprar.
      </p>
    </div>
  );
}
