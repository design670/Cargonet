/**
 * Datos centralizados de CargoNet USA.
 * Todos los destinos externos se verificaron en https://cargonetusa.com (oct. 2026).
 * Lo que sigue pendiente de confirmación está documentado en PENDIENTES.md,
 * nunca como texto visible en la página.
 */

const PORTAL = 'https://cargonetusa.4plbox.com';
const SITE = 'https://cargonetusa.com';

export const links = {
  /** Registro de casillero (plataforma 4plbox). */
  register: `${PORTAL}/registro/MQ==`,
  /** Inicio de sesión del casillero. */
  login: 'https://casillero.cargonetusa.4plbox.com/login/MQ==',
  /** Prealerta de compras. */
  prealert: `${PORTAL}/prealerta/MQ==`,
  /** Rastreo de envíos. */
  tracking: `${PORTAL}/rastreo`,
  /** Documento público de requisitos y restricciones. */
  requirementsPdf: `${SITE}/wp-content/uploads/2022/11/Requisitos-de-envio-CargonetUSA.pdf`,
  privacy: `${SITE}/politica-de-privacidad/`,
  terms: `${SITE}/terminos-y-condiciones/`,
  pqr: `${SITE}/pqr-y-devoluciones/`,
  contact: `${SITE}/contactenos/`,
  facebook: 'https://www.facebook.com/Cargonetusa/',
  instagram: 'https://www.instagram.com/cargonetusa/',
} as const;

export const contact = {
  whatsappNumber: '573004883250',
  whatsappLabel: '+57 300 488 3250',
  email: 'servicioalcliente@cargonetusa.com',
  /** Dirección de la bodega publicada en el sitio actual. */
  warehouse: ['6993 NW 50 Street', 'Miami, Florida 33166'],
  /** Horario de atención: sin dato aprobado. Se muestra solo si se completa. */
  hours: null as string | null,
};

export const whatsappLink = (message?: string) =>
  `https://wa.me/${contact.whatsappNumber}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

/** Datos aportados por la empresa (documento de estructura). */
export const company = {
  name: 'CargoNet USA',
  experienceYears: 15,
};
