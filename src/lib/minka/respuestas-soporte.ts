/**
 * Respuestas locales del centro de ayuda.
 *
 * El chat usa la API de Claude cuando hay clave configurada. Sin clave respondía
 * "todavía no está conectado", que es exactamente lo que un usuario nunca debería
 * leer. Esta base cubre las dudas reales del producto para que la pantalla funcione
 * siempre — en la demo, sin internet, o si la API falla.
 *
 * No pretende reemplazar al asistente: es el piso mínimo. Las respuestas están
 * escritas con las mismas reglas de tono que el system prompt (cortas, en español
 * peruano, sin una sola palabra de cripto).
 */

interface Respuesta {
  /** Palabras que disparan esta respuesta. Se comparan sin tildes ni mayúsculas. */
  claves: string[];
  texto: string;
}

const RESPUESTAS: Respuesta[] = [
  {
    claves: ["prima", "por que pago", "cobro extra", "comision", "comision extra"],
    texto:
      "La prima la paga quien cobra temprano. Es lógico: si te toca el primer turno, usas el dinero del grupo durante todos los meses que faltan. Mientras más tarde tu turno, menos prima — y en el último turno no pagas nada. Ese dinero va al fondo que protege al grupo y a mantener el servicio.",
  },
  {
    claves: ["garantia", "garantía", "bloquear", "bloqueado", "deposito", "depósito"],
    texto:
      "La garantía es un dinero que se guarda mientras te falten cuotas por pagar, y se te devuelve completo cuando terminas. Sirve para que, si alguien cobra y después desaparece, los demás no pierdan. Mientras mejor tu historial, menos garantía te piden.",
  },
  {
    claves: ["aval", "avalar", "avalador", "respaldar", "quien me avala"],
    texto:
      "Un aval es alguien con buen historial que responde por ti para que puedas cobrar temprano sin poner toda la garantía. Ojo: si tú no pagas, esa persona pierde su dinero y su historial baja también. Por eso conviene pedírselo solo a quien de verdad te conoce.",
  },
  {
    claves: [
      "tradicional",
      "protegida",
      "protegido",
      "diferencia entre",
      "que modo",
      "tipos de junta",
    ],
    texto:
      "En una junta tradicional no hay garantía ni prima: el pozo va completo, igual que una junta de papel. Si alguien no paga, lo resuelven entre ustedes. En una protegida sí hay garantía y prima, así que si alguien falla, ese dinero cubre al grupo. Las juntas públicas siempre son protegidas.",
  },
  {
    claves: ["no paga", "no pago", "incumple", "deja de pagar", "que pasa si alguien"],
    texto:
      "En una junta protegida, la garantía de esa persona y el fondo del grupo cubren lo que faltó, así que los demás no pierden su dinero. A quien no pagó le baja el historial, y si tenía un aval, a esa persona también. Después puede devolver lo que el fondo puso y recuperar parte de su historial.",
  },
  {
    claves: ["nivel", "niveles", "score", "puntaje", "historial", "subir"],
    texto:
      "Tu historial sube con cada cuota que pagas a tiempo y con cada junta que terminas. Hay cinco niveles, y mientras más alto, menos garantía te piden para cobrar temprano. Lo puedes ver en la sección de historial de tu cuenta.",
  },
  {
    claves: ["publica", "pública", "abrir junta", "gente que no conozco"],
    texto:
      "Para abrir una junta donde entre gente que no conoces, necesitas haber terminado 2 juntas como organizador. Es lo único que lo habilita: no se compra con ningún plan.",
  },
  {
    claves: ["plan", "pagar plan", "pro", "cuanto cuesta", "cuánto cuesta", "gratis"],
    texto:
      "Crear juntas privadas, la garantía, el aval y tu historial son gratis y siempre lo van a ser. El plan pagado solo da comodidad: más juntas al mismo tiempo, montos más altos y herramientas para organizar. Nunca te da turno temprano ni permiso de junta pública.",
  },
  {
    claves: [
      "comprar turno",
      "pagar para cobrar",
      "pagar para adelantar",
      "cobrar antes",
      "turno antes",
      "turno temprano",
      "adelantar",
    ],
    texto:
      "No, eso no se compra. Cobrar temprano depende de tu historial y de la garantía que puedas dejar. Si el dinero pudiera comprar el turno, el historial no valdría nada y el grupo no podría confiar.",
  },
  {
    claves: ["turno", "cuando me toca", "orden", "sorteo"],
    texto:
      "El orden se define de dos formas: por sorteo cuando el grupo se completa, o acordado entre ustedes si la junta es privada. En tu junta puedes ver quién cobra en cada ciclo y cuál es tu posición.",
  },
  {
    // Raíces en vez de palabras completas: "recuper" cubre recuperar, recupero,
    // recuperación y recuperé sin tener que enumerarlas.
    claves: ["recuper", "perdi", "perdí", "cambie de celular", "clave", "contraseña", "contactos de confianza"],
    texto:
      "Si pierdes tu celular, vuelves a entrar con la ayuda de tus contactos de confianza: dos de ellos confirman que eres tú y recuperas tu cuenta. No hay clave secreta que puedas perder.",
  },
  {
    claves: ["fuerza mayor", "enfermo", "emergencia", "no pude pagar", "me robaron"],
    texto:
      "Si te pasó algo grave y no pudiste pagar, tienes 7 días para contárselo al grupo desde la pantalla de tu junta. Los demás participantes votan: si aceptan, tu historial baja poco y puedes ponerte al día después.",
  },
  {
    claves: ["seguro", "confiar", "quien guarda", "estafa", "roban", "organizador"],
    texto:
      "El dinero del grupo no lo guarda ninguna persona, ni siquiera quien organiza la junta ni Minka. Se mueve solo cuando se cumplen las reglas que ustedes fijaron al empezar, y esas reglas no se pueden cambiar después.",
  },
  {
    claves: ["fondo", "fondo del grupo", "seguro colectivo"],
    texto:
      "El fondo del grupo se junta con las primas de quienes cobran temprano. Si alguien deja de pagar, ese fondo y su garantía cubren a los demás para que nadie pierda. Puedes ver cuánto lleva acumulado en la pantalla de tu junta.",
  },
];

const RESPUESTA_POR_DEFECTO =
  "Con esas palabras no te sé responder bien. Puedes preguntarme sobre la prima, la garantía, el aval, la diferencia entre junta tradicional y protegida, los niveles o los planes. Si prefieres, escríbenos por WhatsApp y te atiende una persona.";

function normalizar(texto: string): string {
  // Quita las tildes para que "garantía" y "garantia" cuenten como lo mismo.
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Busca la mejor respuesta local para una pregunta.
 * Devuelve la que más palabras clave coincida; si ninguna coincide, la de por defecto.
 */
export function responderLocalmente(pregunta: string): string {
  const texto = normalizar(pregunta);

  let mejor: Respuesta | null = null;
  let mejorPuntaje = 0;

  for (const r of RESPUESTAS) {
    // Se puntúa por longitud de la clave, no por cantidad de coincidencias: una
    // frase larga como "pagar para cobrar" identifica la intención mucho mejor que
    // una palabra suelta como "turno", que aparece en media docena de preguntas.
    const puntaje = r.claves.reduce((suma, clave) => {
      const c = normalizar(clave);
      return texto.includes(c) ? suma + c.length : suma;
    }, 0);

    if (puntaje > mejorPuntaje) {
      mejorPuntaje = puntaje;
      mejor = r;
    }
  }

  return mejor ? mejor.texto : RESPUESTA_POR_DEFECTO;
}
