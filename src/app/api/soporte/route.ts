import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

/**
 * Chat del centro de ayuda.
 *
 * Usa la API de Claude con el contexto de producto de Junta como system prompt.
 * No necesita un reglamento aparte: el mismo contexto que define el producto es lo
 * que responde las dudas sobre umbral de firmas, cuotas, mora y ahorro personal.
 */

/**
 * Contexto de producto — texto exacto acordado para el asistente, sin
 * modificaciones: es la base sobre la que responde cualquier pregunta.
 */
const CONTEXTO_JUNTA = `Junta es una tesorería digital para asociaciones de comerciantes de mercado en Perú, construida sobre Safe con firma múltiple en Arbitrum: ningún directivo puede mover el fondo solo, se necesita un umbral de firmas configurable por cada asociación (ej. 3 de 5). Los comerciantes pagan su cuota mensual escaneando un QR con Yape o Plin; el fondo es visible y verificable por cualquier miembro en todo momento. Un directivo propone un gasto, los demás lo aprueban con firma (PIN/huella), y solo se ejecuta al llegar al umbral — nunca antes. La tasa de mora es configurable por cada asociación, incluso puede desactivarse. Cada comerciante puede además llevar un ahorro personal separado, organizado por categorías, sin necesitar firma de nadie más. El historial de cumplimiento es la base para un futuro acceso a microcrédito real.`;

const SYSTEM_PROMPT = `${CONTEXTO_JUNTA}

Eres el asistente del centro de ayuda de Junta. Respondes dudas de personas que usan la app.

Sobre quién te escribe: comerciantes y directivos de asociaciones de mercado en Perú, con poca familiaridad con apps y ninguna con tecnología blockchain.

Cómo responder:
- En español peruano, cálido y directo, tratando de "tú".
- Respuestas cortas: 2 a 4 frases. Si la pregunta es compleja, da lo esencial y ofrece explicar más.
- Sin tecnicismos innecesarios. Puedes mencionar que el fondo vive en una "bóveda digital protegida" o "Safe" si preguntan cómo funciona por dentro, pero no lo antepongas — para la mayoría de preguntas basta con hablar de firmas, umbral y fondo. Evita palabras como "wallet", "cripto" o "token".
- Usa ejemplos con montos en soles cuando ayuden a entender.
- Nunca inventes datos concretos que no conoces: el saldo exacto del fondo de una asociación, fechas, o el estado de la cuenta de quien pregunta. Si te piden eso, dile en qué pantalla de la app lo puede ver.
- Sé claro en que ningún directivo, ni el presidente ni el tesorero, puede mover el fondo solo — siempre se necesita el umbral de firmas acordado.
- La tasa de mora la decide cada asociación, nunca una regla fija de la plataforma; puede estar desactivada.
- Si la pregunta no tiene que ver con Junta, dilo con amabilidad y vuelve al tema.
- No des asesoría financiera ni legal.`;

export const runtime = "nodejs";

interface MensajeEntrada {
  rol: "usuario" | "asistente";
  texto: string;
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    // El prototipo sigue siendo navegable sin clave: se responde con un aviso claro
    // en vez de romper la pantalla de ayuda.
    return NextResponse.json(
      {
        respuesta:
          "El chat de ayuda todavía no está conectado en esta demo. Mientras tanto, revisa las preguntas frecuentes de abajo: ahí está lo que más nos preguntan.",
        sinClave: true,
      },
      { status: 200 }
    );
  }

  let mensajes: MensajeEntrada[];
  try {
    const cuerpo = await request.json();
    mensajes = Array.isArray(cuerpo?.mensajes) ? cuerpo.mensajes : [];
  } catch {
    return NextResponse.json(
      { error: "No pudimos leer tu mensaje." },
      { status: 400 }
    );
  }

  if (mensajes.length === 0) {
    return NextResponse.json(
      { error: "Escribe tu pregunta para poder ayudarte." },
      { status: 400 }
    );
  }

  const client = new Anthropic({ apiKey });

  try {
    const respuesta = await client.messages.create({
      model: "claude-opus-5",
      // Suficiente para el razonamiento interno más una respuesta corta.
      max_tokens: 2048,
      // Esfuerzo bajo: son preguntas acotadas de un centro de ayuda y la latencia
      // importa más que la profundidad en una pantalla de soporte.
      output_config: { effort: "low" },
      system: SYSTEM_PROMPT,
      messages: mensajes.slice(-12).map((m) => ({
        role: m.rol === "usuario" ? ("user" as const) : ("assistant" as const),
        content: m.texto,
      })),
    });

    if (respuesta.stop_reason === "refusal") {
      return NextResponse.json({
        respuesta:
          "Esa consulta no la puedo responder. Si es sobre tu fondo, tus cuotas o tus propuestas, pregúntame de otra forma y te ayudo.",
      });
    }

    const texto = respuesta.content
      .filter((bloque) => bloque.type === "text")
      .map((bloque) => bloque.text)
      .join("\n")
      .trim();

    return NextResponse.json({
      respuesta:
        texto ||
        "No me quedó clara tu pregunta. ¿Me la puedes decir de otra manera?",
    });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "Hay muchas consultas en este momento. Intenta en un minuto." },
        { status: 429 }
      );
    }
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { error: "El chat de ayuda no está configurado correctamente." },
        { status: 500 }
      );
    }
    console.error("Error en el chat de soporte:", error);
    return NextResponse.json(
      { error: "No pudimos responderte ahora. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
