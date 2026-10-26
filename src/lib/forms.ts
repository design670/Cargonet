/**
 * Integración de formularios (separada de la presentación).
 *
 * No existe todavía un servicio conectado para recibir solicitudes.
 * Cuando CargoNet defina uno (CRM, correo transaccional, API propia),
 * basta con configurar VITE_QUOTE_ENDPOINT y VITE_PARTS_ENDPOINT en .env
 * (URLs públicas que acepten POST JSON). No se deben poner secretos aquí:
 * todo lo que empieza por VITE_ se publica en el navegador.
 */

export type FormKind = 'quote' | 'parts';

export type SubmitResult =
  | { status: 'sent' }
  | { status: 'not-configured' }
  | { status: 'error'; message: string };

const endpoints: Record<FormKind, string | undefined> = {
  quote: import.meta.env.VITE_QUOTE_ENDPOINT,
  parts: import.meta.env.VITE_PARTS_ENDPOINT,
};

export function isFormEnabled(kind: FormKind) {
  return Boolean(endpoints[kind]);
}

export async function submitForm(kind: FormKind, payload: Record<string, unknown>): Promise<SubmitResult> {
  const url = endpoints[kind];
  if (!url) return { status: 'not-configured' };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...payload, source: 'landing-cargonetusa', sentAt: new Date().toISOString() }),
    });
    if (!res.ok) {
      return { status: 'error', message: 'No pudimos enviar tu solicitud. Inténtalo de nuevo en unos minutos.' };
    }
    return { status: 'sent' };
  } catch {
    return { status: 'error', message: 'Revisa tu conexión a internet e inténtalo de nuevo.' };
  }
}

/* Validaciones compartidas */
export const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const phoneOk = (v: string) => v.replace(/[^\d]/g, '').length >= 7;
