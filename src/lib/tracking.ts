/**
 * Adaptador de rastreo (sin interfaz).
 *
 * Hoy CargoNet rastrea en su portal (https://cargonetusa.4plbox.com/rastreo),
 * que no expone una API pública conocida. Para mostrar el estado aquí:
 *  - configurar VITE_TRACKING_ENDPOINT (GET ?guia=… → TrackingInfo JSON, 404 si no existe).
 * Sin endpoint, la página indica que el rastreo en línea aún no está conectado
 * y enlaza al portal. Los datos de ejemplo solo aparecen en modo demostración.
 */
import { demoMode } from './demo';

export type TrackingEvent = { date: string; description: string; location?: string };

export type TrackingInfo = {
  guide: string;
  status: string;
  origin?: string;
  destination?: string;
  estimatedDelivery?: string;
  updatedAt?: string;
  events: TrackingEvent[];
};

/** Estados de ayuda: el número existe pero aún no hay un recorrido que mostrar. */
export type HelpState = 'not-received' | 'pending-scan' | 'issue';
const helpStates: HelpState[] = ['not-received', 'pending-scan', 'issue'];

export type TrackingResult =
  | { status: 'ok'; info: TrackingInfo; demo: boolean }
  | { status: 'not-found' }
  /** Tracking de la tienda aún no recibido en la bodega de Miami. */
  | { status: 'not-received' }
  /** Recibido en bodega, pendiente de pistoleo (escaneo y registro en el casillero). */
  | { status: 'pending-scan' }
  /** Novedad o documentación requerida. */
  | { status: 'issue'; detail?: string }
  | { status: 'not-configured' }
  | { status: 'error' };

/**
 * Busca por número de guía CargoNet, tracking de la tienda o identificador del envío.
 * La API puede responder { state: 'not-received' | 'pending-scan' | 'issue', detail? }
 * para los estados de ayuda, o un TrackingInfo cuando hay recorrido.
 */
export async function trackShipment(guide: string): Promise<TrackingResult> {
  const endpoint = import.meta.env.VITE_TRACKING_ENDPOINT;
  if (endpoint) {
    try {
      const res = await fetch(`${endpoint}?guia=${encodeURIComponent(guide)}`, { headers: { Accept: 'application/json' } });
      if (res.status === 404) return { status: 'not-found' };
      if (!res.ok) return { status: 'error' };
      const data = (await res.json()) as TrackingInfo & { state?: string; detail?: string };
      if (data.state && helpStates.includes(data.state as HelpState)) {
        return data.state === 'issue' ? { status: 'issue', detail: data.detail } : { status: data.state as 'not-received' | 'pending-scan' };
      }
      return { status: 'ok', info: data, demo: false };
    } catch {
      return { status: 'error' };
    }
  }

  if (demoMode) {
    await new Promise((r) => setTimeout(r, 500));
    // Códigos de prueba para ver cada estado de ayuda
    const code = guide.toUpperCase();
    if (/^0+$/.test(guide)) return { status: 'not-found' };
    if (code === 'NORECIBIDO') return { status: 'not-received' };
    if (code === 'PISTOLEO') return { status: 'pending-scan' };
    if (code === 'NOVEDAD') return { status: 'issue', detail: 'Falta la factura de compra.' };
    if (guide.toLowerCase() === 'error') return { status: 'error' };
    return {
      status: 'ok',
      demo: true,
      info: {
        guide,
        status: 'En tránsito internacional',
        origin: 'Miami, FL',
        destination: 'Barranquilla, Colombia',
        updatedAt: '24 oct. 2026, 4:10 p. m.',
        events: [
          { date: '24 oct. 2026', description: 'Despachado en vuelo internacional', location: 'Miami, FL' },
          { date: '22 oct. 2026', description: 'Validación de documentos completada', location: 'Bodega Miami' },
          { date: '21 oct. 2026', description: 'Recibido en bodega CargoNet', location: 'Bodega Miami' },
        ],
      },
    };
  }

  return { status: 'not-configured' };
}
