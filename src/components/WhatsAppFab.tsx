import { contact, whatsappLink } from '../content/site';

/** Botón flotante de WhatsApp (tablet/desktop). */
export function WhatsAppFab() {
  return (
    <a
      className="wa-fab"
      href={whatsappLink('Hola, quiero información sobre los servicios de CargoNet USA.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Hablar con un asesor por WhatsApp, ${contact.whatsappLabel} (se abre en una pestaña nueva)`}
    >
      <span className="wa-fab__ring" aria-hidden="true" />
      <span className="wa-fab__ring wa-fab__ring--2" aria-hidden="true" />
      <span className="wa-fab__icon" aria-hidden="true">
        <WhatsAppGlyph size={30} />
      </span>
      <span className="wa-fab__label">Habla con un asesor</span>
    </a>
  );
}

/** Logo de WhatsApp (relleno) reutilizable. */
export function WhatsAppGlyph({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="currentColor" focusable="false" aria-hidden="true">
      <path d="M16.04 3C8.86 3 3.03 8.82 3.03 16c0 2.3.6 4.53 1.74 6.5L3 29l6.68-1.75A12.95 12.95 0 0 0 16.04 29C23.2 29 29 23.18 29 16S23.2 3 16.04 3Zm0 23.6c-2 0-3.95-.54-5.65-1.55l-.4-.24-3.97 1.04 1.06-3.86-.26-.4A10.56 10.56 0 0 1 5.43 16c0-5.86 4.76-10.62 10.61-10.62 5.85 0 10.6 4.76 10.6 10.62 0 5.85-4.75 10.6-10.6 10.6Zm5.82-7.94c-.32-.16-1.88-.93-2.17-1.03-.29-.11-.5-.16-.71.16-.21.32-.82 1.03-1 1.24-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.18.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.71-1.71-.97-2.34-.26-.62-.52-.53-.71-.54h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.65 0 1.56 1.14 3.07 1.3 3.28.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.45.2 2 .12.61-.09 1.88-.77 2.14-1.51.27-.74.27-1.38.19-1.51-.08-.13-.29-.21-.61-.37Z" />
    </svg>
  );
}
