import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Icon } from '../../components/Icon';
import { whatsappLink } from '../../content/site';
import {
  convertDim,
  convertWeight,
  formatInput,
  getQuote,
  parseNum,
  serviceById,
  services,
  type DimUnit,
  type PackageInput,
  type QuoteInput,
  type QuoteResult,
  type ServiceId,
  type WeightUnit,
} from '../../lib/quote-engine';
import { PackageGroup } from './PackageGroup';
import { RouteField } from './RouteField';
import { ServiceSelect, type ServiceOption } from './ServiceSelect';

const serviceMeta: Record<ServiceId, Pick<ServiceOption, 'desc' | 'icon'>> = {
  'imp-courier': { desc: 'Paquetes y compras hacia Colombia', icon: 'package' },
  'imp-carga': { desc: 'Mercancía que requiere gestión de carga', icon: 'globe' },
  'exp-courier': { desc: 'Paquetes y documentos desde Colombia', icon: 'plane' },
  'exp-carga': { desc: 'Mercancía comercial hacia otros países', icon: 'route' },
};
const serviceOptions: ServiceOption[] = services.map((s) => ({ id: s.id, label: s.label, ...serviceMeta[s.id] }));

const usd = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

const emptyPkg = (): PackageInput => ({ qty: '1', weight: '', length: '', width: '', height: '', value: '' });

type Errors = Record<string, string>;

function validate(serviceId: string, origin: string, destination: string, pkgs: PackageInput[]): Errors {
  const e: Errors = {};
  const svc = serviceById(serviceId);
  if (!svc) {
    e.service = 'Selecciona un servicio.';
    return e;
  }
  if (svc.origin === null && !origin.trim()) e.origin = 'Indica el país o la ciudad de origen.';
  if (svc.destination === null && !destination.trim()) e.destination = 'Indica el país o la ciudad de destino.';

  pkgs.forEach((p, i) => {
    const k = (f: string) => `pkg-${i}-${f}`;
    if (!/^\d+$/.test(p.qty.trim()) || Number(p.qty) < 1) e[k('qty')] = 'Usa un número entero mayor o igual a 1.';
    if (!p.weight.trim()) e[k('weight')] = 'Indica el peso por caja.';
    else if (!(parseNum(p.weight) > 0)) e[k('weight')] = 'El peso debe ser un número mayor que 0.';

    const dims = [p.length, p.width, p.height];
    const anyDim = dims.some((d) => d.trim());
    if (svc.dimensionsRequired || anyDim) {
      (['length', 'width', 'height'] as const).forEach((f) => {
        const v = p[f];
        if (!v.trim()) e[k(f)] = svc.dimensionsRequired ? 'Este servicio necesita largo, ancho y alto para calcular el peso volumétrico.' : 'Completa largo, ancho y alto.';
        else if (!(parseNum(v) > 0)) e[k(f)] = 'Las medidas deben ser números mayores que 0.';
      });
    }

    if (!p.value.trim()) e[k('value')] = 'Indica el valor de la mercancía.';
    else if (!(parseNum(p.value) > 0)) e[k('value')] = 'El valor debe ser un número mayor que 0.';
  });
  return e;
}

type Status = 'idle' | 'loading' | 'done';

