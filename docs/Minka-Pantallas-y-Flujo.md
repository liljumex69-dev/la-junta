# Minka — Pantallas y flujo (v final)

Complementa a `Minka-Sistema-de-Diseno.md`. Este documento describe qué pantallas existen, qué muestra cada una, y qué mecanismo de negocio representa — no es copy final, es la estructura que Claude Code necesita para generar las pantallas correctamente.

---

## 0. Landing page (pre-registro)
- Página pública de entrada — nadie cae directo en "regístrate", primero conoce el producto
- Navbar fija, fondo que se funde con el fondo de la página (mismo tono crema, sin barra contrastante blanca u oscura), logo Minka a la izquierda, enlaces mínimos (Cómo funciona, Planes, Soporte) y botón "Crear cuenta" a la derecha
- Hero: titular corto explicando qué es Minka en una frase, carrusel de imágenes reales rotando (ver "Assets visuales necesarios" al final), botón principal de CTA hacia registro
- Sección "Cómo funciona": 3-4 pasos ilustrados con íconos Phosphor (crear o unirse a una junta → aportar tu cuota → recibir tu turno → construir tu historial)
- Sección de beneficios/diferenciales: nadie puede desaparecer con el dinero (custodia por contrato, no por persona), la tecnología queda invisible para el usuario, el historial de confianza te acompaña siempre, recordatorios por WhatsApp
- Sección de planes: resumen breve gratuito vs. pagado, con enlace a la pantalla de Planes para el detalle completo
- Footer: logo, enlaces de navegación, contacto, redes, texto legal mínimo

## 1. Onboarding / Registro
- Número de teléfono como opción principal de registro — coincide con el patrón ya familiar para este público (mismo identificador que usa Yape)
- "Continuar con Google" como alternativa rápida junto a la anterior
- Correo electrónico disponible como opción secundaria de respaldo, no como protagonista
- Sin mención de "wallet" ni fricción cripto visible en ningún caso
- Wallet se crea en segundo plano, de forma transparente
- Si llega por invitación (link de otro usuario), el sistema guarda la referencia de quién invitó
- Score parte neutral

## 2. Inicio / Panel general
- Lista de juntas activas del usuario (como participante y como organizador)
- Estado resumido de cada una: próximo pago, próximo turno, si le toca cobrar
- Acceso rápido a "Crear junta" y "Unirse a junta"

## 3. Crear junta
- Monto de cuota, frecuencia, número de participantes
- Modalidad de turnos: sorteo o manual (manual solo disponible si la junta es privada)
- Tipo de junta: **privada** (invita solo gente que conoce, disponible desde el registro, con tope de monto/participantes según el plan) o **pública** (solo si el organizador ya tiene buen historial — 2-3 juntas completas)
- Si es privada: elegir **modo tradicional** (sin aval ni prima, pozo completo siempre) o **modo protegido** (prima + garantía). Pública siempre es modo protegido, sin opción.
- Genera link/código para compartir

## 4. Unirse a una junta
- Muestra las reglas ya fijadas por el organizador
- Si la junta es modo tradicional: pantalla explícita de consentimiento — "esta junta no tiene garantía activada, si alguien no paga el grupo lo resuelve entre ustedes" — requiere aceptación consciente antes de confirmar
- Si es modo protegido: muestra el score propio del usuario y qué garantía/aval necesitaría para un turno temprano

## 5. Panel de mi junta
- Estado del ciclo actual: quién ya aportó, quién falta
- Próximo turno y quién le corresponde
- Garantía propia bloqueada (si aplica)
- Acceso a "Aportar cuota" y, si corresponde, "Cobrar mi turno"

## 6. Aportar cuota
- Cuota base + prima si el ciclo actual corresponde a un turno temprano (prima decreciente, mayor en turno 1, cero en el último)
- Confirmación simple, un solo paso

## 7. Cobrar mi turno
- Si requiere aval o garantía: muestra el monto exacto y de dónde sale (garantía propia externa, o aval de un tercero)
- Si no tiene historial ni aval disponible: pantalla de bloqueo con opción de "Solicitar aval" (pantalla 8) o esperar a un turno tardío
- Confirmación de liberación del pozo completo, sin retenciones

## 8. Solicitar aval
- Lista de miembros de la junta (o contactos) con buen historial que podrían avalar
- Explica claramente qué arriesga el avalador (su propio capital y su score) antes de que confirme
- Notificación al avalador para aceptar o rechazar

## 9. Historial / Score / Reputación
- Ciclos completados, puntualidad, juntas completadas con personas distintas (no solo cantidad)
- Si el usuario tiene mal historial: opción de "Reembolsar y recuperar score" — camino de redención pagando voluntariamente lo que el fondo cubrió por él
- Historial de avales dados y recibidos

## 10. Reportar fuerza mayor
- Ventana de 7 días tras un incumplimiento para solicitar que se marque como fuerza mayor
- Los demás participantes de esa junta votan si la aceptan
- Muestra resultado: si se acepta, penalización leve + pago diferido; si no, tratamiento normal

## 11. Recuperación de cuenta
- Flujo de recuperación vía 2-3 contactos de confianza (no frase semilla)
- Cada contacto confirma la identidad antes de restaurar el acceso

## 12. Fondo de seguro colectivo (transparencia) — si alcanza el tiempo
- Monto acumulado del fondo
- Explicación breve de cómo protege al grupo

## 13. Planes
- Comparación de 2 niveles: Gratuito y Organizador Pro (nombre a definir)
- Gratuito: todo lo esencial del negocio sin costo — crear juntas privadas con tope de monto/participantes, aval, prima, garantía, historial, todo el mecanismo de confianza incluido
- Pagado: más juntas simultáneas, mayor monto organizable en juntas privadas, herramientas de gestión para el organizador, sin anuncios, cuota de servicio revendible a participantes (mecanismo tipo "plan familiar")
- Regla no negociable, visible o no en esta pantalla pero válida para cómo se construye: ningún plan pagado desbloquea turno temprano ni permiso de junta pública — eso se gana solo con reputación, nunca se compra

## 14. Soporte / Centro de ayuda
- Accesible desde cualquier pantalla, no escondido en un menú profundo
- Formato de chat de preguntas frecuentes — responde dudas sobre la prima, la garantía, el aval, la diferencia entre modo tradicional y protegido, los planes
- No necesita un reglamento nuevo por separado: se alimenta del mismo contexto de producto ya definido en este documento y en el sistema de diseño — para el MVP alcanza con eso

---

## Assets visuales necesarios (landing page)
Fotografía real y cálida, no ilustración genérica de stock corporativo — el objetivo es transmitir confianza humana, no tecnología. Estas se generan aparte (fuera de Claude Code) y se integran después:
1. Imagen principal del hero — vendedor o vendedora de mercado peruano usando el celular con naturalidad
2. 2-3 imágenes adicionales para el carrusel del hero: un grupo de personas conversando con confianza (contexto de mercado o comunidad), un intercambio de dinero o producto entre dos personas, una escena cotidiana de comercio local
3. La sección "Cómo funciona" puede resolverse solo con íconos Phosphor, sin necesitar fotografía nueva


---

## Notas para Claude Code
- Todas las pantallas son mobile-first, siguiendo el sistema de diseño adjunto
- Recordatorios de cuota van por WhatsApp (principal) y Telegram (alternativa), no por notificación push nativa
- Ninguna pantalla debe sugerir que el organizador tiene control especial sobre el dinero una vez la junta arranca
