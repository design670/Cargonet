import { useRef, useState, type FormEvent } from 'react';
import { Icon } from '../../components/Icon';
import { TextField } from '../../components/Field';
import { links } from '../../content/site';
import { trackShipment, type TrackingResult } from '../../lib/tracking';

type State = { kind: 'idle' } | { kind: 'loading' } | ({ kind: 'done' } & { result: TrackingResult; guide: string });

/** Pestaña "Rastrear": formulario de guía + resultado según la integración disponible. */
export function TrackPanel() {
  const [guide, setGuide] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [state, setState] = useState<State>({ kind: 'idle' });
  const formRef = useRef<HTMLFormElement>(null);

  const submit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (state.kind === 'loading') return;
    const g = guide.trim();
    if (!g) {
      setError('Escribe tu número de guía.');
      formRef.current?.querySelector<HTMLInputElement>('[name="guide"]')?.focus();
      return;
    }
    setError(undefined);
    setState({ kind: 'loading' });
    const result = await trackShipment(g);
    setState({ kind: 'done', result, guide: g });
  };

  return (
    <div className="tq-pane">
      <div className="tq-pane__head">
        <h3 className="tq-pane__title">Rastrea tu paquete</h3>
        <p className="tq-pane__text">Ingresa tu número de guía para consultar el estado de tu envío.</p>
      </div>

      <form ref={formRef} className="tq-track" onSubmit={submit} noValidate>
        <TextField
          name="guide"
          label="Número de guía"
          placeholder="Escribe tu número de guía"
          autoComplete="off"
          value={guide}
          onChange={(e) => {
            setGuide(e.target.value);
            if (error) setError(undefined);
          }}
          error={error}
          className="tq-track__field"
        />
        <button type="submit" className="btn btn--primary tq-track__btn" disabled={state.kind === 'loading'} aria-busy={state.kind === 'loading' || undefined}>
          {state.kind === 'loading' ? <Icon name="spinner" size={18} className="btn__spinner" /> : <Icon name="search" size={18} />}
          <span>{state.kind === 'loading' ? 'Buscando…' : 'Rastrear envío'}</span>
        </button>
      </form>

      <div aria-live="polite">{state.kind === 'done' ? <TrackResult state={state} onRetry={() => submit()} /> : null}</div>
    </div>
  );
}

function TrackResult({ state, onRetry }: { state: { result: TrackingResult; guide: string }; onRetry: () => void }) {
  const r = state.result;

  if (r.status === 'not-found') {
    return (
      <div className="tq-msg tq-msg--warn">
        <Icon name="alert" size={20} />
        <p>
          No encontramos la guía <strong>{state.guide}</strong>. Revisa el número e inténtalo de nuevo.
        </p>
      </div>
    );
  }

  if (r.status === 'error') {
    return (
      <div className="tq-msg tq-msg--error">
        <Icon name="alert" size={20} />
        <p>No pudimos conectarnos con el servicio de rastreo.</p>
        <button type="button" className="link-btn" onClick={onRetry}>
          Reintentar
        </button>
      </div>
    );
  }

  if (r.status === 'not-configured') {
    return (
      <div className="tq-msg tq-msg--info">
        <Icon name="info" size={20} />
        <div>
          <p>
            El rastreo desde esta página todavía no está conectado. Consulta la guía <strong>{state.guide}</strong> en el
            portal de CargoNet USA.
          </p>
          <a className="tq-msg__link" href={links.tracking} target="_blank" rel="noopener noreferrer">
            Abrir rastreo en el portal
            <Icon name="arrowUpRight" size={16} />
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        </div>
      </div>
    );
  }

  const i = r.info;
  return (
    <div className="tq-track-result">
      {r.demo ? <p className="tq-demo">Modo demostración · datos ficticios</p> : null}
      <div className="tq-track-result__head">
        <div>
          <p className="tq-label">Guía</p>
          <p className="tq-track-result__guide">{i.guide}</p>
        </div>
        <p className="tq-status">
          <span className="tq-status__dot" aria-hidden="true" />
          {i.status}
        </p>
      </div>
      <dl className="tq-facts">
        {i.origin || i.destination ? (
          <div>
            <dt>Ruta</dt>
            <dd>
              {i.origin ?? '—'} → {i.destination ?? '—'}
            </dd>
          </div>
        ) : null}
        {i.estimatedDelivery ? (
          <div>
            <dt>Entrega estimada</dt>
            <dd>{i.estimatedDelivery}</dd>
          </div>
        ) : null}
        {i.updatedAt ? (
          <div>
            <dt>Última actualización</dt>
            <dd>{i.updatedAt}</dd>
          </div>
        ) : null}
      </dl>
      {i.events.length ? (
        <ol className="tq-timeline">
          {i.events.map((ev, idx) => (
            <li key={idx} className={idx === 0 ? 'is-current' : undefined}>
              <p className="tq-timeline__desc">{ev.description}</p>
              <p className="tq-timeline__meta">
                {ev.date}
                {ev.location ? ` · ${ev.location}` : ''}
              </p>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
