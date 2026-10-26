/**
 * Motor de cotización aproximada (sin interfaz).
 *
 * CargoNet todavía no ha entregado tarifas, tiempos ni reglas de impuestos.
 * Por eso `rateConfigs` está vacío: en producción la página muestra
 * "Tarifa no disponible" y ofrece continuar con un asesor.
 *
 * Puntos de conexión para habilitar una cotización comercial:
 *  1. VITE_RATES_ENDPOINT: API de tarifas (POST JSON → QuoteApiResponse).
 *  2. o completar `rateConfigs` con las reglas reales por servicio.
 *
 * `demoRateConfigs` contiene valores FICTICIOS solo para revisar el diseño.
 * Se activan con el modo demostración (ver `demoMode` en lib/demo.ts) y el
 * resultado se marca siempre como "Modo demostración".
 */
import { demoMode } from './demo';

export type ServiceId = 'imp-courier' | 'imp-carga' | 'exp-courier' | 'exp-carga';
export type WeightUnit = 'lb' | 'kg';
export type DimUnit = 'in' | 'cm';

/* ---------- Servicios reales del proyecto (modalidades del documento) ---------- */

export type ServiceDef = {
  id: ServiceId;
  label: string;
  /** Origen fijo; si es null se pide al usuario. */
  origin: string | null;
  /** Destino fijo; si es null se pide al usuario. */
  destination: string | null;
  /** Si el servicio exige dimensiones para cotizar. */
  dimensionsRequired: boolean;
};

export const services: ServiceDef[] = [
  { id: 'imp-courier', label: 'Importación por courier', origin: 'Estados Unidos (Miami)', destination: 'Colombia', dimensionsRequired: false },
  { id: 'imp-carga', label: 'Importación de carga', origin: null, destination: 'Colombia', dimensionsRequired: true },
  { id: 'exp-courier', label: 'Exportación por courier', origin: 'Colombia', destination: null, dimensionsRequired: false },
  { id: 'exp-carga', label: 'Exportación de carga', origin: 'Colombia', destination: null, dimensionsRequired: true },
];

export const serviceById = (id: string) => services.find((s) => s.id === id);

/* ---------- Configuración de tarifas ---------- */

export type RateConfig = {
  currency: 'USD';
  /** Unidad en la que se cobra el peso. */
  weightUnit: WeightUnit;
  ratePerUnit: number;
  minimumCharge: number;
  extraCharges: { label: string; amount: number; per: 'shipment' | 'box' }[];
  /** Peso volumétrico: L×A×H (en dimUnit) / divisor = peso en weightUnit. null = no aplica. */
  volumetric: { divisor: number; dimUnit: DimUnit; weightUnit: WeightUnit } | null;
  rounding: { mode: 'ceil' | 'round' | 'none'; step: number };
  /** Comparar real vs. volumétrico por caja o por envío completo. */
  billing: 'per-box' | 'per-shipment';
  transitDays: { min: number; max: number; from: string } | null;
  taxes: 'included' | 'excluded' | 'unknown';
  /** Impuesto estimado (como el cotizador actual de CargoNet): % del valor declarado por caja si supera el umbral. */
  tax: { percent: number; threshold: number } | null;
  /** Seguro por caja. */
  insurance: { perBox: number } | null;
};

/** Tarifas reales por servicio. Vacío hasta que CargoNet las entregue. */
export const rateConfigs: Partial<Record<ServiceId, RateConfig>> = {};

