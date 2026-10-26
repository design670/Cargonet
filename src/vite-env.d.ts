/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_QUOTE_ENDPOINT?: string;
  readonly VITE_PARTS_ENDPOINT?: string;
  readonly VITE_RATES_ENDPOINT?: string;
  readonly VITE_TRACKING_ENDPOINT?: string;
  readonly VITE_DEMO_MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
