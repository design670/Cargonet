# CargoNet USA · Landing

Vite + React + TypeScript, sin librerías de UI ni de animación.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # compila a dist/
npm run lint
```

## Estructura

- `src/content/site.ts` — enlaces del portal, contacto y datos de empresa (un solo lugar para actualizarlos).
- `src/lib/forms.ts` — integración de formularios (separada de la interfaz).
- `src/styles/tokens.css` — color, tipografía, espaciado, radios y movimiento.
- `src/components/` — Button, campos de formulario, Accordion, SectionHeading, iconos.
- `src/sections/` — una sección por archivo, en el orden de la página.

Las animaciones de entrada solo se activan con JavaScript disponible y sin
`prefers-reduced-motion`; el contenido es visible por defecto.

Lo que falta confirmar está en [PENDIENTES.md](PENDIENTES.md).