/** Valores FICTICIOS para el modo demostración. No son tarifas de CargoNet. */
export const demoRateConfigs: Record<ServiceId, RateConfig> = {
  'imp-courier': {
    currency: 'USD',
    weightUnit: 'lb',
    ratePerUnit: 2.5,
    minimumCharge: 10,
    extraCharges: [{ label: 'Manejo (demo)', amount: 3, per: 'shipment' }],
    volumetric: { divisor: 166, dimUnit: 'in', weightUnit: 'lb' },
    rounding: { mode: 'ceil', step: 1 },
    billing: 'per-box',
    transitDays: { min: 5, max: 8, from: 'la recepción en la bodega de Miami' },
    taxes: 'unknown',
    tax: { percent: 10, threshold: 200 },
    insurance: { perBox: 1 },
  },
  'imp-carga': {
    currency: 'USD',
    weightUnit: 'kg',
    ratePerUnit: 3.2,
    minimumCharge: 80,
    extraCharges: [{ label: 'Documentación (demo)', amount: 25, per: 'shipment' }],
    volumetric: { divisor: 6000, dimUnit: 'cm', weightUnit: 'kg' },
    rounding: { mode: 'ceil', step: 0.5 },
    billing: 'per-shipment',
    transitDays: null,
    taxes: 'excluded',
    tax: null,
    insurance: { perBox: 2 },
  },
  'exp-courier': {
    currency: 'USD',
    weightUnit: 'lb',
    ratePerUnit: 4,
    minimumCharge: 15,
    extraCharges: [],
    volumetric: { divisor: 166, dimUnit: 'in', weightUnit: 'lb' },
    rounding: { mode: 'ceil', step: 1 },
    billing: 'per-box',
    transitDays: null,
    taxes: 'unknown',
    tax: { percent: 10, threshold: 200 },
    insurance: { perBox: 1 },
  },
  'exp-carga': {
    currency: 'USD',
    weightUnit: 'kg',
    ratePerUnit: 3.8,
    minimumCharge: 100,
    extraCharges: [{ label: 'Documentación (demo)', amount: 30, per: 'shipment' }],
    volumetric: { divisor: 6000, dimUnit: 'cm', weightUnit: 'kg' },
    rounding: { mode: 'ceil', step: 0.5 },
    billing: 'per-shipment',
    transitDays: null,
    taxes: 'excluded',
    tax: null,
    insurance: { perBox: 2 },
  },
};

/* ---------- Números y unidades ---------- */

const LB_PER_KG = 1 / 0.45359237;
const CM_PER_IN = 2.54;

/** Acepta coma o punto decimal. Devuelve NaN si no es un número válido. */
export function parseNum(v: string): number {
  const s = v.trim();
  if (!s) return NaN;
  if (!/^\d+([.,]\d+)?$/.test(s)) return NaN;
  return Number(s.replace(',', '.'));
}

export function convertWeight(value: number, from: WeightUnit, to: WeightUnit) {
  if (from === to) return value;
  return from === 'kg' ? value * LB_PER_KG : value / LB_PER_KG;
}

export function convertDim(value: number, from: DimUnit, to: DimUnit) {
  if (from === to) return value;
  return from === 'in' ? value * CM_PER_IN : value / CM_PER_IN;
}

/** Formato corto para reescribir un campo tras convertir (máx. 2 decimales). */
export function formatInput(n: number) {
  return String(Math.round(n * 100) / 100);
}

function applyRounding(n: number, r: RateConfig['rounding']) {
  if (r.mode === 'none' || r.step <= 0) return n;
  const k = n / r.step;
  return (r.mode === 'ceil' ? Math.ceil(k - 1e-9) : Math.round(k)) * r.step;
}

/* ---------- Cálculo ---------- */

export type PackageInput = { qty: string; weight: string; length: string; width: string; height: string; value: string };

export type QuoteInput = {
  serviceId: ServiceId;
  origin: string;
  destination: string;
  weightUnit: WeightUnit;
  dimUnit: DimUnit;
  packages: PackageInput[];
};

export type QuoteBreakdown = {
  currency: 'USD';
  boxes: number;
  weightUnit: WeightUnit;
  realWeight: number;
  volumetricWeight: number | null;
  billableWeight: number;
  transport: number;
  /** Flete: transporte + cargos adicionales. */
  freight: number;
  tax: number;
  insurance: number;
  extras: { label: string; amount: number }[];
  minimumApplied: boolean;
  total: number;
  declaredValue: number;
  transitDays: RateConfig['transitDays'];
  taxes: RateConfig['taxes'];
};

