# Junta — prototipo de interfaz

🚀 **Enlaces Oficiales del Proyecto:**
- **Frontend (Vercel):** [https://la-junta-black.vercel.app](https://la-junta-black.vercel.app)
- **Backend (Render):** [https://la-junta.onrender.com](https://la-junta.onrender.com)

Junta es una tesorería digital colectiva para asociaciones de comerciantes de
mercado en Perú, construida sobre **Safe (Gnosis Safe) con firma múltiple** en
Arbitrum. Ningún directivo individual puede mover el fondo por su cuenta: cada
gasto se propone, se firma entre varios, y solo se ejecuta al llegar al umbral que
la propia asociación definió.

**Esto es solo la interfaz.** Toda la lógica de custodia y firma está simulada con
datos de prueba en memoria. El equipo que conecta Safe y el contrato Stylus hace esa
parte después — este prototipo existe para mostrarles exactamente qué necesita
esperar la interfaz de cada uno.

---

## El problema

En un mercado de comerciantes, la cuota mensual de cada puesto arma un fondo común
para seguridad, mantenimiento y mejoras. Hoy ese fondo casi siempre vive en efectivo,
en manos de un tesorero, porque hacer un trámite bancario con varias firmas es lento
y nadie quiere cargar con la responsabilidad solo.

Un fondo en efectivo es un fondo expuesto: a un robo, a una emergencia, a que la
única persona que lo maneja no pueda estar presente cuando se necesita decidir. El
caso que motiva Junta es real — un mercado de Villa El Salvador que perdió su fondo
colectivo exactamente así, no por mala fe de nadie, sino porque el sistema no daba
otra opción razonable.

Junta reemplaza el sobre de efectivo por un Safe multifirma: el dinero está en la
blockchain, protegido, y moverlo requiere el acuerdo de varios directivos — nunca de
uno solo. Para quien lo usa, no se siente distinto a una cuenta compartida: paga su
cuota escaneando un QR con Yape o Plin, como ya lo hace hoy. La complejidad de Safe y
del contrato queda completamente invisible.

---

## Arquitectura

- **Custodia — Safe (Gnosis Safe):** cada asociación tiene su propio Safe desplegado
  en Arbitrum, con los directivos como firmantes y un umbral configurable (ej. 3 de
  5). Ninguna cuota ni ningún gasto se mueve sin llegar a ese umbral.
- **Lógica de negocio — Stylus:** el contrato en Arbitrum Stylus lleva el registro de
  cuotas, propuestas de gasto, firmas y el historial de cumplimiento por puesto —
  la fuente de verdad que hoy simula este prototipo.
- **Interfaz — este repositorio:** Next.js + TypeScript + Tailwind + shadcn/ui,
  elegido para coincidir con la base de Scaffold-Stylus/Scaffold-ETH, de forma que
  el equipo de contratos pueda integrar esta interfaz directo en vez de reconstruirla.

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

Sin clave el chat sigue funcionando: responde con una base local de respuestas en vez
de romperse.

---

## Datos de prueba

Todo el estado vive en un `Context` de React, en memoria — **nunca** en
`localStorage`, `sessionStorage` ni una base de datos real. Recargar la página
reinicia todo limpio, a propósito: es la simulación más honesta posible de un
producto que en su versión real no guarda nada del lado del cliente.

Se precargan dos perfiles para probar los dos roles del producto:

| Perfil | Rol | Para qué sirve |
|---|---|---|
| Elena Vásquez Rojas | Comerciante | Paga su cuota, ve la transparencia del fondo, lleva su ahorro personal |
| Marco Huamán Torres | Directivo (tesorero) | Además propone gastos y firma propuestas |

El menú de cuenta permite cambiar entre ambos perfiles para recorrer la demo, y el
registro funciona de verdad para crear un tercer usuario desde cero — útil para
probar el flujo completo de registro, elegir entre crear o unirse a una asociación, y
recuperación de cuenta.

---

## Dónde conectar Safe y el contrato

Cada punto donde el flujo real necesita Safe o el contrato Stylus está marcado con
un comentario:

```
// TODO: conectar a Safe/smart contract — [qué debe hacer exactamente]
```

Para encontrarlos todos:

```bash
grep -rn "TODO: conectar a Safe/smart contract" src/
```

El archivo que más importa:

| Archivo | Qué contiene |
|---|---|
| `src/lib/junta/types.ts` | Modelo de dominio: asociación, usuario, cuota, propuesta de gasto, movimiento del fondo, ahorro personal |
| `src/lib/junta/rules.ts` | Reglas de negocio simuladas: saldo del fondo, umbral de firmas, mora configurable, tasa de cumplimiento |
| `src/lib/junta/seed.ts` | **Se borra entero al integrar.** Datos de prueba: la asociación demo, sus movimientos, propuestas y anuncios |
| `src/lib/junta/context.tsx` | **Se reemplaza entero al integrar.** El único punto que conecta las pantallas con el estado — las acciones (`pagarCuota`, `proponerGasto`, `firmarPropuesta`...) mantienen su firma para que las pantallas no cambien |

---

## Reglas de negocio que la interfaz respeta

Estas no son decisiones de diseño, son reglas del producto:

- **Ningún directivo mueve el fondo solo.** Toda propuesta de gasto necesita llegar
  al umbral de firmas de la asociación antes de ejecutarse — nunca antes.
- **La tasa de mora es configurable por cada asociación**, incluso puede
  desactivarse. Nunca es una regla fija impuesta por la plataforma.
- **El ahorro personal no necesita firma de nadie más.** Es dinero separado del
  fondo colectivo, controlado únicamente por el propio comerciante.
- **No hay garantía ni aval individual** en el historial de cumplimiento — ese
  mecanismo no existe en este modelo. El historial es, en cambio, la base para un
  futuro acceso a microcrédito real.
- **El tablón de anuncios es de una sola vía**: solo directivos publican, todos
  leen, sin comentarios ni reacciones en esta versión.
- **Recuperación de cuenta** por contactos de confianza, nunca por frase semilla.

---

## Accesibilidad

El público objetivo son comerciantes de mercado y sus directivos, con poca
familiaridad previa con apps. Estas reglas no son negociables:

- Ningún texto funcional por debajo de 16px. El texto de apoyo va a 14px.
- Ninguna área táctil menor a 44x44px.
- **Nunca** se reduce el tamaño de fuente en flujos de pago, propuestas de gasto o
  firmas.
- Alto contraste siempre; el estado nunca se comunica solo con color.
- Nada de vocabulario cripto en la interfaz: ni "wallet", ni "gas", ni "firma
  criptográfica". La complejidad de Safe queda invisible.

---

## Sistema de diseño

La fuente de verdad está en `docs/`:

- `docs/Junta-Sistema-de-Diseno.md` — colores, tipografía, espaciado, sombras,
  iconografía, movimiento, responsive
- `docs/Junta-Pantallas-y-Flujo.md` — qué muestra cada pantalla y qué mecanismo
  representa

Los tokens viven en `src/app/globals.css`. Primario `#1F5C3D` (verde bosque),
secundario `#B8863B` (bronce dorado), fondo `#F3EFE4`. Solo tema claro — el modo
oscuro está fuera de alcance del MVP.
