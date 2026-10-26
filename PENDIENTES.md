# CargoNet USA · Landing — pendientes y decisiones

Registro de lo que falta confirmar. Nada de esto aparece como texto en la página.
Fecha de revisión: 23 de octubre de 2026.

## 1. Enlaces e integraciones

Centralizados en `src/content/site.ts`. Verificados en el sitio actual (cargonetusa.com):

| Acción | Destino | Estado |
| --- | --- | --- |
| Crear casillero | `https://cargonetusa.4plbox.com/registro/MQ==` | Verificado (iframe del popup actual) |
| Iniciar sesión | `https://casillero.cargonetusa.4plbox.com/login/MQ==` | Verificado |
| Prealertar | `https://cargonetusa.4plbox.com/prealerta/MQ==` | Verificado |
| Rastrear | `https://cargonetusa.4plbox.com/rastreo` | Verificado |
| Requisitos y restricciones | PDF `Requisitos-de-envio-CargonetUSA.pdf` (2022) | Verificado, **contenido por validar** |
| Políticas, términos, PQR, contacto | Páginas actuales de WordPress | Verificadas, **vigencia por confirmar** |

Pendiente:

- **Continuidad tras iniciar sesión.** No se pudo confirmar si 4plbox acepta un parámetro de retorno (p. ej. `?redirect=`). Hoy la prealerta abre su propia URL; si exige sesión, el portal decide. Confirmar con el proveedor.
- **Formularios sin servicio conectado.** Cotizador y solicitud de repuestos funcionan, validan y muestran la revisión de datos, pero dicen claramente que el envío en línea no está habilitado (con opción de enviarlo por WhatsApp). Para activarlos, definir un servicio que reciba POST JSON y configurar en `.env`:
  - `VITE_QUOTE_ENDPOINT=`
  - `VITE_PARTS_ENDPOINT=`
  La confirmación "Recibimos tu solicitud" solo aparece con una respuesta `2xx` real. No poner secretos en estas variables (se publican en el navegador).
- **Posibles cargos adicionales** y **Tiempos por modalidad** llevan a un asesor por WhatsApp porque no hay contenido publicado y vigente. Reemplazar por documento o página cuando exista.
- **"Restricciones" y "Mercancías sujetas a validación"** apuntan al mismo PDF de 2022. Conviene separarlos o actualizar el documento.

## 2. Datos por confirmar con CargoNet

- **WhatsApp principal.** El sitio actual muestra +57 300 488 3250 (inicio, footer) y +57 305 279 6008 (contacto/exportaciones). Se usó 300 488 3250.
- **Horario de atención.** No hay dato publicado. Campo `contact.hours` en `site.ts` (se muestra solo si se completa).
- **Años de experiencia.** El documento de estructura indica 15 años (`company.experienceYears`). El sitio actual dice "más de 10 años". Confirmar.
- **Despachos semanales.** Se publica tal como aparece en el documento de estructura; confirmar que la condición sigue vigente.
- **Dirección de bodega** (6993 NW 50 Street, Miami, FL 33166): tomada del sitio actual.
- **Cifras antiguas** (+2.000 entregas, +2.000 clientes, 220 países) y aliados: **no se publicaron**, falta validación.
- **Umbrales courier/carga.** El cotizador actual mezcla 50 kg y 67 kg; no se publicó ningún umbral. Definir la regla oficial antes de mostrarla.
- **Requisitos del PDF de 2022** (montos, impuestos, pesos y tiempos) deben revisarse con la normativa vigente.

## 3. Marca y recursos

