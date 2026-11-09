/**
 * Tarifa courier Miami → Colombia (confirmada por la agencia, nov. 2026).
 * Los valores en `null` siguen pendientes (ver PENDIENTES.md): mientras no
 * existan, el estimado los muestra como "Por confirmar" y no los suma.
 */
export const courier = {
  route: 'Miami → Colombia',
  /** Tarifa por libra (informada por la agencia, nov. 2026): USD 1,90 + seguro. */
  ratePerLb: 1.9,
  /** Costo del seguro: pendiente. Mientras sea null se muestra "Por confirmar". */
  insuranceUsd: null as number | null,
  /** IVA para mercancías con valor declarado superior a dutyFreeUsd. */
  vatRate: 0.19,
  /** Límites del servicio courier. */
  maxWeightLb: 110,
  maxValueUsd: 2000,
  /** Suma de largo + ancho + alto: 3 m. */
  maxSidesIn: 300 / 2.54,
  /** Productos de EE.UU. hasta este valor no pagan arancel ni IVA. */
  dutyFreeUsd: 200,
  /** Cobro por cada pieza adicional (USD). */
  extraPieceUsd: null as number | null,
  /** Divisor del peso volumétrico (pulg³ por lb). */
  volumetricDivisor: null as number | null,
};

export type Origin = 'usa' | 'other';

export type CourierInput = {
  weightLb: number;
  valueUsd: number;
  origin: Origin;
  pieces: number;
  /** Largo, ancho y alto en pulgadas, si se agregaron. */
  dims?: [number, number, number];
};

/** `null` = cargo que aplica pero aún no tiene valor publicado. */
export type Charge = { amount: number | null; applies: boolean };

export type CourierEstimate = {
  billableLb: number;
  rate: number;
  freight: number;
  extraPieces: Charge;
  insurance: Charge;
  duty: Charge;
  vat: Charge;
  total: number;
  hasPending: boolean;
  overLimits: boolean;
};

export function estimateCourier(i: CourierInput): CourierEstimate {
  const volumetric =
    i.dims && courier.volumetricDivisor ? (i.dims[0] * i.dims[1] * i.dims[2]) / courier.volumetricDivisor : 0;
  const billableLb = Math.max(i.weightLb, volumetric);
  const rate = courier.ratePerLb;
  const freight = round2(billableLb * rate);

  const extra = Math.max(0, i.pieces - 1);
  const extraPieces: Charge =
    extra === 0
      ? { amount: 0, applies: false }
      : { amount: courier.extraPieceUsd === null ? null : round2(extra * courier.extraPieceUsd), applies: true };

  // Seguro: siempre aplica ("tarifa + seguro"); su valor está pendiente.
  const insurance: Charge = { amount: courier.insuranceUsd, applies: true };

  // Arancel: productos de EE.UU. hasta USD 200 no pagan; el resto, por confirmar.
  const taxFree = i.origin === 'usa' && i.valueUsd <= courier.dutyFreeUsd;
  const duty: Charge = taxFree ? { amount: 0, applies: false } : { amount: null, applies: true };
  // IVA del 19% sobre el valor declarado cuando supera USD 200.
  const vat: Charge =
    i.valueUsd > courier.dutyFreeUsd ? { amount: round2(i.valueUsd * courier.vatRate), applies: true } : { amount: 0, applies: false };

  const charges = [extraPieces, insurance, duty, vat];
  const total = round2(freight + charges.reduce((s, c) => s + (c.amount ?? 0), 0));
  const sides = i.dims ? i.dims[0] + i.dims[1] + i.dims[2] : 0;

  return {
    billableLb,
    rate,
    freight,
    extraPieces,
    insurance,
    duty,
    vat,
    total,
    hasPending: charges.some((c) => c.amount === null),
    overLimits: i.weightLb > courier.maxWeightLb || i.valueUsd > courier.maxValueUsd || sides > courier.maxSidesIn,
  };
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/* ---------- Prevalidación Courier: una revisión por condición ---------- */

export type CheckId = 'value' | 'weight' | 'sides';

/** `ok: null` = falta el dato para evaluar esa condición. */
export type CourierCheck = { id: CheckId; label: string; shown: string; limit: string; ok: boolean | null; reason?: string };

export type CourierVerdict = 'pass' | 'fail' | 'pending';

const n2 = (n: number) => n.toLocaleString('es-CO', { maximumFractionDigits: 1 });

export function courierChecks(i: {
  weightLb: number;
  valueUsd: number;
  dims: [number, number, number] | null;
}): { checks: CourierCheck[]; verdict: CourierVerdict } {
  const maxValue = `US$${courier.maxValueUsd.toLocaleString('es-CO')}`;
  const sides = i.dims ? i.dims[0] + i.dims[1] + i.dims[2] : NaN;

  const checks: CourierCheck[] = [
    {
      id: 'value',
      label: 'Valor declarado',
      shown: i.valueUsd > 0 ? `US$${n2(i.valueUsd)}` : '—',
      limit: `máx. ${maxValue}`,
      ok: i.valueUsd > 0 ? i.valueUsd <= courier.maxValueUsd : null,
      reason: `El valor declarado (US$${n2(i.valueUsd)}) supera el máximo de ${maxValue}.`,
    },
    {
      id: 'weight',
      label: 'Peso real',
      shown: i.weightLb > 0 ? `${n2(i.weightLb)} lb` : '—',
      limit: `máx. ${courier.maxWeightLb} lb`,
      ok: i.weightLb > 0 ? i.weightLb <= courier.maxWeightLb : null,
      reason: `El peso real (${n2(i.weightLb)} lb) supera el máximo de ${courier.maxWeightLb} lb.`,
    },
    {
      id: 'sides',
      label: 'Suma de los 3 lados',
      shown: sides > 0 ? `${n2(sides)} pulg (${n2(sides * 2.54)} cm)` : '—',
      limit: `máx. 3 m (${Math.round(courier.maxSidesIn)} pulg)`,
      ok: sides > 0 ? sides <= courier.maxSidesIn : null,
      reason: `La suma de los 3 lados (${n2(sides * 2.54)} cm) supera el máximo de 3 m.`,
    },
  ];

  const verdict: CourierVerdict = checks.some((c) => c.ok === false)
    ? 'fail'
    : checks.every((c) => c.ok === true)
      ? 'pass'
      : 'pending';
  return { checks, verdict };
}
