"use client";

import { useEffect, useRef, useState } from "react";
import { PaperPlaneRight, WhatsappLogo } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/minka/spinner";
import { Logo } from "@/components/minka/logo";
import { cn } from "@/lib/utils";

interface Mensaje {
  rol: "usuario" | "asistente";
  texto: string;
}

/** Preguntas de arranque: quitan la página en blanco, que para este público es una barrera real. */
const SUGERENCIAS = [
  "¿Qué es la prima y por qué la pago?",
  "¿Qué pasa si alguien no paga su cuota?",
  "¿Qué diferencia hay entre junta tradicional y protegida?",
  "¿Qué es un aval y qué arriesga?",
  "¿Puedo pagar para cobrar mi turno antes?",
];

const SALUDO: Mensaje = {
  rol: "asistente",
  texto:
    "Hola, soy la ayuda de Minka. Pregúntame lo que quieras sobre tu junta, tus cuotas, la garantía o el aval. Te respondo en simple.",
};

export function ChatSoporte() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([SALUDO]);
  const [entrada, setEntrada] = useState("");
  const [enviando, setEnviando] = useState(false);
  const finRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [mensajes, enviando]);

  async function preguntar(texto: string) {
    const pregunta = texto.trim();
    if (!pregunta || enviando) return;

    const nuevos: Mensaje[] = [...mensajes, { rol: "usuario", texto: pregunta }];
    setMensajes(nuevos);
    setEntrada("");
    setEnviando(true);

    try {
      const res = await fetch("/api/soporte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mensajes: nuevos.filter((m) => m !== SALUDO),
        }),
      });
      const datos = await res.json();

      setMensajes((previos) => [
        ...previos,
        {
          rol: "asistente",
          texto:
            datos.respuesta ??
            datos.error ??
            "No pudimos responderte ahora. Intenta de nuevo.",
        },
      ]);
    } catch {
      setMensajes((previos) => [
        ...previos,
        {
          rol: "asistente",
          texto:
            "No se pudo conectar. Revisa tu internet e intenta de nuevo, o escríbenos por WhatsApp.",
        },
      ]);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex flex-col">
      {/* Conversación */}
      <div className="space-y-4">
        {mensajes.map((m, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-2.5",
              m.rol === "usuario" ? "justify-end" : "justify-start"
            )}
          >
            {m.rol === "asistente" ? (
              <span className="mt-1 shrink-0">
                <Logo variant="icono" size={28} />
              </span>
            ) : null}
            <p
              className={cn(
                "max-w-[85%] rounded-lg px-4 py-3 text-body whitespace-pre-wrap",
                m.rol === "usuario"
                  ? "bg-minka-primary text-white"
                  : "border border-minka-border bg-minka-surface text-minka-text"
              )}
            >
              {m.texto}
            </p>
          </div>
        ))}

        {enviando ? (
          <div className="flex items-center gap-2.5">
            <Logo variant="icono" size={28} />
            <p
              className="flex items-center gap-2 rounded-lg border border-minka-border bg-minka-surface px-4 py-3 text-body text-minka-muted"
              role="status"
              aria-live="polite"
            >
              <Spinner />
              Buscando tu respuesta…
            </p>
          </div>
        ) : null}

        <div ref={finRef} />
      </div>

      {/* Sugerencias: solo mientras la conversación no ha empezado */}
      {mensajes.length === 1 ? (
        <div className="mt-6">
          <p className="text-support font-semibold text-minka-muted">
            Lo que más nos preguntan
          </p>
          <ul className="mt-3 space-y-2">
            {SUGERENCIAS.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => preguntar(s)}
                  className="flex min-h-[52px] w-full items-center rounded-lg border border-minka-border bg-minka-surface px-4 text-left text-body text-minka-text transition-colors hover:bg-[#f0e8db]"
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Entrada */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          preguntar(entrada);
        }}
        className="sticky bottom-0 mt-6 flex gap-2 bg-minka-bg py-3"
      >
        <label htmlFor="pregunta" className="sr-only">
          Escribe tu pregunta
        </label>
        <input
          id="pregunta"
          value={entrada}
          onChange={(e) => setEntrada(e.target.value)}
          placeholder="Escribe tu pregunta…"
          autoComplete="off"
          className="h-12 w-full min-w-0 rounded-md border-2 border-minka-border bg-minka-surface px-4 text-body text-minka-text outline-none placeholder:text-minka-muted focus-visible:border-minka-primary focus-visible:ring-3 focus-visible:ring-minka-primary/25"
        />
        <Button
          type="submit"
          size="icon"
          aria-label="Enviar pregunta"
          disabled={!entrada.trim() || enviando}
        >
          <PaperPlaneRight size={22} weight="fill" />
        </Button>
      </form>

      <a
        href="https://wa.me/51987654321"
        className="flex min-h-[56px] items-center justify-center gap-2 rounded-lg border border-minka-border bg-minka-surface px-4 text-body font-semibold text-minka-text transition-colors hover:bg-[#f0e8db]"
      >
        <WhatsappLogo size={24} weight="fill" aria-hidden="true" />
        Hablar con una persona por WhatsApp
      </a>
    </div>
  );
}
