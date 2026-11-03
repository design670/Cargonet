/**
 * Tarifa courier Miami → Colombia (confirmada por la agencia, nov. 2026).
 * Los valores en `null` siguen pendientes (ver PENDIENTES.md): mientras no
 * existan, el estimado los muestra como "Por confirmar" y no los suma.
 */
export const courier = {
  route: 'Miami → Colombia',
  /** Tarifa por libra: US$2.20 de 1 a 8 lb, US$1.80 desde 9 lb. */
  ratePerLb: 2.2,
  ratePerLbFrom9: 1.8,
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
  const rate = billableLb >= 9 ? courier.ratePerLbFrom9 : courier.ratePerLb;
  const freight = round2(billableLb * rate);

  const extra = Math.max(0, i.pieces - 1);
  const extraPieces: Charge =
    extra === 0
      ? { amount: 0, applies: false }
      : { amount: courier.extraPieceUsd === null ? null : round2(extra * courier.extraPieceUsd), applies: true };

  const taxFree = i.origin === 'usa' && i.valueUsd <= courier.dutyFreeUsd;
  const duty: Charge = taxFree ? { amount: 0, applies: false } : { amount: null, applies: true };
  const vat: Charge = taxFree ? { amount: 0, applies: false } : { amount: null, applies: true };

  const charges = [extraPieces, duty, vat];
  const total = round2(freight + charges.reduce((s, c) => s + (c.amount ?? 0), 0));
  const sides = i.dims ? i.dims[0] + i.dims[1] + i.dims[2] : 0;

  return {
    billableLb,
    rate,
    freight,
    extraPieces,
    duty,
    vat,
    total,
    hasPending: charges.some((c) => c.amount === null),
    overLimits: i.weightLb > courier.maxWeightLb || i.valueUsd > courier.maxValueUsd || sides > courier.maxSidesIn,
  };
}

const round2 = (n: number) => Math.round(n * 100) / 100;