export function QuotePanel() {
  const [serviceId, setServiceId] = useState<ServiceId | ''>('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('lb');
  const [dimUnit, setDimUnit] = useState<DimUnit>('in');
  const [pkgs, setPkgs] = useState<PackageInput[]>([emptyPkg()]);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<QuoteResult | null>(null);
  const [calcSig, setCalcSig] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  /** Valor exacto tras convertir, para que ir y volver de unidad no acumule redondeos. */
  const precise = useRef(new Map<string, number>());
  const exact = (key: string, shown: string) => {
    const stored = precise.current.get(key);
    return stored !== undefined && formatInput(stored) === shown ? stored : parseNum(shown);
  };

  const svc = serviceId ? serviceById(serviceId) : undefined;
  const sig = useMemo(
    () => JSON.stringify({ serviceId, origin, destination, weightUnit, dimUnit, pkgs }),
    [serviceId, origin, destination, weightUnit, dimUnit, pkgs],
  );
  const stale = status === 'done' && sig !== calcSig;

  const routeOrigin = svc?.origin ?? (origin.trim() || '—');
  const routeDest = svc?.destination ?? (destination.trim() || '—');
  const routeText = `${routeOrigin} → ${routeDest}`;

  const clearError = (key: string) => setErrors((er) => (er[key] ? { ...er, [key]: '' } : er));

  const setPkg = (i: number, f: keyof PackageInput, v: string) => {
    setPkgs((list) => list.map((p, idx) => (idx === i ? { ...p, [f]: v } : p)));
    clearError(`pkg-${i}-${f}`);
  };

  /* Cambiar de unidad convierte los valores escritos */
  const changeWeightUnit = (to: WeightUnit) => {
    if (to === weightUnit) return;
    setPkgs(
      pkgs.map((p, i) => {
        const n = exact(i + '-weight', p.weight);
        if (!(n > 0)) return p;
        const c = convertWeight(n, weightUnit, to);
        precise.current.set(i + '-weight', c);
        return { ...p, weight: formatInput(c) };
      }),
    );
    setWeightUnit(to);
  };
  const changeDimUnit = (to: DimUnit) => {
    if (to === dimUnit) return;
    setPkgs(
      pkgs.map((p, i) => {
        const conv = (f: 'length' | 'width' | 'height') => {
          const n = exact(i + '-' + f, p[f]);
          if (!(n > 0)) return p[f];
          const c = convertDim(n, dimUnit, to);
          precise.current.set(i + '-' + f, c);
          return formatInput(c);
        };
        return { ...p, length: conv('length'), width: conv('width'), height: conv('height') };
      }),
    );
    setDimUnit(to);
  };

  const focusFirst = (er: Errors) => {
    const order = ['service', 'origin', 'destination', ...pkgs.flatMap((_, i) => ['qty', 'weight', 'length', 'width', 'height', 'value'].map((f) => `pkg-${i}-${f}`))];
    const first = order.find((k) => er[k]);
    if (!first) return;
    const sel = first === 'service' ? '[name="tq-service"]' : first === 'origin' ? '[name="tq-origin"]' : first === 'destination' ? '[name="tq-destination"]' : `[data-field="${first}"]`;
    formRef.current?.querySelector<HTMLElement>(sel)?.focus();
  };

  const calculate = async (e?: FormEvent) => {
    e?.preventDefault();
    if (status === 'loading') return;
    const er = validate(serviceId, origin, destination, pkgs);
    const clean = Object.fromEntries(Object.entries(er).filter(([, v]) => v));
    setErrors(clean);
    if (Object.keys(clean).length) {
      setCollapsed(false);
      return focusFirst(clean);
    }

    setStatus('loading');
    const input: QuoteInput = { serviceId: serviceId as ServiceId, origin: routeOrigin, destination: routeDest, weightUnit, dimUnit, packages: pkgs };
    const res = await getQuote(input);
    setResult(res);
    setCalcSig(sig);
    setStatus('done');
  };

  /* En pantallas pequeñas, llevar la vista al resultado */
  useEffect(() => {
    if (status !== 'done' || !resultRef.current) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    resultRef.current.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
  }, [status, calcSig]);

  const whatsappText = () => {
    const lines = [
      'Hola, quiero continuar con mi envío. Estos son los datos de mi cotización:',
      `Servicio: ${svc?.label ?? ''}`,
      `Ruta: ${routeText}`,
      ...pkgs.map(
        (p, i) =>
          `Paquete ${i + 1}: ${p.qty} caja(s), ${p.weight} ${weightUnit} c/u` +
          (p.length ? `, ${p.length}×${p.width}×${p.height} ${dimUnit}` : '') +
          `, valor declarado USD ${p.value} c/u`,
      ),
    ];
    if (result?.status === 'ok') {
      lines.push(`Total estimado: USD ${result.breakdown.total.toFixed(2)}${result.demo ? ' (modo demostración)' : ''}`);
    }
    return whatsappLink(lines.join('\n'));
  };

  return (
    <div className="tq-pane tq-quote">
      <form ref={formRef} className="tq-quote__form" onSubmit={calculate} noValidate>
        <div className="tq-pane__head">
          <h3 className="tq-pane__title">Calcula tu envío</h3>
          <p className="tq-pane__text">
            Ingresa los datos de tus paquetes y consulta una tarifa aproximada y el tiempo estimado de entrega.
          </p>
        </div>

        <ServiceSelect
          name="tq-service"
          label="Tipo de servicio"
          options={serviceOptions}
          value={serviceId}
          onChange={(v) => {
            setServiceId(v);
            setCollapsed(false);
            clearError('service');
          }}
          error={errors.service}
        />

        {svc ? (
          <button
            type="button"
            className={collapsed ? 'tq-toggle is-collapsed' : 'tq-toggle'}
            aria-expanded={!collapsed}
            aria-controls="tq-quote-details"
            onClick={() => setCollapsed((c) => !c)}
          >
            <span>{collapsed ? 'Mostrar datos del envío' : 'Ocultar datos del envío'}</span>
            <span className="tq-toggle__icon" aria-hidden="true">
              <Icon name="chevronDown" size={18} />
            </span>
          </button>
        ) : null}

        {svc ? (
          <div id="tq-quote-details" className="tq-details" hidden={collapsed}>
            {/* Ruta: fija si el servicio la define; si no, se pide */}
            <div className="tq-route">
              {svc.origin ? (
                <p className="tq-route__fixed">
                  <span className="tq-label">Origen</span>
                  {svc.origin}
                </p>
              ) : (
                <RouteField name="tq-origin" label="Origen" value={origin} onChange={(v) => { setOrigin(v); clearError('origin'); }} error={errors.origin} />
              )}
              <span className="tq-route__arrow" aria-hidden="true">
                <Icon name="arrowRight" size={18} />
              </span>
              {svc.destination ? (
                <p className="tq-route__fixed">
                  <span className="tq-label">Destino</span>
                  {svc.destination}
                </p>
              ) : (
                <RouteField name="tq-destination" label="Destino" value={destination} onChange={(v) => { setDestination(v); clearError('destination'); }} error={errors.destination} />
              )}
            </div>

            <div className="tq-units">
              <UnitSwitch label="Peso" name="tq-wunit" options={[['lb', 'Libras'], ['kg', 'Kilogramos']]} value={weightUnit} onChange={(v) => changeWeightUnit(v as WeightUnit)} />
              <UnitSwitch label="Medidas" name="tq-dunit" options={[['in', 'Pulgadas'], ['cm', 'Centímetros']]} value={dimUnit} onChange={(v) => changeDimUnit(v as DimUnit)} />
            </div>

            <div className="tq-pkgs">
              {pkgs.map((p, i) => (
                <PackageGroup
                  key={i}
                  index={i}
                  value={p}
                  weightUnit={weightUnit}
                  dimUnit={dimUnit}
                  dimensionsRequired={svc.dimensionsRequired}
                  errors={{
                    qty: errors[`pkg-${i}-qty`],
                    weight: errors[`pkg-${i}-weight`],
                    length: errors[`pkg-${i}-length`],
                    width: errors[`pkg-${i}-width`],
                    height: errors[`pkg-${i}-height`],
                    value: errors[`pkg-${i}-value`],
                  }}
                  canRemove={pkgs.length > 1}
                  onChange={(f, v) => setPkg(i, f, v)}
                  onRemove={() => {
                    setPkgs((list) => list.filter((_, idx) => idx !== i));
                    precise.current.clear();
                    setErrors({});
                  }}
                />
              ))}
            </div>

            <div className="tq-add">
              <button type="button" className="tq-add__btn" onClick={() => setPkgs((list) => [...list, emptyPkg()])}>
                <Icon name="plus" size={18} />
                Agregar otro paquete
              </button>
              <p className="tq-fine">Si tienes cajas con pesos o medidas diferentes, agrégalas por separado.</p>
            </div>
          </div>
        ) : (
          <p className="tq-fine">Selecciona un servicio para ingresar la ruta y los datos de tus paquetes.</p>
        )}

        <div className="tq-calc">
          <button type="submit" className="btn btn--calc tq-calc__btn" disabled={status === 'loading'} aria-busy={status === 'loading' || undefined}>
            {status === 'loading' ? <Icon name="spinner" size={18} className="btn__spinner" /> : <Icon name="calculator" size={18} />}
            <span>{status === 'loading' ? 'Calculando…' : stale ? 'Actualizar cotización' : 'Calcular tarifas'}</span>
          </button>
          <div ref={resultRef} className="tq-price" aria-live="polite">
            {result && status === 'done' ? <QuotePrice result={result} stale={stale} continueHref={whatsappText()} /> : null}
          </div>
          <p className="tq-fine">Valor aproximado sujeto a verificación de peso, medidas y condiciones del envío.</p>
        </div>
      </form>

    </div>
  );
}

/** Resultado: solo el precio aproximado. Sin tarifa publicada, se remite a un asesor. */
function QuotePrice({ result, stale, continueHref }: { result: QuoteResult; stale: boolean; continueHref: string }) {
  if (result.status === 'ok') {
    const b = result.breakdown;
    const rows: [string, number][] = [
      ['Flete', b.freight],
      ['Impuesto', b.tax],
      ['Seguro', b.insurance],
    ];
    return (
      <div className={stale ? 'tq-price__ok is-stale' : 'tq-price__ok'}>
        <p className="tq-price__label">Valor de la tarifa aproximada</p>
        <dl className="tq-price__rows">
          {rows.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{usd(v)}</dd>
            </div>
          ))}
          <div className="tq-price__total">
            <dt>Total</dt>
            <dd>{usd(b.total)}</dd>
          </div>
        </dl>
        {result.demo ? <p className="tq-price__demo">Valores de demostración</p> : null}
      </div>
    );
  }
  if (result.status === 'error') {
    return <p className="tq-price__msg">No pudimos calcular el precio. Intenta de nuevo.</p>;
  }
  return (
    <p className="tq-price__msg">
      Precio por confirmar.{' '}
      <a href={continueHref} target="_blank" rel="noopener noreferrer">
        Consúltalo con un asesor
      </a>
    </p>
  );
}

function UnitSwitch({
  label,
  name,
  options,
  value,
  onChange,
}: {
  label: string;
  name: string;
  options: [string, string][];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset className="tq-unit">
      <legend className="tq-unit__label">{label}</legend>
      <div className="tq-unit__opts">
        {options.map(([v, text]) => (
          <label key={v} className={value === v ? 'tq-unit__opt is-active' : 'tq-unit__opt'}>
            <input type="radio" name={name} value={v} checked={value === v} onChange={() => onChange(v)} />
            <span aria-hidden="true">{v === 'in' ? 'pulg' : v}</span>
            <span className="sr-only">{text}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
