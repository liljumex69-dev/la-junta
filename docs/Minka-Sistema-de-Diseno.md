# Minka — Sistema de diseño

Referencia visual completa para el desarrollo del prototipo y el producto. Basado en el logo final (figuras humanas en simetría de espejo, formando una X de cuatro puntas) y en el público objetivo: comerciantes de mercado y economía informal, con poca familiaridad tecnológica previa.

**Principio general:** cálido, humano, de alto contraste y legible — nunca frío, nunca genérico-cripto (sin azules/morados metálicos, sin degradados, sin negro puro).

---

## 1. Colores

### Marca
| Token | Hex | Uso |
|---|---|---|
| Primario | `#BF312A` | Botones principales, acciones clave, elementos de marca |
| Primario oscuro (hover/presionado) | `#992722` | Estados de interacción sobre el primario |
| Secundario / acento | `#E38E20` | Acciones secundarias, resaltados, badges, estado de atraso |

### Neutros
| Token | Hex | Uso |
|---|---|---|
| Fondo base | `#F5EFE6` | Fondo general de pantalla |
| Superficie (tarjetas) | `#FBF7F1` | Tarjetas y elementos elevados sobre el fondo base |
| Texto primario | `#3A2E28` | Texto principal, títulos |
| Texto secundario | `#8A7A6D` | Texto de apoyo, fechas, notas, placeholders |
| Borde / división | `#E3DACD` | Líneas divisorias, bordes de inputs y tarjetas |

### Estado
| Token | Hex | Uso |
|---|---|---|
| Éxito | `#4B6B3A` | Cuota pagada, junta completada, confirmaciones |
| Alerta / peligro | `#9C3232` | Incumplimiento, garantía ejecutada, avisos críticos (distinto del primario a propósito, para no confundir "marca" con "error") |
| Atraso (advertencia leve) | `#E38E20` | Reutiliza el secundario — cuota tardía pero pagada, sin incumplimiento |

---

## 2. Tipografía

**Familia recomendada: Inter.** Se evaluó una opción más redondeada (Nunito) por calidez, pero se descartó — un producto que maneja dinero y reputación se beneficia más de una tipografía neutral y de máxima legibilidad que de una con personalidad juguetona. La calidez de la marca ya la lleva el logo y la paleta de color; la tipografía debe priorizar claridad.

| Estilo | Tamaño | Peso | Uso |
|---|---|---|---|
| Display / H1 | 28px | 600 | Títulos de pantalla |
| H2 | 22px | 600 | Encabezados de sección |
| H3 | 18px | 600 | Títulos de tarjeta, subsecciones |
| Cuerpo | 16px | 400 | Texto general — nunca más chico que esto para contenido funcional |
| Cuerpo secundario | 14px | 400 | Texto de apoyo, descripciones cortas |
| Micro | 12px | 400 | Uso mínimo — fechas pequeñas, etiquetas, nunca para información crítica |
| Botón | 16px | 600 | Texto de botones y CTAs |

Interlineado: 1.5 en cuerpo de texto, 1.3 en títulos. Dado el público objetivo, nunca reducir el tamaño base de 16px en flujos de pago o confirmación de montos.

---

## 3. Espaciado y bordes

- Escala de espaciado: 4 / 8 / 12 / 16 / 24 / 32 / 48px
- Radio de borde en tarjetas y contenedores: **12px**
- Radio de borde en botones e inputs: **10px**
- Radio en badges/etiquetas pequeñas: **8px**
- Sin esquinas totalmente en pill (evitar el efecto "burbuja" demasiado casual) salvo en elementos específicamente circulares (avatares, ícono de estado)
- Área táctil mínima: 44x44px en cualquier elemento interactivo, dado el público con menor precisión táctil esperada

---

## 4. Sombras y elevación

Diseño mayormente plano, con sombra sutil solo donde ayuda a entender jerarquía (qué es tocable, qué flota sobre qué):

