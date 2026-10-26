import { useId } from 'react';
import { Icon, type IconName } from '../../components/Icon';
import type { ServiceId } from '../../lib/quote-engine';

export type ServiceOption = { id: ServiceId; label: string; desc: string; icon: IconName };

type Props = {
  name: string;
  label: string;
  options: ServiceOption[];
  value: ServiceId | '';
  onChange: (v: ServiceId) => void;
  error?: string;
};

/** Tipo de servicio como 4 opciones visibles (grupo de radio accesible). */
export function ServiceSelect({ name, label, options, value, onChange, error }: Props) {
  const id = useId();
  return (
    <fieldset
      className={['tq-svc', error && 'field--error'].filter(Boolean).join(' ')}
      aria-describedby={error ? `${id}-error` : undefined}
    >
      <legend className="field__label">{label}</legend>
      <div className="tq-svc__grid">
        {options.map((o) => (
          <label key={o.id} className={o.id === value ? 'tq-svc__opt is-selected' : 'tq-svc__opt'}>
            <input type="radio" name={name} value={o.id} checked={o.id === value} onChange={() => onChange(o.id)} />
            <span className="tq-svc__icon" aria-hidden="true">
              <Icon name={o.icon} size={20} />
            </span>
            <span className="tq-svc__label">{o.label}</span>
          </label>
        ))}
      </div>
      {error ? (
        <p className="field__error" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
