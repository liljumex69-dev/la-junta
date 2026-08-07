# Minka — Guía de demo

Qué perfiles existen, qué rutas de usuario están armadas y cómo recorrer cada
escenario. Todo esto es simulado: el estado vive en `localStorage` del navegador y
está aislado para que el equipo de desarrollo lo reemplace por su backend real.

> **Para reiniciar todo:** menú de cuenta (arriba a la derecha) → **Reiniciar la
> demo**. Vuelve al estado inicial con los perfiles y juntas de ejemplo.

---

## 1. Perfiles disponibles

Se puede cambiar de perfil desde el **menú de cuenta → Cambiar de perfil (demo)**, o
desde `/entrar`, donde aparecen listados.

| Perfil | Teléfono | Score | Nivel | Para qué sirve |
|---|---|---|---|---|
| **Rosa Quispe** | 987 654 321 | 78 | Plata | Usuaria establecida. 3 juntas completas, historial lleno, ya puede organizar juntas públicas. Es el perfil "todo funcionando". |
| **Luis Tapia** | 912 345 678 | 38 | Historial dañado | Incumplió y el fondo cubrió S/ 400 por él. Sirve para ver el camino de redención y cómo se ve un perfil castigado. |
| **Cualquiera que crees** | el que pongas | 50 | Nuevo | Se crea al registrarte. Estado vacío total: sin juntas, sin historial, sin métricas. |

Un usuario nuevo entra con score 50 — neutral, ni bien ni mal, tal como pide el
documento de producto. Por debajo de 40 solo se llega incumpliendo.

---

## 2. Niveles de confianza

Cinco niveles. Cada uno corresponde exactamente a un tramo del factor de garantía,
así que subir de nivel siempre significa una rebaja real y verificable.

| Nivel | Desde | Garantía que te piden |
|---|---|---|
| Historial dañado | 0 | 100% |
| Nuevo | 40 | 90% |
| Bronce | 55 | 70% |
| Plata | 70 | 50% |
| Oro | 85 | 30% |

Se explican en tres sitios: la landing (sección "Cumplir te cuesta menos"), la
pantalla `/niveles`, y la tarjeta de nivel del panel de inicio con su barra de
progreso.

**Ojo con los dos ejes.** El nivel decide la garantía. Organizar juntas públicas es
otra cosa: se gana con 2 juntas completadas, y no lo desbloquea ningún plan. La
pantalla `/niveles` lo dice explícitamente porque es la confusión más fácil.

---

## 3. Rutas de usuario armadas

### A. Persona nueva que se registra sola
`/` → **Crear cuenta** → celular → código (cualquiera de 6 dígitos) → nombre → `/inicio`

Qué ver: el inicio en **estado vacío**, con nivel Nuevo, la barra de progreso hacia
Bronce y dos salidas claras (crear junta / tengo un código). El historial también
tiene su propio estado vacío.

### B. Persona nueva que llega por invitación
`/invitacion/<CODIGO>` → **Crear mi cuenta y entrar** → registro → queda **inscrita
automáticamente** en la junta

Este es el escenario que faltaba: quien recibe el enlace por WhatsApp no tiene que
buscar dónde escribir un código. Al terminar el registro ya está dentro, y la
confirmación se lo dice por su nombre.

Para probarlo: crea una junta con cualquier perfil, copia el enlace de invitación
desde el panel de la junta, cierra sesión y ábrelo.

### C. Persona que ya tiene cuenta
`/` → **Ingresar** → su número → `/inicio`

En la landing ahora hay botón **Ingresar** al lado de **Crear cuenta**. Antes solo
estaba el enlace "entra aquí" al pie del registro, y se entendía que había que
registrarse siempre.

### D. Organizar una junta
`/inicio` → **Crear junta** → 5 pasos → la junta **aparece en Mis juntas**

Qué ver:
- Con un perfil nuevo, la opción **Pública sale bloqueada** con el motivo: "Necesitas
  2 juntas completas. Llevas 0. Esto se gana con historial, no se compra con ningún
  plan." Con Rosa (3 completas) sí está disponible.
- La junta recién creada aparece en formación: muestra **cuánta gente falta**, no
  "ciclo 0", y el panel ofrece el bloque de invitación en vez de un pago.

### E. Entrar a una junta con código
`/inicio` → **Unirme a una junta** → código → reglas → **elegir turno** → confirmar

