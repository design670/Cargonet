import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';

type Base = {
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  unit?: string;
  className?: string;
};

function Wrapper({
  id,
  label,
  hint,
  error,
  optional,
  className,
  children,
}: Base & { id: string; children: ReactNode }) {
  return (
    <div className={['field', error && 'field--error', className].filter(Boolean).join(' ')}>
      <label className="field__label" htmlFor={id}>
        {label}
        {optional ? <span className="field__optional"> (opcional)</span> : null}
      </label>
      {children}
      {hint && !error ? (
        <p className="field__hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="field__error" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id: string, hint?: string, error?: string) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

export function TextField({
  label,
  hint,
  error,
  optional,
  unit,
  className,
  ...input
}: Base & InputHTMLAttributes<HTMLInputElement>) {
  const auto = useId();
  const id = input.id ?? auto;
  const control = (
    <input
      {...input}
      id={id}
      className="field__control"
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy(id, hint, error)}
      required={!optional && input.required}
    />
  );
  return (
    <Wrapper id={id} label={label} hint={hint} error={error} optional={optional} className={className}>
      {unit ? (
        <div className="field__unit-wrap">
          {control}
          <span className="field__unit" aria-hidden="true">
            {unit}
          </span>
        </div>
      ) : (
        control
      )}
    </Wrapper>
  );
}

export function SelectField({
  label,
  hint,
  error,
  optional,
  className,
  children,
  ...select
}: Base & SelectHTMLAttributes<HTMLSelectElement>) {
  const auto = useId();
  const id = select.id ?? auto;
  return (
    <Wrapper id={id} label={label} hint={hint} error={error} optional={optional} className={className}>
      <div className="field__select-wrap">
        <select
          {...select}
          id={id}
          className="field__control field__control--select"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
        >
          {children}
        </select>
      </div>
    </Wrapper>
  );
}

export function TextareaField({
  label,
  hint,
  error,
  optional,
  className,
  ...area
}: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const auto = useId();
  const id = area.id ?? auto;
  return (
    <Wrapper id={id} label={label} hint={hint} error={error} optional={optional} className={className}>
      <textarea
        rows={4}
        {...area}
        id={id}
        className="field__control field__control--area"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
      />
    </Wrapper>
  );
}

/** Casilla de consentimiento: nunca preseleccionada. */
export function ConsentField({
  checked,
  onChange,
  error,
  id,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
  id: string;
  children: ReactNode;
}) {
  return (
    <div className={['consent', error && 'consent--error'].filter(Boolean).join(' ')}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      <label htmlFor={id}>{children}</label>
      {error ? (
        <p className="field__error" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
