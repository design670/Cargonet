import { useState } from 'react';
import { Icon } from '../../components/Icon';
import { ListboxField, TextField } from '../../components/Field';
import { WhatsAppGlyph } from '../../components/WhatsAppFab';
import { commercialWhatsappLink, contact, links } from '../../content/site';
import { courier, courierChecks, estimateCourier, type Charge, type CourierCheck, type Origin } from '../../lib/courier-rates';
import { parseNum } from '../../lib/quote-engine';

const usd = (n: number) =>
  '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const num = (n: number) => n.toLocaleString('es-CO', { maximumFractionDigits: 2 });

/**
 * Pestaña "Cotizar": estimado courier Miami → Colombia y prevalidación Courier
 * (valor, peso real y suma de los 3 lados) que se actualizan mientras se escribe.
 */
export function QuoteTab() {
  const [weight, setWeight] = useState('');
  const [value, setValue] = useState('');
  const [origin, setOrigin] = useState<Origin>('usa');
  const [pieces, setPieces] = useState('1');
  const [dims, setDims] = useState(['', '', '']);

  const w = parseNum(weight);
  const v = parseNum(value);
  const p = /^\d+$/.test(pieces.trim()) && Number(pieces) >= 1 ? Number(pieces) : NaN;
  const d = dims.map(parseNum);
  const dimsOk = d.every((n) => n > 0);

  const errors = {
    weight: weight.trim() && !(w > 0) ? 'Usa un número mayor que 0.' : undefined,
    value: value.trim() && !(v > 0) ? 'Usa un número mayor que 0.' : undefined,
    pieces: pieces.trim() && Number.isNaN(p) ? 'Usa un número entero desde 1.' : undefined,
  };

  const { checks, verdict } = courierChecks({
    weightLb: w > 0 ? w : 0,
    valueUsd: v > 0 ? v : 0,
    dims: dimsOk ? (d as [number, number, number]) : null,
  });
  const failed = checks.filter((c) => c.ok === false);

  const ready = w > 0 && v > 0 && p >= 1;
  const est = ready
    ? estimateCourier({ weightLb: w, valueUsd: v, origin, pieces: p, dims: dimsOk ? (d as [number, number, number]) : undefined })
    : null;

  const advisorHref = commercialWhatsappLink(
    [
      'Hola, quiero cotizar un envío que no cumple los límites de Courier:',
      ...failed.map((c) => `- ${c.reason}`),
      `Peso: ${weight || '—'} lb`,
      `Valor: USD ${value || '—'}`,
      `Piezas: ${pieces}`,
      dimsOk ? `Medidas: ${dims.join(' × ')} pulg` : '',
    ]
      .filter(Boolean)
      .join('\n'),
  );

  return (
    <div className="qt-quote">
      <div className="qt-quote__form">
        <div className="qt-grid">
          <TextField
            label="Peso real del paquete"
            name="qt-weight"
            inputMode="decimal"
            placeholder="0"
            unit="lb"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            error={errors.weight}
          />
          <TextField
            label="Valor declarado"
            name="qt-value"
            inputMode="decimal"
            placeholder="0"
            unit="USD"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            error={errors.value}
          />
          <ListboxField<Origin>
            label="Origen del producto"
            value={origin}
            onChange={setOrigin}
            options={[
              { value: 'usa', label: 'Producto de EE.UU.' },
              { value: 'other', label: 'Producto de otro país' },
            ]}
          />
          <TextField
            label="Piezas"
            name="qt-pieces"
            inputMode="numeric"
            value={pieces}
            onChange={(e) => setPieces(e.target.value)}
            error={errors.pieces}
          />
        </div>

        {/* Medidas siempre visibles: definen la suma de los 3 lados */}
        <fieldset className="qt-dims">
          <legend className="field__label">Medidas del paquete</legend>
          <div className="qt-grid qt-grid--3">
            {(['Largo', 'Ancho', 'Alto'] as const).map((label, i) => (
              <TextField
                key={label}
                label={label}
                name={`qt-dim-${i}`}
                inputMode="decimal"
                placeholder="0"
                unit="pulg"
                value={dims[i]}
                onChange={(e) => setDims((list) => list.map((x, idx) => (idx === i ? e.target.value : x)))}
              />
            ))}
          </div>
        </fieldset>

        {/* Límites Courier a la vista, con el estado de cada uno */}
        <div className="qt-limits" aria-live="polite">
          <p className="qt-limits__title">Límites Courier</p>
          <ul>
            {checks.map((c) => (
              <LimitRow key={c.id} c={c} />
            ))}
          </ul>
        </div>
      </div>

      <div className="qt-quote__side">
        <div className={`qt-estimate qt-estimate--${verdict}`} aria-live="polite">
          <p className="qt-estimate__tag">Courier · {courier.route}</p>

          {verdict === 'fail' ? (
            <div className="qt-estimate__over">
              <p className="qt-status qt-status--fail">
                <Icon name="alert" size={18} />
                No cumple Courier
              </p>
              <p className="qt-estimate__msg">Este envío supera los límites de Courier. Te ayudamos a enviarlo como carga.</p>
              <ul className="qt-estimate__reasons">
                {failed.map((c) => (
                  <li key={c.id}>{c.reason}</li>
                ))}
              </ul>
              {/* Llamado principal: WhatsApp comercial, en verde para destacar sobre la tarjeta roja */}
              <a className="btn qt-btn-wa" href={advisorHref} target="_blank" rel="noopener noreferrer">
                <WhatsAppGlyph size={22} />
                Cotiza tu envío
                <span className="sr-only"> por WhatsApp con el área comercial (abre WhatsApp)</span>
              </a>
            </div>
          ) : !est ? (
            <p className="qt-estimate__empty">Escribe el peso, el valor y las medidas para ver tu estimado y validar Courier.</p>
          ) : (
            <>
              {verdict === 'pass' ? (
                <p className="qt-status qt-status--pass">
                  <Icon name="check" size={18} />
                  Apto preliminar para Courier
                </p>
              ) : (
                <p className="qt-status qt-status--pending">
                  <Icon name="info" size={18} />
                  Agrega las medidas para validar Courier
                </p>
              )}
              <dl className="qt-estimate__rows">
                <div>
                  <dt>
                    Flete ({num(est.billableLb)} lb × {usd(est.rate)})
                  </dt>
                  <dd>{usd(est.freight)}</dd>
                </div>
                <Row label="Piezas adicionales" charge={est.extraPieces} />
                <Row label="Seguro" charge={est.insurance} />
                <Row label="Arancel" charge={est.duty} />
                <Row label="IVA (19%)" charge={est.vat} />
              </dl>
              <div className="qt-estimate__total">
                <span>Total estimado{est.hasPending ? ' + cargos por confirmar' : ''}</span>
                <strong>{usd(est.total)}</strong>
              </div>
            </>
          )}

          <p className="qt-estimate__fine">
            Resultado orientativo (prevalidación): la aceptación definitiva depende de la revisión documental, de la mercancía
            y de las condiciones aduaneras. El valor puede variar por peso real o volumétrico, impuestos, seguro, manejo u
            otros cargos.
          </p>
        </div>

        {verdict !== 'fail' ? (
          <a className="btn btn--primary qt-cta" href={links.register} target="_blank" rel="noopener noreferrer">
            Empezar mi envío
            <Icon name="arrowRight" size={18} />
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        ) : null}
      </div>

      {/* Contactos visibles e identificados por área: tarjetas que abren WhatsApp */}
      <ul className="qt-contacts" aria-label="Contactos de CargoNet USA">
        {[
          { ...contact.commercial, href: commercialWhatsappLink("Hola Jonathan, quiero cotizar un envío.") },
          {
            ...contact.dispatch,
            href: `https://wa.me/${contact.dispatch.whatsapp}?text=${encodeURIComponent("Hola Mildreth, tengo una consulta sobre el despacho de mi envío.")}`,
          },
        ].map((c) => (
          <li key={c.area}>
            <a className="qt-contact" href={c.href} target="_blank" rel="noopener noreferrer">
              <span className="qt-contact__icon" aria-hidden="true">
                <WhatsAppGlyph size={26} />
              </span>
              <span className="qt-contact__text">
                <span className="qt-contact__area">{c.area}</span>
                <span className="qt-contact__num">{c.label}</span>
              </span>
              <span className="sr-only"> (abre WhatsApp)</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Una condición Courier: ícono + texto (no depende solo del color). */
function LimitRow({ c }: { c: CourierCheck }) {
  const state = c.ok === null ? 'pending' : c.ok ? 'ok' : 'fail';
  return (
    <li className={`qt-limit qt-limit--${state}`}>
      <span className="qt-limit__icon" aria-hidden="true">
        <Icon name={state === 'ok' ? 'check' : state === 'fail' ? 'close' : 'clock'} size={14} />
      </span>
      <span className="qt-limit__label">{c.label}</span>
      <span className="qt-limit__value">
        {c.shown} <small>({c.limit})</small>
      </span>
      <span className="sr-only">{state === 'ok' ? ': cumple' : state === 'fail' ? ': no cumple' : ': falta el dato'}</span>
    </li>
  );
}

function Row({ label, charge }: { label: string; charge: Charge }) {
  const isTax = label !== 'Piezas adicionales';
  return (
    <div>
      <dt>
        {label}
        {isTax && !charge.applies ? ' (no aplica)' : ''}
      </dt>
      <dd>{charge.amount === null ? 'Por confirmar' : usd(charge.amount)}</dd>
    </div>
  );
}