Códigos de prueba:
- **PANADEROS** — protegida, por sorteo, 7 personas
- **TIALUCHA** — tradicional, turnos acordados, 6 personas

Qué ver:
- **Tradicional**: pantalla de consentimiento con casilla obligatoria. El botón de
  confirmar está deshabilitado hasta marcarla.
- **Protegida**: tu nivel, y un **selector de turno** que muestra prima y garantía de
  cada posición. Los turnos ocupados salen deshabilitados; los que superan tu saldo
  disponible se marcan **"Necesitas aval"** — no se bloquean, porque pedir un aval es
  justamente la salida prevista.
- En juntas **por sorteo**, elegir turno envía un **pedido al organizador**, no una
  reserva. El sorteo sigue siendo el mecanismo justo entre desconocidos, y la
  pantalla lo dice con esas palabras.

### F. Cobrar un turno sin garantía suficiente
Con Rosa: `/junta/j-mercado/cobrar`

Le toca cobrar S/ 1,600 pero necesita S/ 500 de garantía y solo tiene S/ 320. La
pantalla no da un "no" seco: ofrece **pedir un aval** o **esperar un turno más
tarde**, y explica por qué existe la garantía y cómo baja sola.

### G. Historial dañado y redención
Menú de cuenta → cambiar a **Luis Tapia** → `/historial`

Muestra el nivel "Historial dañado", el incumplimiento en la línea de tiempo con su
impacto (−22) y la opción de **devolver los S/ 400** que el fondo cubrió, con el
score que recuperaría. El tono es de salida, no de cobranza.

### H. Mejorar de plan
`/planes` → **Probar Organizador Pro**

Ahora cambia el plan de verdad. El efecto se nota donde importa: los topes del
asistente de creación suben (más juntas simultáneas, más personas, mayor cuota). Lo
que **no** cambia nunca: turno temprano ni permiso de junta pública.

### I. Recuperar la cuenta
`/recuperar`

Agregar y quitar contactos de confianza ya funciona. Iniciar la recuperación muestra
a los contactos confirmando uno por uno hasta habilitar el regreso.

### J. Centro de ayuda
`/soporte`

Responde **siempre**, con o sin clave de API. Con `ANTHROPIC_API_KEY` configurada usa
Claude; sin ella —o si la API falla— usa una base de respuestas local que cubre
prima, garantía, aval, modos, niveles, planes, incumplimiento, fuerza mayor y
recuperación. El usuario nunca ve un aviso de "no conectado".

---

## 4. Qué se arregló de la revisión anterior

- **Contraste de botones.** Todos los botones grandes mostraban el texto en marrón
  sobre el rojo de marca. La causa era una sola: `tailwind-merge` no conocía los
  tokens tipográficos de Minka (`text-h3`, `text-body`), los tomaba por colores y
  descartaba el `text-white`. Se registraron como tamaños de fuente en `cn()`, y con
  eso quedaron corregidos todos los botones de la app a la vez.
- **Logo clicable** en todas las pantallas, siempre hacia el inicio.
- **Logo real de Google** en los botones de "Continuar con Google", en sus cuatro
  colores, en vez del ícono genérico.
- **Relieve al pasar el cursor** en las tarjetas de pasos y beneficios de la landing.
- **Menú de cuenta** en el avatar del encabezado: perfil, nivel, historial, niveles,
  plan, ayuda, cambio de perfil y cerrar sesión.
- **Agregar contacto de confianza** ya funciona (antes el botón no hacía nada).
- **Navegación**: todas las pantallas internas tienen su salida hacia atrás
  coherente, y el guardia de sesión ofrece entrar o registrarse en vez de redirigir
  en silencio.

---

## 5. Límites conocidos de la simulación

Cosas que un prototipo de interfaz no resuelve y que el equipo técnico definirá:

- **No hay backend.** Todo vive en `localStorage` del navegador. Dos personas en dos
  computadoras no comparten juntas.
- **No hay verificación real** de número, código SMS ni identidad.
- **Los ciclos no avanzan solos.** Una junta creada se queda en formación: no hay
  proceso que la arranque cuando se llena, ni que corra los ciclos mes a mes.
- **Las solicitudes de turno y de aval se registran pero nadie las aprueba** — falta
  la vista del organizador respondiéndolas.
- **El sorteo no se ejecuta.** Los turnos se asignan por orden de llegada.

Todo esto está marcado en el código con `// TODO: conectar a smart contract` y, donde
corresponde, con notas sobre qué le toca al backend y qué al contrato.
