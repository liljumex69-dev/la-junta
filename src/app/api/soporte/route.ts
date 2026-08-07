import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

/**
 * Chat del centro de ayuda.
 *
 * Usa la API de Claude con el contexto de producto de Minka como system prompt.
 * No necesita un reglamento aparte: el mismo contexto que define el producto es lo
 * que responde las dudas sobre prima, garantía, aval, modos y planes.
 */

/** Resumen de producto que sirve de base al asistente. */
const CONTEXTO_MINKA = `Minka es una app que digitaliza la junta/pandero tradicional peruana usando un smart contract en Arbitrum: nadie, ni el organizador ni Minka, tiene control del dinero del grupo. Cada participante aporta una cuota fija; por turnos, alguien recibe el pozo completo. Hay dos modos: tradicional (sin garantía ni prima, como una junta de papel, solo entre conocidos) y protegido (obligatorio en juntas públicas). En modo protegido: quien recibe un turno temprano paga una prima decreciente (mayor en el primer turno, cero en el último) que financia un fondo de seguro colectivo y el fee de la plataforma; y antes de cobrar, debe tener una garantía externa bloqueada (propia o de un aval, alguien con buen historial que respalda a otro) proporcional a sus cuotas restantes, que baja según su score de reputación. Si alguien no paga, la garantía y el fondo cubren a los demás sin que pierdan su dinero; el score de quien incumplió, y el de su aval si tuvo, baja. Existe un camino de redención: reembolsar voluntariamente lo cubierto para recuperar parte del score. El uso básico (juntas privadas, todo el mecanismo de confianza) es gratis siempre; un plan pagado solo desbloquea conveniencia (más juntas simultáneas, mayor monto organizable, herramientas de gestión, sin anuncios), nunca elegibilidad de turno temprano ni permiso de junta pública — eso se gana solo con historial.`;

const SYSTEM_PROMPT = `${CONTEXTO_MINKA}

Eres el asistente del centro de ayuda de Minka. Respondes dudas de personas que usan la app.

Sobre quién te escribe: en su mayoría son comerciantes de mercado y trabajadores de la economía informal peruana, con poca familiaridad con apps y ninguna con tecnología blockchain. Muchos ya conocen las juntas o panderos de toda la vida.

Cómo responder:
- En español peruano, cálido y directo, tratando de "tú".
- Respuestas cortas: 2 a 4 frases. Si la pregunta es compleja, da lo esencial y ofrece explicar más.
- Sin tecnicismos. Nunca digas "blockchain", "smart contract", "wallet", "cripto", "on-chain" ni "token". Si necesitas explicar por qué el dinero está seguro, di que el dinero del grupo lo guarda un contrato automático que sigue las reglas que el grupo fijó, y que nadie lo puede tocar.
- Usa ejemplos con montos en soles cuando ayuden a entender.
- Nunca inventes datos concretos que no conoces: montos exactos de una junta específica, fechas, o el estado de la cuenta de quien pregunta. Si te piden eso, dile en qué pantalla de la app lo puede ver.
- Si alguien pregunta si puede pagar para cobrar antes o para abrir una junta pública, sé claro: eso no se compra con ningún plan, se gana con historial.
- Si la pregunta no tiene que ver con Minka, dilo con amabilidad y vuelve al tema.
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
          "Esa consulta no la puedo responder. Si es sobre tus juntas, tus cuotas o tu historial, pregúntame de otra forma y te ayudo.",
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