export function calculate(input: QuoteInput, cfg: RateConfig): QuoteBreakdown {
  let boxes = 0;
  let real = 0;
  let vol = 0;
  let billable = 0;
  let declared = 0;
  let hasVol = false;
  let tax = 0;

  for (const p of input.packages) {
    const qty = parseNum(p.qty);
    const wBox = convertWeight(parseNum(p.weight), input.weightUnit, cfg.weightUnit);
    const dims = [p.length, p.width, p.height].map(parseNum);
    let vBox = 0;
    if (cfg.volumetric && dims.every((d) => d > 0)) {
      const [l, w, h] = dims.map((d) => convertDim(d, input.dimUnit, cfg.volumetric!.dimUnit));
      vBox = convertWeight((l * w * h) / cfg.volumetric.divisor, cfg.volumetric.weightUnit, cfg.weightUnit);
      hasVol = true;
    }
    boxes += qty;
    real += wBox * qty;
    vol += vBox * qty;
    const valueBox = parseNum(p.value) || 0;
    declared += valueBox * qty;
    if (cfg.tax && valueBox > cfg.tax.threshold) tax += ((valueBox * cfg.tax.percent) / 100) * qty;
    if (cfg.billing === 'per-box') billable += applyRounding(Math.max(wBox, vBox), cfg.rounding) * qty;
  }

  if (cfg.billing === 'per-shipment') billable = applyRounding(Math.max(real, vol), cfg.rounding);

  const transportRaw = billable * cfg.ratePerUnit;
  const minimumApplied = transportRaw < cfg.minimumCharge;
  const transport = Math.max(transportRaw, cfg.minimumCharge);
  const extras = cfg.extraCharges.map((c) => ({ label: c.label, amount: c.per === 'box' ? c.amount * boxes : c.amount }));
  const freight = transport + extras.reduce((s, e) => s + e.amount, 0);
  const insurance = cfg.insurance ? cfg.insurance.perBox * boxes : 0;
  const total = freight + tax + insurance;

  return {
    currency: cfg.currency,
    boxes,
    weightUnit: cfg.weightUnit,
    realWeight: real,
    volumetricWeight: hasVol ? vol : null,
    billableWeight: billable,
    transport,
    freight,
    tax,
    insurance,
    extras,
    minimumApplied,
    total,
    declaredValue: declared,
    transitDays: cfg.transitDays,
    taxes: cfg.taxes,
  };
}

/* ---------- Adaptador (API → configuración real → demo) ---------- */

export type QuoteResult =
  | { status: 'ok'; breakdown: QuoteBreakdown; demo: boolean }
  | { status: 'unavailable' }
  | { status: 'no-coverage' }
  | { status: 'error' };

type QuoteApiResponse = { coverage?: boolean; available?: boolean; breakdown?: QuoteBreakdown };

export async function getQuote(input: QuoteInput): Promise<QuoteResult> {
  const endpoint = import.meta.env.VITE_RATES_ENDPOINT;
  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(input),
      });
      if (!res.ok) return { status: 'error' };
      const data = (await res.json()) as QuoteApiResponse;
      if (data.coverage === false) return { status: 'no-coverage' };
      if (!data.breakdown || data.available === false) return { status: 'unavailable' };
      return { status: 'ok', breakdown: data.breakdown, demo: false };
    } catch {
      return { status: 'error' };
    }
  }

  const real = rateConfigs[input.serviceId];
  if (real) return { status: 'ok', breakdown: calculate(input, real), demo: false };

  if (demoMode) {
    await new Promise((r) => setTimeout(r, 500));
    return { status: 'ok', breakdown: calculate(input, demoRateConfigs[input.serviceId]), demo: true };
  }

  return { status: 'unavailable' };
}
