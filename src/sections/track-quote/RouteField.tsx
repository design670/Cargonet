import { useId } from 'react';

type Props = {
  name: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
};

/** Campo de ruta con el rótulo dentro de la caja, a la misma altura que la ruta fija. */
export function RouteField({ name, label, value, onChange, error }: Props) {
  const id = useId();
  return (
    <div className={['tq-route__field', error && 'field--error'].filter(Boolean).join(' ')}>
      <label className="tq-route__box" htmlFor={id}>
        <span className="tq-label">{label}</span>
        <input
          id={id}
          name={name}
          className="tq-route__input"
          placeholder="País o ciudad"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </label>
      {error ? (
        <p className="field__error" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