- Tarjeta en reposo: `0 1px 3px rgba(58, 46, 40, 0.06)`
- Tarjeta elevada / modal: `0 4px 16px rgba(58, 46, 40, 0.12)`
- Botones: sin sombra por defecto (planos), sombra solo en botón flotante de acción principal si existe

Nota: la sombra usa el marrón de texto (`#3A2E28`) en baja opacidad en vez de negro puro — mantiene la calidez incluso en los detalles técnicos.

---

## 5. Iconografía

**Librería recomendada: Phosphor Icons** (`@phosphor-icons/react`), peso **duotone** o **fill** como estilo por defecto — no línea delgada. A diferencia de Lucide (línea fina, la opción por defecto más común en proyectos shadcn/ui), Phosphor con relleno tiene más peso visual y calidez, se siente menos "panel de administración genérico" y más en sintonía con una marca cálida y humana. Es una librería pública, de código abierto, instalable vía npm, con soporte activo — Claude Code puede instalarla y usarla sin fricción.

Evitar íconos genéricos de candado/escudo para todo lo relacionado a seguridad — preferir íconos que refuercen "grupo/personas" (círculos, figuras) por sobre "seguridad corporativa" (candados, escudos), coherente con el argumento central del producto: la protección viene del grupo y el contrato, no de un símbolo de seguridad tradicional.

---

## 6. Movimiento

Transiciones simples y breves (200-250ms), fade o slide suave — nada que se sienta como "demo tecnológica llamativa". El objetivo es transmitir calma y confianza, no impresionar con animación.

### Estados de interacción y microcopy de carga

No estaba cubierto antes. Las skills activadas (`interaction-design` sobre todo, más los componentes de carga de shadcn) resuelven el *patrón* de cómo se ve un estado de carga, pero no el texto específico de Minka — eso hay que definirlo aquí:

- Texto en gerundio + qué se está haciendo, breve, sin tecnicismos: "Creando tu cuenta…", "Generando tu junta…", "Confirmando tu cuota…", "Liberando tu turno…", "Verificando tu aval…"
- Acciones de botón (crear, confirmar, unirse): el botón cambia a estado deshabilitado + spinner pequeño integrado, no un overlay de pantalla completa
- Carga de contenido (listas, panel de junta): skeleton loader con el color de superficie, no spinner centrado
- Nunca bloquear con un spinner de pantalla completa para acciones de menos de ~2 segundos — se siente más pesado de lo que realmente es
- Confirmación de éxito: un momento visual breve y positivo (check, destello del verde de éxito) antes de continuar — igual de importante que el estado de carga, no se debe omitir

---

## 7. Logo

Marca final: figuras humanas en simetría de espejo formando una X de cuatro puntas (arriba-abajo y izquierda-derecha simétricos), colores primario y secundario, wordmark "Minka" en Inter peso 600 debajo del ícono. Validado para legibilidad hasta 24px de tamaño de ícono de app.

- Versión completa (ícono + wordmark): splash screen, encabezados, materiales de pitch
- Versión ícono solo: favicon, ícono de app, espacios reducidos

---

## 8. Responsive y modo

**Mobile-first.** El diseño parte del layout de celular y escala hacia arriba, no al revés — es como la mayoría de los usuarios reales va a acceder a Minka.

| Breakpoint | Ancho | Comportamiento |
|---|---|---|
| Base (móvil) | hasta 599px | Una columna, ancho completo, navegación inferior si aplica |
| Tablet | 600–1023px | Contenido centrado, máximo 600px de ancho, mismo layout de una columna |
| Desktop | 1024px+ | Contenido centrado, máximo 720px de ancho — nunca estirar tarjetas de junta/pago a todo el ancho de una pantalla grande, se pierde la sensación de app enfocada |

**Modo oscuro: fuera de alcance para el MVP.** Solo tema claro (el definido en este documento). No diseñar variables dobles todavía — agregarlo después complica la paleta cálida sin aportar valor real a este público en esta etapa.

