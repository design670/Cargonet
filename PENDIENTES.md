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
| Hero (titular, texto y CTA) | "Tus compras y envíos internacionales, con el respaldo que necesitas." + párrafo + "Crear mi casillero USA" | Texto nuevo entregado por la agencia: "Compra en USA. Recíbelo en Colombia." + párrafo nuevo + "Crear mi casillero" (solo tablet/desktop; móvil conserva el texto del documento) |
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

## 7. Panel "Cotiza o rastrea tu envío" (Cotizar / Rastrear / Prealertar)

Rediseñado el 2026-11-03 (todas las resoluciones, móvil incluido, por instrucción de la agencia).
Implementado en `src/sections/QuickActions.tsx` y `src/sections/quick-tools/`; estilos en `src/styles/quick-tools.css`.
Tarifa en `src/lib/courier-rates.ts`; rastreo en `src/lib/tracking.ts`.

**Cotizar (courier Miami → Colombia), datos confirmados por la agencia:**
- Tarifa USD 1,90 por libra + seguro para todos los pesos (documento de la agencia, 2026-11-09; reemplaza 2,20 / 1,80). Límites courier: 110 lb de peso real, USD 2.000 y suma de los 3 lados hasta 3 m. Si se supera, se ofrece cotizar como carga con un asesor (WhatsApp).
- IVA del 19% cuando el valor declarado supera USD 200 (se calcula sobre el valor declarado: **confirmar si la base incluye flete y seguro**). Producto de EE.UU. hasta USD 200: arancel e IVA "no aplica".
- "Empezar mi envío" lleva al registro de casillero (4plbox); se oculta cuando el envío no cumple Courier.
- **Contactos (2026-11-09):** bajo el resultado se muestran "Comercial – Jonathan +57 305 279 6008" (enlace a WhatsApp) y "Despacho – Mildreth +57 302 448 0416", ambos con enlace a WhatsApp (`contact.commercial` y `contact.dispatch` en `src/content/site.ts`). Número de Mildreth corregido el 2026-11-09.
- **WhatsApp comercial:** "Cotiza tu envío" (botón verde con ícono en la tarjeta "No cumple Courier"), "Cotizar importación/exportación", "Hablar con un asesor" de Resolvemos tus dudas (2026-11-09), el botón flotante de WhatsApp y "Hablar con un asesor" del cierre (2026-11-11, canal integrado con la IA que se hará con Diego) y las consultas de cargos y tiempos van a +57 305 279 6008 (`commercialWhatsappLink`). El resto de enlaces de WhatsApp (cabecera "Asesoría por WhatsApp", prealerta, rastreo, reseña y el enlace dentro de la respuesta de contacto) siguen al número general +57 300 488 3250: confirmar si también deben pasar al comercial.
- **Prevalidación Courier (2026-11-06):** las medidas (largo, ancho, alto) están siempre visibles y bajo el formulario se ven los 3 límites con su estado (valor declarado, peso real, suma de los 3 lados). La tarjeta de resultado muestra "Apto preliminar para Courier" (verde, ícono ✓), "No cumple Courier" (rojo/naranja, ícono de alerta, con la condición que falla y "Cotizar con un asesor") o "Agrega las medidas para validar Courier". Lógica en `courierChecks` de `src/lib/courier-rates.ts`. El texto aclara que es una prevalidación y que la aceptación definitiva depende de la revisión documental, la mercancía y las condiciones aduaneras.

**Pendiente de confirmar con CargoNet (hoy se muestran como "Por confirmar" y no se suman al total):**
- Costo del seguro (hoy "Por confirmar" en el cotizador) y porcentaje de arancel cuando aplica (producto de otro país o valor mayor a USD 200).
- Cobro por pieza adicional.
- Divisor del peso volumétrico (mientras no exista, las medidas no cambian el flete).
- Redondeo del peso (hoy se cobra el peso exacto escrito, p. ej. 6,5 lb).

**Rastrear:**
- Sin API de rastreo: remite al portal 4plbox. Para conectarlo: `VITE_TRACKING_ENDPOINT`.
- Busca por número de guía CargoNet, tracking de la tienda o identificador del envío (el mismo campo).
- **Estados de ayuda (2026-11-06):** número no encontrado (404), tracking aún no recibido en Miami, paquete pendiente de pistoleo, y novedad o documentación requerida. La API debe responder `{ "state": "not-received" | "pending-scan" | "issue", "detail"?: "…" }` para los tres últimos. En modo demostración (`?demo`) se prueban con `0000`, `NORECIBIDO`, `PISTOLEO` y `NOVEDAD`.
- La guía de ejemplo `CNU-240817` muestra los estados marcados como "Guía de ejemplo". Confirmar el formato real de guía.
- **Estados del envío (2026-11-06):** la línea de tiempo "De tu compra a la entrega" y la guía de ejemplo usan los mismos 9 estados (`steps` en `src/sections/StepsCarousel.tsx`): Casillero creado → Compra realizada → Prealerta → Recibido en Miami → Validación → Despacho internacional → Arribo a Colombia → En distribución → Entregado. Confirmar con CargoNet que coinciden con los estados de su sistema (4plbox) para que el rastreo real los muestre igual.

**Prealertar:**
- Sin servicio conectado: valida los datos y abre WhatsApp con la prealerta; la factura se adjunta en el chat (un enlace de WhatsApp no puede llevar archivos).
- Confirmar el formato del número de casillero (ejemplo usado: `CNU-00000`).
- Enlace secundario a la prealerta oficial del casillero (4plbox).

