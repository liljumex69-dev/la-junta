# Minka — prototipo de interfaz

Prototipo visual completo de Minka: una PWA mobile-first que digitaliza la junta o
pandero tradicional peruana. El dinero del grupo no lo custodia nadie — ni el
organizador, ni Minka — sino un smart contract en Arbitrum.

**Esto es solo la interfaz.** Toda la lógica de blockchain está simulada con datos de
prueba y estado local de React. El equipo de contratos conecta la parte real después.

---

## Arrancar

```bash
pnpm install
pnpm dev
```

Abre http://localhost:3000.

Para el chat del centro de ayuda, copia `.env.example` a `.env.local` y pon tu clave:

```bash
ANTHROPIC_API_KEY=sk-ant-...
```

Sin clave el prototipo sigue navegable: el chat responde con un aviso y las preguntas
frecuentes siguen ahí.

---

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · shadcn/ui sobre Radix ·
Phosphor Icons (duotone/fill) · API de Claude para el chat de ayuda.

Se eligió para que coincida con la base de Scaffold-Stylus / Scaffold-ETH y el equipo
de blockchain pueda integrar esta interfaz directo en vez de reconstruirla.

---

## Dónde conectar el smart contract

Cada punto donde el flujo real necesita el contrato está marcado con un comentario:

```
// TODO: conectar a smart contract — [qué debe hacer exactamente]
```

Para encontrarlos todos:

```bash
grep -rn "TODO: conectar a smart contract" src/
```

Los archivos que más importan:

| Archivo | Qué contiene |
|---|---|
| `src/lib/minka/types.ts` | Modelo de dominio: junta, participante, usuario, estados de pago |
| `src/lib/minka/rules.ts` | Reglas de negocio simuladas: prima decreciente, garantía por score, pozo, elegibilidad de cobro, topes de plan |
| `src/lib/minka/mock-data.ts` | **Se borra entero al integrar.** Juntas, participantes, historial y score de prueba |
| `src/lib/minka/prototipo-estado.ts` | **Se borra entero al integrar.** Estado de demo en `sessionStorage` para que la navegación refleje lo que el usuario acaba de hacer |

`rules.ts` es la referencia de qué espera la interfaz de cada función del contrato: los
cálculos están ahí para que las pantallas muestren números coherentes entre sí, pero en
producción la fuente de verdad es el contrato.

---

## Pantallas

| Ruta | Pantalla |
|---|---|
| `/` | Landing pública con carrusel del hero |
| `/registro` → `/registro/codigo` → `/registro/perfil` | Registro por celular (Google y correo como alternativas) |
| `/registro/correo`, `/entrar` | Correo de respaldo y acceso |
| `/inicio` | Panel general con las juntas activas |
| `/crear` | Asistente de creación de junta |
| `/unirse` | Unirse por código (prueba con `PANADEROS` o `TIALUCHA`) |
| `/junta/[id]` | Panel de una junta |
| `/junta/[id]/aportar` | Aportar cuota, con prima desglosada |
| `/junta/[id]/cobrar` | Cobrar turno, con garantía o bloqueo |
| `/junta/[id]/aval` | Solicitar aval |
| `/junta/[id]/fuerza-mayor` | Reportar fuerza mayor y votar la de otros |
| `/historial` | Score, reputación y redención (`?demo=incumplimiento` muestra el estado malo) |
| `/recuperar` | Recuperación por contactos de confianza |
| `/planes` | Comparación de planes |
| `/soporte` | Centro de ayuda con chat |

---

## Reglas de negocio que la interfaz respeta

Estas no son decisiones de diseño, son reglas del producto. Si cambian en el contrato,
hay que cambiarlas también aquí:

- **Modo tradicional**: sin prima ni garantía, pozo completo siempre. Solo en juntas
  privadas, y con consentimiento explícito de quien se une.
- **Modo protegido**: obligatorio en juntas públicas. Prima decreciente (máxima en el
  turno 1, cero en el último) que financia el fondo colectivo y el fee de plataforma,
  más garantía externa proporcional a las cuotas restantes, reducida según el score.
- **Junta pública**: requiere 2 juntas completas como organizador. No la desbloquea
  ningún plan pagado.
- **Turnos manuales**: solo en juntas privadas.
- **Ningún plan pagado** desbloquea turno temprano ni junta pública. Los planes solo
  cambian comodidad: cuántas juntas a la vez, qué montos, herramientas de gestión.
- **Recuperación de cuenta** por contactos de confianza, nunca por frase semilla.
- **Ninguna pantalla** sugiere que el organizador controle el dinero una vez la junta
  arrancó.

---

## Accesibilidad

El público objetivo son comerciantes de mercado y trabajadores de la economía informal,
con poca familiaridad previa con apps. Estas reglas no son negociables:

- Ningún texto funcional por debajo de 16px. El texto de apoyo va a 14px.
- Ninguna área táctil menor a 44x44px.
- **Nunca** se reduce el tamaño de fuente en flujos de pago o confirmación de montos.
- Alto contraste siempre; el estado nunca se comunica solo con color.
- Nada de vocabulario cripto en la interfaz: ni "wallet", ni "blockchain", ni "frase
  semilla". La wallet se crea en segundo plano.

Los componentes base de shadcn se reajustaron para cumplirlo: el preset por defecto
traía botones de 32px y texto de 14px.

---

## Sistema de diseño

La fuente de verdad está en `docs/`:

- `docs/Minka-Sistema-de-Diseno.md` — colores, tipografía, espaciado, sombras,
  iconografía, movimiento, responsive
- `docs/Minka-Pantallas-y-Flujo.md` — qué muestra cada pantalla y qué mecanismo
  representa

Los tokens viven en `src/app/globals.css`. Primario `#BF312A`, secundario `#E38E20`,
fondo `#F5EFE6`. Solo tema claro — el modo oscuro está fuera de alcance del MVP.
