"use client";

import { useState } from "react";
import { Megaphone, PushPin, Plus } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Aparecer } from "@/components/common/aparecer";
import { Spinner } from "@/components/common/spinner";
import { esDirectivo } from "@/lib/junta/rules";
import { useJunta } from "@/lib/junta/context";

/**
 * Tablón de anuncios.
 *
 * De una sola vía, a propósito: solo el directorio publica, todos los miembros
 * leen. Sin comentarios ni reacciones en esta versión — cualquier expansión a
 * interacción social queda fuera de este alcance.
 */
export default function AnunciosPage() {
  const { usuario, asociacion, anuncios, publicarAnuncio } = useJunta();
  const [abierto, setAbierto] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [fijado, setFijado] = useState(false);
  const [publicando, setPublicando] = useState(false);

  if (!usuario || !asociacion) return null;

  const directivo = esDirectivo(usuario);
  const valido = titulo.trim().length >= 3 && contenido.trim().length >= 10;

  async function publicar(e: React.FormEvent) {
    e.preventDefault();
    if (!valido || publicando) return;
    setPublicando(true);
    await new Promise((r) => setTimeout(r, 600));

    publicarAnuncio({ titulo: titulo.trim(), contenido: contenido.trim(), fijado });

    setPublicando(false);
    setAbierto(false);
    setTitulo("");
    setContenido("");
    setFijado(false);
  }

  const fijados = anuncios.filter((a) => a.fijado);
  const resto = anuncios.filter((a) => !a.fijado);
  const ordenados = [...fijados, ...resto];

  return (
    <div className="space-y-6">
      <Aparecer>
        <h1 className="text-display font-semibold text-marca-texto">
          Tablón de anuncios
        </h1>
        <p className="mt-1 text-body text-marca-tenue">{asociacion.nombreMercado}</p>
      </Aparecer>

      {directivo ? (
        abierto ? (
          <form
            onSubmit={publicar}
            className="space-y-4 rounded-lg border border-marca-borde bg-marca-superficie p-4"
          >
            <div>
              <Label htmlFor="titulo-anuncio" className="text-body font-semibold">
                Título
              </Label>
              <Input
                id="titulo-anuncio"
                className="mt-2"
                placeholder="Ej. Corte de agua programado"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="contenido-anuncio" className="text-body font-semibold">
                Mensaje
              </Label>
              <Textarea
                id="contenido-anuncio"
                className="mt-2 min-h-24"
                placeholder="Escribe el anuncio para todos los miembros de la asociación."
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={() => setFijado((f) => !f)}
              className="flex items-center gap-2 text-support font-semibold text-marca-texto"
              aria-pressed={fijado}
            >
              <PushPin
                size={18}
                weight={fijado ? "fill" : "regular"}
                color={fijado ? "#B8863B" : undefined}
                aria-hidden="true"
              />
              {fijado ? "Fijado arriba del tablón" : "Fijar arriba del tablón"}
            </button>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                className="flex-1"
                onClick={() => setAbierto(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1" disabled={!valido || publicando}>
                {publicando ? <Spinner /> : "Publicar"}
              </Button>
            </div>
          </form>
        ) : (
          <Button size="lg" className="w-full" onClick={() => setAbierto(true)}>
            <Plus size={20} weight="bold" aria-hidden="true" />
            Publicar anuncio
          </Button>
        )
      ) : null}

      {ordenados.length === 0 ? (
        <p className="rounded-lg border border-marca-borde bg-marca-superficie p-4 text-support text-marca-tenue">
          Todavía no hay anuncios en el tablón.
        </p>
      ) : (
        <div className="space-y-3">
          {ordenados.map((a, i) => (
            <Aparecer key={a.id} retraso={0.04 * i}>
              <Card className={a.fijado ? "border-2 border-marca-secundario" : undefined}>
                <CardContent className="flex gap-3">
                  <Megaphone
                    size={24}
                    weight="duotone"
                    color="#B8863B"
                    className="mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {a.fijado ? (
                        <PushPin size={16} weight="fill" color="#B8863B" aria-hidden="true" />
                      ) : null}
                      <p className="text-body font-semibold text-marca-texto">
                        {a.titulo}
                      </p>
                    </div>
                    <p className="mt-1 text-body text-marca-texto">{a.contenido}</p>
                    <p className="mt-2 text-support text-marca-tenue">
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
  );
}
