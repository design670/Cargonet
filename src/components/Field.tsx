import {
  useEffect,
  useId,
  useRef,
  useState,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';

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

/**
 * Desplegable con diseño propio (botón + lista): reemplaza la lista nativa del
 * sistema. Teclado: flechas, Inicio/Fin, Enter/Espacio para elegir, Escape para cerrar.
 */
export function ListboxField<T extends string>({
  label,
  hint,
  error,
  className,
  name,
  placeholder,
  value,
  options,
  onChange,
}: Omit<Base, 'unit' | 'optional'> & {
  name?: string;
  /** Texto cuando aún no hay opción elegida. */
  placeholder?: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  const id = useId();
  const listId = `${id}-list`;
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const selected = options.findIndex((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);

  const show = () => {
    setActive(Math.max(0, selected));
    setOpen(true);
  };
  const pick = (i: number) => {
    onChange(options[i].value);
    setOpen(false);
    btnRef.current?.focus();
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = options.length - 1;
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        show();
      }
      return;
    }
    const moves: Record<string, number> = {
      ArrowDown: Math.min(last, active + 1),
      ArrowUp: Math.max(0, active - 1),
      Home: 0,
      End: last,
    };
    if (e.key in moves) {
      e.preventDefault();
      setActive(moves[e.key]);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      pick(active);
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      if (e.key === 'Escape') e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <Wrapper id={id} label={label} hint={hint} error={error} className={className}>
      <div ref={rootRef} className={open ? 'field__select-wrap listbox is-open' : 'field__select-wrap listbox'}>
        <button
          ref={btnRef}
          id={id}
          name={name}
          type="button"
          className="field__control field__control--select listbox__button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={open ? `${id}-opt-${active}` : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          onClick={() => (open ? setOpen(false) : show())}
          onKeyDown={onKey}
        >
          {selected >= 0 ? (
            options[selected].label
          ) : (
            <span className="listbox__placeholder">{placeholder ?? 'Selecciona una opción'}</span>
          )}
        </button>
        <ul id={listId} className="listbox__list" role="listbox" aria-labelledby={id} hidden={!open}>
          {options.map((o, i) => (
            <li
              key={o.value}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={i === selected}
              className={i === active ? 'listbox__option is-active' : 'listbox__option'}
              onPointerEnter={() => setActive(i)}
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => pick(i)}
            >
              <span>{o.label}</span>
              <svg className="listbox__check" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </li>
          ))}
        </ul>
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
