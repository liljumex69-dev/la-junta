# Junta — Sistema de diseño

Referencia visual completa para el prototipo. Junta es una tesorería digital colectiva para asociaciones de comerciantes de mercado — el gancho central es la protección de fondos compartidos (vs. el riesgo real de tenerlos en efectivo), gobernados por firma múltiple de un directorio. Público: comerciantes de mercado y sus directivos, con poca familiaridad tecnológica previa.

**Principio general:** institucional pero cálido — transmite custodia y seriedad financiera sin caer en frío corporativo ni en azul/morado genérico de fintech. Nunca mencionar wallet, gas ni jerga cripto en ninguna pantalla.

---

## 1. Colores

### Marca
| Token | Hex | Uso |
|---|---|---|
| Primario | `#1F5C3D` | Botones principales, acciones clave, elementos de marca — evoca resguardo/bóveda |
| Primario oscuro (hover/presionado) | `#163F2A` | Estados de interacción sobre el primario |
| Secundario / acento | `#B8863B` | Acciones secundarias, resaltados, badges — bronce/dorado institucional |

### Neutros
| Token | Hex | Uso |
|---|---|---|
| Fondo base | `#F3EFE4` | Fondo general de pantalla — pergamino cálido, evoca documento/acta oficial |
| Superficie (tarjetas) | `#FAF7F0` | Tarjetas y elementos elevados sobre el fondo base |
| Texto primario | `#24312B` | Texto principal, títulos — carbón con tinte verde, coherente con el primario |
| Texto secundario | `#7C8A80` | Texto de apoyo, fechas, notas, placeholders |
| Borde / división | `#DDD6C4` | Líneas divisorias, bordes de inputs y tarjetas |

### Estado
| Token | Hex | Uso |
|---|---|---|
| Éxito | `#4C8C5C` | Cuota pagada, propuesta aprobada — verde más claro que el primario, nunca el mismo tono |
| Alerta / peligro | `#A6342E` | Mora avanzada, intento de acción sin firmas suficientes |
| Mora (advertencia leve) | `#B8863B` | Reutiliza el secundario — cuota pendiente, sin escalar a alerta todavía |

---

## 2. Tipografía

**Inter**, igual que en Minka — se mantiene por la misma razón: máxima legibilidad para un público con poca familiaridad tecnológica, priorizando claridad sobre personalidad tipográfica.

| Estilo | Tamaño | Peso | Uso |
|---|---|---|---|
| Display / H1 | 28px | 600 | Títulos de pantalla |
| H2 | 22px | 600 | Encabezados de sección |
| H3 | 18px | 600 | Títulos de tarjeta, subsecciones |
| Cuerpo | 16px | 400 | Texto general — nunca más chico que esto para contenido funcional |
| Cuerpo secundario | 14px | 400 | Texto de apoyo, descripciones cortas |
| Micro | 12px | 400 | Uso mínimo — nunca para información crítica |
| Botón | 16px | 600 | Texto de botones y CTAs |

Interlineado: 1.5 en cuerpo, 1.3 en títulos. Nunca reducir el tamaño base de 16px en flujos de pago, propuestas de gasto o firmas.

---

## 3. Espaciado y bordes

- Escala: 4 / 8 / 12 / 16 / 24 / 32 / 48px
- Radio en tarjetas y contenedores: **12px**
- Radio en botones e inputs: **10px**
- Radio en badges/etiquetas: **8px**
- Área táctil mínima: 44x44px en cualquier elemento interactivo

---

## 4. Sombras y elevación

- Tarjeta en reposo: `0 1px 3px rgba(36, 49, 43, 0.07)`
- Tarjeta elevada / modal: `0 4px 16px rgba(36, 49, 43, 0.14)`
- Botones: sin sombra por defecto
- La sombra usa el texto primario (verde-carbón) en baja opacidad, no negro puro

---

## 5. Iconografía

**Phosphor Icons** (`@phosphor-icons/react`), peso duotone o fill — se mantiene la misma decisión que en Minka. A diferencia de Minka, aquí sí tiene sentido usar íconos de candado/bóveda/escudo cuando corresponda: la promesa central de Junta es literalmente custodia y protección, no confianza social entre pares — el ícono de seguridad refuerza el mensaje en vez de contradecirlo.

---

## 6. Movimiento

Transiciones simples y breves (200-250ms), fade o slide suave — calma y seriedad financiera, nunca "demo tecnológica llamativa".

### Estados de interacción y microcopy de carga

- "Creando la asociación…", "Uniéndote al fondo…", "Registrando tu pago…", "Enviando la propuesta…", "Confirmando tu firma…"
- Botones: estado deshabilitado + spinner pequeño integrado
- Carga de contenido: skeleton loader con color de superficie
- Confirmación de éxito: momento visual breve y positivo (check, destello del verde de éxito) antes de continuar

### Micro-animaciones (no librerías genéricas tipo Lottie)

Evitar librerías públicas de animación genérica — su estilo colorido y "rebotón" no encaja con un producto institucional que maneja dinero real, y muchas tienen licencias poco claras para uso comercial. En su lugar, 2-3 micro-animaciones propias, simples, con los colores y tiempos ya definidos en este documento: el checkmark al juntarse la firma final de una propuesta, el conteo ascendente del saldo del fondo, una barra de progreso llenándose mientras faltan firmas.

### Gráficos y visualización de datos

Los dashboards (fondo colectivo y ahorro personal) reutilizan la paleta ya definida — primario para la serie principal, secundario para la de contraste, éxito/alerta para estados positivos/negativos. No introducir una paleta nueva de colores "para gráficos" — mantiene todo coherente con el resto de la marca.

---

## 7. Logo

Se reutiliza el logo de Minka (figuras humanas en simetría de espejo, formando una X de cuatro puntas), recoloreado a la paleta de Junta. La forma sigue funcionando conceptualmente aquí: cuatro figuras iguales alrededor de un centro compartido, ninguna por encima de otra — coherente con un directorio donde ningún firmante tiene poder unilateral (el mismo principio detrás del umbral de firmas 3-de-5). Wordmark "Junta" en Inter peso 600 debajo del ícono.

- Versión completa (ícono + wordmark): splash screen, encabezados, materiales de pitch
- Versión ícono solo: favicon, ícono de app

---

## 8. Responsive y modo

**Mobile-first**, misma escala de breakpoints que Minka: base hasta 599px (una columna), tablet 600–1023px (máx. 600px), desktop 1024px+ (máx. 720px, nunca estirar tarjetas de fondo/propuestas a todo el ancho).

**Modo oscuro: fuera de alcance para el MVP.** Solo tema claro definido en este documento.
