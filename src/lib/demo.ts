/**
 * Modo demostración: muestra datos FICTICIOS de rastreo y tarifas para revisar
 * el diseño. Nunca se activa por defecto en producción.
 *  - En desarrollo: agregar `?demo` a la URL.
 *  - En una versión de revisión: VITE_DEMO_MODE=true.
 */
export const demoMode =
  import.meta.env.VITE_DEMO_MODE === 'true' ||
  (import.meta.env.DEV && typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('demo'));
