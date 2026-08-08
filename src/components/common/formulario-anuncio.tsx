"use client";

import { useState } from "react";
import { Plus, PushPin } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/common/spinner";
import { useJunta } from "@/lib/junta/context";

/**
 * Publicar un anuncio — solo directivos. De una sola vía, a propósito: sin
 * comentarios ni reacciones, cualquier expansión a interacción social queda
 * fuera de este alcance.
 */
export function FormularioAnuncio() {
  const { publicarAnuncio } = useJunta();
  const [abierto, setAbierto] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [fijado, setFijado] = useState(false);
  const [publicando, setPublicando] = useState(false);

  if (!abierto) {
    return (
      <Button size="lg" className="w-full" onClick={() => setAbierto(true)}>
        <Plus size={20} weight="bold" aria-hidden="true" />
        Publicar anuncio
      </Button>
    );
  }

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

  return (
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
  );
}
