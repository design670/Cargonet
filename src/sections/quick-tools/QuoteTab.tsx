import { useState } from 'react';
import { Icon } from '../../components/Icon';
import { SelectField, TextField } from '../../components/Field';
import { links, whatsappLink } from '../../content/site';
import { courier, estimateCourier, type Charge, type Origin } from '../../lib/courier-rates';
import { parseNum } from '../../lib/quote-engine';

const usd = (n: number) =>
  '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const num = (n: number) => n.toLocaleString('es-CO', { maximumFractionDigits: 2 });

/** Pestaña "Cotizar": estimado courier Miami → Colombia que se actualiza mientras se escribe. */
export function QuoteTab() {
  const [weight, setWeight] = useState('');
  const [value, setValue] = useState('');
  const [origin, setOrigin] = useState<Origin>('usa');
  const [pieces, setPieces] = useState('1');
  const [showDims, setShowDims] = useState(false);
  const [dims, setDims] = useState(['', '', '']);

  const w = parseNum(weight);
  const v = parseNum(value);
  const p = /^\d+$/.test(pieces.trim()) && Number(pieces) >= 1 ? Number(pieces) : NaN;
  const d = dims.map(parseNum);
  const dimsOk = showDims && d.every((n) => n > 0);

  const errors = {
    weight: weight.trim() && !(w > 0) ? 'Usa un número mayor que 0.' : undefined,
    value: value.trim() && !(v > 0) ? 'Usa un número mayor que 0.' : undefined,
    pieces: pieces.trim() && Number.isNaN(p) ? 'Usa un número entero desde 1.' : undefined,
  };
  const ready = w > 0 && v > 0 && p >= 1;
  const est = ready
    ? estimateCourier({ weightLb: w, valueUsd: v, origin, pieces: p, dims: dimsOk ? (d as [number, number, number]) : undefined })
    : null;

  const advisorHref = whatsappLink(
    [
      'Hola, quiero cotizar un envío que supera los límites de courier:',
      `Peso: ${weight} lb`,
      `Valor: USD ${value}`,
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
            label="Peso del paquete"
            name="qt-weight"
            inputMode="decimal"
            placeholder="0"
            unit="lb"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            error={errors.weight}
          />
          <TextField
            label="Valor de la compra"
            name="qt-value"
            inputMode="decimal"
            placeholder="0"
            unit="USD"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            error={errors.value}
          />
          <SelectField label="Origen del producto" name="qt-origin" value={origin} onChange={(e) => setOrigin(e.target.value as Origin)}>
            <option value="usa">Producto de EE.UU.</option>
            <option value="other">Producto de otro país</option>
          </SelectField>
          <TextField
            label="Piezas"
            name="qt-pieces"
            inputMode="numeric"
            value={pieces}
            onChange={(e) => setPieces(e.target.value)}
            error={errors.pieces}
          />
        </div>

        <button
          type="button"
          className="qt-dims-toggle"
          aria-expanded={showDims}
          aria-controls="qt-dims"
          onClick={() => setShowDims((s) => !s)}
        >
          <Icon name={showDims ? 'close' : 'plus'} size={16} />
          {showDims ? 'Quitar medidas' : 'Agregar medidas (peso volumétrico)'}
        </button>

        {showDims ? (
          <div id="qt-dims" className="qt-grid qt-grid--3">
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
        ) : null}
      </div>

      <div className="qt-quote__side">
        <div className="qt-estimate" aria-live="polite">
          <p className="qt-estimate__tag">Courier · {courier.route}</p>

          {!est ? (
            <p className="qt-estimate__empty">Escribe el peso, el valor y las piezas para ver tu estimado.</p>
          ) : est.overLimits ? (
            <div className="qt-estimate__over">
              <p>
                Este envío supera los límites de courier. Te ayudamos a enviarlo como carga.
              </p>
              <a href={advisorHref} target="_blank" rel="noopener noreferrer">
                Cotizar con un asesor
                <Icon name="arrowUpRight" size={16} />
                <span className="sr-only"> (abre WhatsApp)</span>
              </a>
            </div>
          ) : (
            <>
              <dl className="qt-estimate__rows">
                <div>
                  <dt>
                    Flete ({num(est.billableLb)} lb × {usd(est.rate)})
                  </dt>
                  <dd>{usd(est.freight)}</dd>
                </div>
                <Row label="Piezas adicionales" charge={est.extraPieces} />
                <Row label="Arancel" charge={est.duty} />
                <Row label="IVA" charge={est.vat} />
              </dl>
              <div className="qt-estimate__total">
                <span>Total estimado{est.hasPending ? ' + cargos por confirmar' : ''}</span>
                <strong>{usd(est.total)}</strong>
              </div>
            </>
          )}

          <p className="qt-estimate__fine">
            Valor estimado, no definitivo: puede variar por peso real o volumétrico, validación aduanera, impuestos, seguro,
            manejo u otros cargos. Courier: máx. {courier.maxWeightLb} lb de peso real, US$
            {courier.maxValueUsd.toLocaleString('es-CO')} y la suma de los 3 lados hasta 3 m.
          </p>
        </div>

        <a className="btn btn--primary qt-cta" href={links.register} target="_blank" rel="noopener noreferrer">
          Empezar mi envío
          <Icon name="arrowRight" size={18} />
          <span className="sr-only"> (se abre en una pestaña nueva)</span>
        </a>
      </div>
    </div>
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