- **Logo:** PNG de 270 × 77 px descargado del sitio actual (`public/img/logo-cargonet.png`) y versión blanca. Pedir el vector (SVG) y el manual de marca.
- **Paleta provisional** en `src/styles/tokens.css` (rojo #D71920, rojo profundo #930F18, rojo luminoso #EF3543…). El logo usa además un azul marino que no se incorporó a la interfaz; confirmar con el manual.
- **Tipografía:** Manrope (SIL Open Font License), solo subconjunto latino en `public/fonts`. Inter Rapidísimo usa "Prospero" (comercial, licencia no verificada), por eso no se usó.
- **Fotografías provisionales** (Unsplash, licencia libre). Sustituir por fotos propias o aprobadas, manteniendo los mismos nombres de archivo en `public/img`:

| Archivo | Uso | Foto original |
| --- | --- | --- |
| `hero-cargonet-*.webp` | Hero en desktop (≥1080 px) | Foto entregada por la agencia: `src/CARGONET USA impreso en caja de cartón.png` (original) |
| `hero-carguero-*.webp` | Hero en tablet y móvil | unsplash.com/photos (ID `1775449053619-89b5265f611a`) |
| `servicio-casillero.webp` | Casillero | ID `1553413077-190dd305871c` |
| `servicio-courier.webp` | Courier | ID `1566576721346-d4a3b4eaeb55` |
| `servicio-carga.webp` | Carga aérea y marítima | ID `1590496793907-4d66e2994b4d` |
| `servicio-import-export.webp` | Import/export | ID `1494412519320-aa613dfb7738` |
| `empresas-repuestos-*.webp` | Empresas | ID `1648815546048-6da4f0083a6d` |

- **Imagen para compartir (og:image 1200 × 630)**: pendiente.

## 4. Referentes

- Avianca: revisada la portada (Red Hat Display, blanco dominante, botones redondeados).
- TCC: se vio la fila de accesos en tarjetas, pero un popup cubría la página; no se inspeccionaron estados hover.
- Envía: se vio la pantalla de carga con degradado rojo y trazo de avión; las transiciones entre secciones no se pudieron recorrer completas.
- Inter Rapidísimo: la captura salió en negro; solo se identificó la fuente por estilos calculados.

## 5. Decisiones del documento aplicadas

- La sección "Portal de usuarios" no se construyó: el documento indica que esas funciones son del panel.
- Se omitió la pregunta frecuente sobre saldo y pagos por la misma razón.
- No se muestra "crédito disponible", dashboards ficticios, tarifas calculadas ni tracking simulado.

## 6. Textos que debe aprobar el cliente

Revisión del 26 de octubre de 2026 (vista desktop). Estos textos no salen tal cual del
documento "Estructura landing CargoNet" y necesitan visto bueno antes de publicar.

### Resumidos o modificados respecto al documento

| Sección | En el documento | En la página |
| --- | --- | --- |
| Hero (titular, texto y CTA) | "Tus compras y envíos internacionales, con el respaldo que necesitas." + párrafo + "Crear mi casillero USA" | Texto nuevo entregado por la agencia: "Tus compras internacionales, en buenas manos." + párrafo nuevo + "Crear mi casillero" (solo tablet/desktop; móvil conserva el texto del documento) |
| Servicios | Párrafo completo de cada servicio | Versión de una línea en desktop (en móvil sigue completo) |
| Cómo funciona | Texto completo de los 6 pasos | Versiones más cortas |
| Nota de despachos | Incluía "Las condiciones definitivas deben ser confirmadas…" | Se omitió esa frase (nota interna) |
| 15 años | "…según la información suministrada por la empresa" | Se omitió (nota interna) |

### Agregados (no están en el documento)

- Menú: "Servicios", "Herramientas", "Cómo funciona", "Cotizar", "Ayuda" y botón "Prealerta".
- Servicios: ahora solo 3 tarjetas (Importación, Exportación, Casillero). Los textos de "Importación" y "Exportación" (títulos, frases, descripciones y CTA "Cotizar importación" / "Cotizar exportación") los redactó la agencia a partir del párrafo de "Importaciones y exportaciones". (Las etiquetas sobre las fotos se retiraron.)
- Barra de pasos: "Paso 01…06", "Tu compra", "Entrega".
- Banner: título "4 modalidades de envío.", texto "Elige la que corresponde a tu operación…" y la descripción de cada modalidad.
- Cotizador: título "Cuéntanos sobre tu envío y solicita tu cotización." y su texto; descripciones de cada operación; nombres de los pasos del formulario; lista de tipos de mercancía; ayudas de los campos.
- "Antes de cotizar, revisa": subtítulo "Información clave para preparar tu envío." y rótulos "Documentos y condiciones" / "Consulta con un asesor".
- Preguntas frecuentes: "¿No encuentras tu respuesta? Un asesor puede orientarte sobre tu caso."
- Botón flotante de WhatsApp: "Habla con un asesor".
- Cotizador: nota "Ten en cuenta los impuestos. Los impuestos y aranceles de importación dependen del valor declarado, el peso, el tipo de mercancía y la normativa del país de destino. Un asesor te confirmará si tu envío los genera." — el cliente debe validar el texto (y, si aplica, incluir montos o topes vigentes).
- Footer: "Casillero en Estados Unidos, courier y carga internacional.", títulos de columna ("Instructivos", "Ayuda y contacto", "Información legal") y enlaces extra (Prealertar una compra, Crear mi casillero, Cotizar un envío).
- Datos de contacto (WhatsApp, correo, dirección de bodega): tomados del sitio actual, no del documento.

### Textos del documento que hoy no se muestran en desktop

- Sección "Soluciones para empresas" completa (retirada por decisión de diseño).
- Banner "4 modalidades de envío." con su texto y el acordeón de modalidades (retirado).
- "Tu mercancía merece respaldo" en tablet/desktop: ahora es una franja azul con 4 iconos y títulos (Atención personalizada, Tarifas competitivas, Seguridad y cuidado de la mercancía, Información clara). Se ocultaron el título, la tarjeta "15 años", "Tecnología al servicio del cliente" y los textos descriptivos. En móvil siguen igual.
- En "Antes de cotizar, revisa" (tablet/desktop) se quitaron los accesos por WhatsApp "Posibles cargos adicionales" y "Tiempos por modalidad". En móvil siguen igual.
- Formulario "Cuéntanos sobre tu envío y solicita tu cotización." (oculto en tablet/desktop; en esa sección solo queda "Antes de cotizar, revisa". En móvil sigue igual).
- Servicios "Courier internacional" y "Carga aérea y marítima" (retirados; también se quitaron del menú móvil y del footer).
- "¿Ya tienes casillero? Prealerta tu compra o consulta tus envíos." (retirado).
- "Hablar con un asesor" en el cierre (retirado).
- Título "Encuentra la solución adecuada para tu envío." y su texto (reemplazados por el título del formulario).
- Introducción de "Cómo funciona" ("Queremos que sepas qué hacer…"): se oculta en pantallas de 900 px de alto o menos.
- Por instrucción del documento: sección del portal de usuarios y la pregunta sobre saldo y pagos.

## 7. Panel "Cotiza o rastrea tu envío" (rastreo y cotización aproximada)

Implementado en `src/sections/QuickActions.tsx` y `src/sections/track-quote/`.
Lógica separada en `src/lib/quote-engine.ts` y `src/lib/tracking.ts`.

**Estado actual en producción (sin integraciones):**
- Rastrear: muestra "El rastreo desde esta página todavía no está conectado" y enlaza al portal 4plbox.
- Cotizar: valida los datos y muestra debajo de "Calcular tarifas" el "Valor de la tarifa aproximada" con Flete, Impuesto, Seguro y Total, igual que el cotizador actual (cargonetusa.com/cotizar-importacion-courier/). Sin tarifas cargadas muestra "Precio por confirmar. Consúltalo con un asesor".
- La fórmula replica la del cotizador actual (4plbox): flete = peso cobrado × tarifa; impuesto = % del valor declarado por caja cuando supera USD 200; seguro por caja. Los valores reales (tarifa, % de impuesto, seguro, cobro por peso volumen) están en el sistema 4plbox de CargoNet (servicios "Courier" y "Courier marítimo"); no se copiaron. CargoNet debe entregarlos o autorizar la conexión. Diferencia: aquí el impuesto se multiplica por la cantidad de cajas; en 4plbox se calcula una vez por fila.
- No se muestra ningún precio, plazo ni movimiento inventado.

**Modo demostración** (datos y tarifas FICTICIOS, marcados en pantalla):
- En desarrollo: abrir la página con `?demo`.
- En una versión de revisión: `VITE_DEMO_MODE=true`.
- Guías de prueba: `0000` → no encontrada; `error` → error de conexión; cualquier otra → envío de ejemplo.

**Para habilitar una cotización comercial, CargoNet debe entregar por servicio:**
- Tarifa por libra/kilo, cargo mínimo y cargos adicionales.
- Divisor volumétrico y sus unidades; regla de redondeo; si el peso se compara por caja o por envío.
- Tiempo estimado (rango de días hábiles) y desde qué evento se cuenta.
- Si los impuestos están incluidos o excluidos (hoy: "Impuestos no calculados").
- Cobertura de destinos para exportación.
- Confirmar qué servicios exigen dimensiones (hoy: obligatorias en carga, opcionales en courier).
- Se cargan en `rateConfigs` (quote-engine.ts) o vía API con `VITE_RATES_ENDPOINT`.

**Para habilitar el rastreo en la página:** una API de consulta por guía (`VITE_TRACKING_ENDPOINT`). El portal 4plbox actual no expone una API pública conocida.

**Para decidir:** la página tiene ahora dos cotizadores (este panel y el formulario de "4 modalidades de envío" más abajo). Definir si se mantienen ambos.

## Testimonios (sección nueva antes de Preguntas frecuentes)

**Contenido inventado, debe reemplazarse antes de publicar.** Los 6 testimonios (nombres, ciudades y citas) son de ejemplo y están en `src/sections/Testimonials.tsx`. CargoNet debe enviar testimonios reales con autorización de cada cliente (nombre, ciudad o empresa, cita y, si se quiere, foto).
- Hay dos tipos de tarjeta que se alternan: testimonio en texto y testimonio en video. Las de video muestran por ahora una imagen del propio sitio (bodega, puerto, carga); cuando CargoNet envíe los videos reales de clientes, se reemplazan. Los avatares son iniciales.
- Por ahora la sección solo se muestra en tablet/desktop (≥700px); en móvil está oculta hasta que se habilite.
