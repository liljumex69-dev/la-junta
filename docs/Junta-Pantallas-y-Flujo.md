# Junta — Pantallas y flujo

Complementa a `Junta-Sistema-de-Diseno.md`. Estructura y lógica de cada pantalla — no es copy final, es lo que Claude Code necesita para generar las pantallas correctamente.

---

## 0. Landing page (pre-registro)
- Página pública de entrada, antes de cualquier registro
- Navbar fija, fondo fundido con el fondo de la página (mismo pergamino cálido, sin barra contrastante)
- Hero: titular apoyado en el caso real (fondo expuesto en efectivo por trámite lento, robo evitable), carrusel de imágenes reales de mercados peruanos, CTA hacia registro
- Sección "Cómo funciona": crear/unirse a la asociación → pagar cuota → transparencia total del fondo → gasto propuesto y aprobado por firma múltiple
- Sección de beneficios: nadie —ni un solo directivo— puede mover el fondo solo; todo verificable públicamente; cero jerga cripto; se paga por Yape/Plin como siempre
- Sección de precios: resumen del modelo de suscripción por asociación (sin planes freemium tipo Minka — este es un modelo B2B directo)
- Footer: logo, enlaces, contacto, texto legal mínimo

## 1. Onboarding / Registro
- Número de teléfono como opción principal, Google como alternativa, correo como respaldo
- Datos base: nombre, DNI, celular (para Yape/Plin)
- Sin mención de wallet ni fricción cripto
- Después del registro, dos caminos: unirse a una asociación existente o crear una nueva

## 2. Crear asociación (fundador/directivo)
- Nombre del mercado, número de puestos/participantes esperados
- Umbral de firmas (ej. 3 de 5) y lista de directivos iniciales (nombre + rol: presidente, tesorero, secretario, vocales)
- Tasa de mora: configurable por la propia asociación, con opción explícita de desactivarla
- Genera link/código para invitar comerciantes

## 3. Unirse a una asociación
- Código o link de invitación
- Datos del puesto (número, mercado ya identificado por el código)
- Confirmación de cupo

## 4. Inicio / Panel general
- Saldo total del fondo, visible siempre
- Estado propio: cuota al día o pendiente
- Propuestas de gasto activas y su estado de firmas
- Últimas publicaciones del tablón de anuncios

## 6. Pagar cuota
- Monto fijo definido por la asociación, pago escaneando código QR con Yape o Plin — tal como ya lo hace el comerciante hoy
- Confirmación simple, un solo paso

## 6b. Ahorro personal (opcional, por comerciante)
- Balance separado del fondo colectivo, controlado únicamente por el propio comerciante — ninguna firma de terceros necesaria para depositar
- Categorías de ingresos y gastos definibles por el propio usuario (ej. salud, capital de trabajo, otros) — para organizar y segmentar sus movimientos
- Dashboard simple: saldo actual grande y claro, lista de movimientos por categoría, línea simple de evolución en el tiempo — sin paneles de múltiples métricas, este es personal y debe leerse de un vistazo
- Exportar historial personal como PDF o Excel
- **Pendiente de definir con el equipo:** el mecanismo de retiro — un ahorro sin forma clara de sacar el dinero no es un ahorro real, solo un depósito sin salida. No construir esta pantalla hasta cerrar ese punto.

## 5. Panel del fondo (transparencia + dashboard del directivo)
- Historial de movimientos del fondo, quién propuso qué, cuántas firmas tiene cada uno
- Enlace directo y compartible a Arbiscan — pensado para funcionar independiente, ya que un QR físico en la oficina del mercado apunta directo a esta transparencia pública
- Dashboard para directivos: fondo total en el tiempo, ingresos (cuotas) vs. gastos (propuestas ejecutadas), tasa de cumplimiento de puestos, desglose de gastos por categoría (seguridad, mantenimiento, mejoras, otras — mismo componente de categorías que en el ahorro personal, reutilizado)
- Exportar historial como PDF o Excel, además del CSV ya contemplado para SUNAT

## 7. Proponer gasto (solo directivos)
- Monto, motivo, categoría
- Al enviar, queda registrado como propuesta — no mueve fondos todavía
- Notifica a los demás directivos

## 8. Firmar / Aprobar propuesta (solo directivos)
- Detalle completo del gasto propuesto
- Aprobar con confirmación de PIN o huella (no es un trámite de papel ni firma escaneada — es autorización real de movimiento de fondos, por eso lleva verificación, no solo un toque)
- Contador de firmas visible (ej. "2 de 3"); al llegar al umbral, se ejecuta automáticamente

## 9. Historial de cumplimiento
- Por puesto/comerciante: cuotas al día, pendientes, en mora
- Vista de tabla, exportable como PDF o Excel además del CSV para SUNAT
- Nota de que este historial es la base para futuro acceso a microcrédito real
- Sin ningún mecanismo de garantía o aval individual — no aplica a este modelo

## 10. Configuración de la asociación (directivos)
- Umbral de firmas, firmantes autorizados
- Tasa de mora (definida por la asociación, puede estar en cero)
- Notificaciones activadas/desactivadas
- Exportar historial (CSV, referencia a SUNAT)

## 11. Tablón de anuncios
- Solo directivos publican, todos los miembros leen
- Sin comentarios ni reacciones en esta versión — es de una sola vía, a propósito
- Cualquier expansión a interacción social (comentarios, encuestas, mensajería) queda fuera del MVP, anotada como visión de escalamiento

## 12. Soporte / Centro de ayuda
- Chat de preguntas frecuentes, accesible desde cualquier pantalla
- Responde en base al contexto ya definido en este documento y en el sistema de diseño — sin necesitar reglamento aparte

## 13. Recuperación de cuenta
- Vía contactos de confianza (2-3 personas), no frase semilla, dado el público objetivo

---

## Notas para Claude Code
- Mobile-first, siguiendo el sistema de diseño adjunto
- Recordatorios de cuota y de propuestas pendientes de firma van por WhatsApp (principal) y Telegram (alternativa)
- El directorio nunca tiene poder unilateral — ninguna pantalla debe sugerir que un solo directivo puede mover fondos sin las firmas del umbral
- La política de mora es configurable por cada asociación, nunca una regla fija impuesta por la plataforma

## Assets visuales necesarios (landing page)
Fotografía real y cálida de mercados peruanos, misma dirección que en Minka: vendedor/a con su celular, grupo de directivos o comerciantes conversando, un intercambio de manos, una toma abierta del mercado. Se generan/buscan aparte y se integran después.
