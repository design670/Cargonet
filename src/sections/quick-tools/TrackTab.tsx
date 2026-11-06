import { useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Icon } from '../../components/Icon';
import { links, whatsappLink } from '../../content/site';
import { trackShipment, type TrackingResult } from '../../lib/tracking';
import { steps } from '../StepsCarousel';

const EXAMPLE_GUIDE = 'CNU-240817';

/** Estados que verá el cliente, en orden: los mismos de la línea de tiempo "De tu compra a la entrega". */
const exampleSteps = steps.map((s) => s.title);
const exampleCurrent = exampleSteps.indexOf('Despacho internacional');

type State =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'example' }
  | { kind: 'done'; result: TrackingResult; guide: string };

/** Pestaña "Rastrear": consulta por guía + guía de ejemplo para mostrar los estados. */
export function TrackTab() {
  const [guide, setGuide] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [state, setState] = useState<State>({ kind: 'idle' });
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (state.kind === 'loading') return;
    const g = guide.trim();
    if (!g) {
      setError('Escribe tu número de guía o el tracking de la tienda.');
      inputRef.current?.focus();
      return;
    }
    setError(undefined);
    if (g.toUpperCase() === EXAMPLE_GUIDE) return setState({ kind: 'example' });
    setState({ kind: 'loading' });
    setState({ kind: 'done', result: await trackShipment(g), guide: g });
  };

  return (
    <div className="qt-track">
      <form className="qt-track__form" onSubmit={submit} noValidate>
        <label className="field__label" htmlFor="qt-guide">
          Número de guía o tracking
        </label>
        <div className="qt-track__row">
          <input
            ref={inputRef}
            id="qt-guide"
            name="qt-guide"
            className="field__control qt-mono"
            placeholder={`Guía ${EXAMPLE_GUIDE} o tracking de la tienda`}
            autoComplete="off"
            value={guide}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'qt-guide-error' : undefined}
            onChange={(e) => {
              setGuide(e.target.value);
              if (error) setError(undefined);
            }}
          />
          <button type="submit" className="btn qt-btn-navy" disabled={state.kind === 'loading'} aria-busy={state.kind === 'loading' || undefined}>
            {state.kind === 'loading' ? <Icon name="spinner" size={18} className="btn__spinner" /> : null}
            {state.kind === 'loading' ? 'Buscando…' : 'Rastrear'}
          </button>
        </div>
        {error ? (
          <p className="field__error" id="qt-guide-error">
            {error}
          </p>
        ) : null}
      </form>

      <p className="qt-note">
        ¿Quieres ver cómo se muestran los estados? Prueba la guía de ejemplo{' '}
        <button
          type="button"
          className="qt-link qt-mono"
          onClick={() => {
            setGuide(EXAMPLE_GUIDE);
            setError(undefined);
            setState({ kind: 'example' });
          }}
        >
          {EXAMPLE_GUIDE}
        </button>
      </p>

      <div aria-live="polite">
        {state.kind === 'example' ? <ExampleResult /> : null}
        {state.kind === 'done' ? <Result result={state.result} guide={state.guide} onRetry={() => submit()} /> : null}
      </div>
    </div>
  );
}

function ExampleResult() {
  return (
    <div className="qt-result">
      <div className="qt-result__head">
        <p className="qt-mono">{EXAMPLE_GUIDE}</p>
        <span className="qt-badge">Guía de ejemplo</span>
      </div>
      <ol className="qt-steps">
        {exampleSteps.map((s, i) => (
          <li key={s} className={i < exampleCurrent ? 'is-done' : i === exampleCurrent ? 'is-current' : undefined}>
            {s}
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Mensaje de ayuda: título, explicación y qué hacer. */
function Help({ icon, title, children }: { icon: 'alert' | 'clock' | 'package' | 'info'; title: string; children: ReactNode }) {
  return (
    <div className="qt-msg qt-msg--help">
      <Icon name={icon} size={18} />
      <div>
        <p className="qt-msg__title">{title}</p>
        <p>{children}</p>
      </div>
    </div>
  );
}

const advisor = (text: string) => (
  <a className="qt-link" href={whatsappLink(text)} target="_blank" rel="noopener noreferrer">
    Escríbenos por WhatsApp<span className="sr-only"> (abre WhatsApp)</span>
  </a>
);

function Result({ result, guide, onRetry }: { result: TrackingResult; guide: string; onRetry: () => void }) {
  if (result.status === 'not-found') {
    return (
      <Help icon="alert" title="Número no encontrado">
        No encontramos <strong>{guide}</strong>. Revisa que sea tu guía CargoNet o el tracking que te dio la tienda. Si
        compraste hace poco, <a className="qt-link" href={links.prealert} target="_blank" rel="noopener noreferrer">prealerta tu compra</a> para
        que podamos identificarla.
      </Help>
    );
  }
  if (result.status === 'not-received') {
    return (
      <Help icon="clock" title="Tracking aún no recibido en Miami">
        La tienda o su transportadora todavía no han entregado <strong>{guide}</strong> en nuestra bodega. Revisa el tracking
        con la tienda; si dice entregado y no aparece aquí, {advisor(`Hola, mi tracking ${guide} figura entregado pero no aparece recibido.`)}.
      </Help>
    );
  }
  if (result.status === 'pending-scan') {
    return (
      <Help icon="package" title="Paquete pendiente de pistoleo">
        <strong>{guide}</strong> llegó a la bodega de Miami y está pendiente de escaneo y registro en tu casillero. Cuando
        quede registrado verás sus estados aquí.
      </Help>
    );
  }
  if (result.status === 'issue') {
    return (
      <Help icon="alert" title="Novedad o documentación requerida">
        {result.detail ? `${result.detail} ` : ''}Tu paquete <strong>{guide}</strong> necesita una revisión antes de
        continuar. Revisa las novedades en tu cuenta o {advisor(`Hola, mi envío ${guide} tiene una novedad.`)}.
      </Help>
    );
  }
  if (result.status === 'error') {
    return (
      <p className="qt-msg">
        <Icon name="alert" size={18} />
        <span>
          No pudimos conectarnos con el servicio de rastreo.{' '}
          <button type="button" className="qt-link" onClick={onRetry}>
            Reintentar
          </button>
        </span>
      </p>
    );
  }
  if (result.status === 'not-configured') {
    return (
      <p className="qt-msg">
        <Icon name="info" size={18} />
        <span>
          Consulta la guía <strong>{guide}</strong> en el portal de CargoNet USA.{' '}
          <a className="qt-link" href={links.tracking} target="_blank" rel="noopener noreferrer">
            Abrir rastreo ↗<span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        </span>
      </p>
    );
  }

  const i = result.info;
  return (
    <div className="qt-result">
      <div className="qt-result__head">
        <p className="qt-mono">{i.guide}</p>
        <span className="qt-badge">{result.demo ? 'Demostración' : i.status}</span>
      </div>
      {i.events.length ? (
        <ol className="qt-steps qt-steps--events">
          {i.events.map((ev, idx) => (
            <li key={idx} className={idx === 0 ? 'is-current' : 'is-done'}>
              {ev.description}
              <small>
                {ev.date}
                {ev.location ? ` · ${ev.location}` : ''}
              </small>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
