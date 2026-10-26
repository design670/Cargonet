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