**Franja de tiendas (≥700px, detrás del panel, sobre el rojo del hero):**
- Logos de eBay, Walmart, Best Buy, Nike, Sephora, Target, Apple, Costco, Shein, Macy's y B&H descargados de Wikimedia Commons (2026-11-03) en `public/img/tiendas/`, mostrados en blanco.
- Son marcas registradas de terceros: CargoNet debe confirmar que puede usarlas en su publicidad (uso referencial "compra en estas tiendas"). Si alguna marca pide retirarla, basta con quitarla de la lista `stores` en `QuickActions.tsx`.

**Para decidir:** la página tiene dos cotizadores (este panel y el formulario de "4 modalidades de envío" más abajo). Definir si se mantienen ambos.

## "Información clave para preparar tu envío" (tablet/desktop)

Desde el 2026-11-06 muestra solo 3 documentos (`prepDocs` en `src/sections/Quote.tsx`):
- "Cómo registrarte y crear tu casillero" y "Cómo prealertar tu pedido" enlazan por ahora a las páginas de registro y prealerta del portal 4plbox: no hay instructivos en PDF. Si CargoNet los entrega, se cambia el enlace y la etiqueta "Portal" por "PDF".
- "Restricciones de envío" enlaza al PDF de requisitos de 2022 (revisar vigencia).
- En móvil sigue la lista anterior (Requisitos, Restricciones, Mercancías, Condiciones, Cargos, Tiempos).

## Casillero virtual (sección nueva antes de "Soluciones logísticas")

Agregada el 2026-11-03 en `src/sections/Locker.tsx` y `src/styles/locker.css`. Fondo azul, etiqueta de envío con la dirección de la bodega (de `site.ts`) y, desde el 2026-11-06, un flujo de 4 pasos a todo el ancho donde cada paso dice qué hace el cliente ("Tú") y qué hace CargoNet.
- Confirmar con CargoNet el texto de cada paso, en especial: "Identificamos tu paquete en cuanto llega" y "Escaneamos tu paquete, revisamos los requisitos Courier, despachamos y te avisamos en cada estado".
- Solo se muestra en tablet/desktop (≥700px); en móvil está oculta mientras la versión móvil siga congelada.
- Confirmar con CargoNet: "Registro en 2 pasos", el formato del código de casillero (`CNU-00000`) y si la dirección se escribe "50th Street" (en el sitio actual aparece "50 Street").

## Soluciones logísticas: Importación y Exportación (2026-11-09)

El detalle desplegable de cada tarjeta usa el contenido entregado por la agencia (`services` en `src/sections/Services.tsx`): descripción, condiciones principales, nota y botón de cotización al WhatsApp comercial.
- **Validación previa (pedida en el documento):** confirmar con Operaciones/Comercial que tarifa, límites, impuestos y tiempos estén vigentes antes de publicar.
- ~~Inconsistencia con el cotizador~~ (resuelta 2026-11-09): el cotizador ya usa USD 1,90/lb + seguro e IVA 19%. Queda pendiente el costo del seguro y la base exacta del IVA.
- Exportación: exención hasta USD 800 "según condiciones del país de destino"; tiempos de 1 a 6 días hábiles sin incluir aduana; recogida a domicilio hasta las 5:00 p. m.

## "Nuestros aliados" (sección nueva antes de testimonios)

En `src/sections/Compare.tsx` y `src/styles/compare.css`: título grande "Nuestros aliados." y fila de 5 logos. (La comparación "Comprando directo al exterior" vs. "Con tu casillero CargoNet" se quitó el 2026-11-03.)
- Solo se muestra en tablet/desktop (≥700px); en móvil está oculta mientras la versión móvil siga congelada.
- Logos de aliados en `public/img/aliados/`: FedEx, DHL y LATAM de Wikimedia Commons; Servientrega y Coordinadora de sus sitios oficiales. Se muestran en gris y a color al pasar el mouse.
- Confirmar con CargoNet que FedEx, DHL, LATAM, Servientrega y Coordinadora son aliados reales y que pueden mostrarse sus logos.

## Reseñas / testimonios (desde el 2026-11-06, justo después de "De tu compra a la entrega")

**Contenido de ejemplo, debe reemplazarse antes de publicar.** Los 6 testimonios (nombres, ciudades, citas y calificación de 1 a 5) son de ejemplo y están en `src/sections/Testimonials.tsx`. No se encontraron reseñas públicas de CargoNet USA (su sitio no tiene testimonios ni enlace a Google/Trustpilot). CargoNet debe enviar reseñas reales con autorización de cada cliente (nombre, ciudad o empresa, cita, estrellas y, si se quiere, foto).
- La calificación promedio (hoy 4,7 de 6 reseñas) se calcula sola con las estrellas de cada reseña; no es una cifra fija.
- **"Dejar una reseña":** destino por definir (Google, Facebook…). Mientras `links.review` en `src/content/site.ts` sea `null`, el botón abre WhatsApp con un mensaje para enviar la reseña.
- Hay dos tipos de tarjeta que se alternan: testimonio en texto y testimonio en video. Las de video muestran por ahora una imagen del propio sitio (bodega, puerto, carga); cuando CargoNet envíe los videos reales de clientes, se reemplazan. Los avatares son iniciales.
- Por ahora la sección solo se muestra en tablet/desktop (≥700px); en móvil está oculta hasta que se habilite.
