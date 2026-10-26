import { WhatsAppGlyph } from '../components/WhatsAppFab';
import { TwoToneTitle } from '../components/TwoToneTitle';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Button } from '../components/Button';
import { ConsentField, SelectField, TextField, TextareaField } from '../components/Field';
import { FormStatus, type SummaryRow } from '../components/FormStatus';
import { Icon, type IconName } from '../components/Icon';
import { SectionHeading } from '../components/SectionHeading';
import { links, whatsappLink } from '../content/site';
import { emailOk, phoneOk, submitForm, type SubmitResult } from '../lib/forms';

type Operation = 'imp-courier' | 'imp-carga' | 'exp-courier' | 'exp-carga';

const operations: { id: Operation; label: string; detail: string; icon: IconName }[] = [
  { id: 'imp-courier', label: 'Importación por courier', detail: 'Paquetes y compras hacia Colombia', icon: 'package' },
  { id: 'imp-carga', label: 'Importación de carga', detail: 'Mercancía que requiere gestión de carga', icon: 'globe' },
  { id: 'exp-courier', label: 'Exportación por courier', detail: 'Paquetes y documentos desde Colombia', icon: 'plane' },
  { id: 'exp-carga', label: 'Exportación de carga', detail: 'Mercancía comercial hacia otros países', icon: 'route' },
];

/** Descripción breve por modalidad para el panel de pestañas (tablet/desktop). */
const opDetails: Record<Operation, { title: string; text: string }> = {
  'imp-courier': {
    title: 'Tus compras y paquetes hacia Colombia',
    text: 'Para paquetes que llegan desde el exterior. Te orientamos sobre los requisitos, documentos y restricciones de cada mercancía.',
  },
  'imp-carga': {
    title: 'Mercancía que requiere gestión de carga',
    text: 'Carga aérea o marítima hacia Colombia. Revisamos contigo la modalidad, los requisitos y las condiciones de tu operación.',
  },
  'exp-courier': {
    title: 'Paquetes y documentos desde Colombia',
    text: 'Envíos hacia otros países según las condiciones, restricciones y requisitos aplicables a cada mercancía y destino.',
  },
  'exp-carga': {
    title: 'Mercancía comercial hacia otros países',
    text: 'Te acompañamos con la documentación y las alternativas de transporte que corresponden a cada operación.',
  },
};

const modeImages: Record<Operation, string> = {
  'imp-courier': '/img/servicio-courier.webp',
  'imp-carga': '/img/servicio-carga.webp',
  'exp-courier': '/img/servicio-casillero.webp',
  'exp-carga': '/img/servicio-import-export.webp',
};

const merchTypes = [
  'Ropa, calzado y accesorios',
  'Tecnología y electrónica',
  'Repuestos y componentes',
  'Artículos para el hogar',
  'Documentos',
  'Mercancía comercial',
  'Otro',
];

const infoLinks: { icon: IconName; label: string; href: string; external?: boolean; note?: string }[] = [
  { icon: 'file', label: 'Requisitos documentales', href: links.requirementsPdf, external: true, note: 'PDF' },
  { icon: 'alert', label: 'Restricciones de envío', href: links.requirementsPdf, external: true, note: 'PDF' },
  { icon: 'shield', label: 'Mercancías sujetas a validación', href: links.requirementsPdf, external: true, note: 'PDF' },
  { icon: 'clipboard', label: 'Condiciones de transporte', href: links.terms, external: true },
  {
    icon: 'receipt',
    label: 'Posibles cargos adicionales',
    href: whatsappLink('Hola, quiero conocer los posibles cargos adicionales de mi envío.'),
    external: true,
    note: 'Asesor',
  },
  {
    icon: 'clock',
    label: 'Tiempos por modalidad',
    href: whatsappLink('Hola, quiero conocer los tiempos estimados según la modalidad de envío.'),
    external: true,
    note: 'Asesor',
  },
];

type Values = {
  operation: Operation | '';
  origin: string;
  destination: string;
  merch: string;
  description: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  packages: string;
  name: string;
  company: string;
  email: string;
  phone: string;
};

const empty: Values = {
  operation: '',
  origin: '',
  destination: '',
  merch: '',
  description: '',
  weight: '',
  length: '',
  width: '',
  height: '',
  packages: '',
  name: '',
  company: '',
  email: '',
  phone: '',
};

type Errors = Partial<Record<keyof Values | 'consent', string>>;

const isCargo = (op: Values['operation']) => op === 'imp-carga' || op === 'exp-carga';
const isImport = (op: Values['operation']) => op.startsWith('imp');
const positive = (v: string) => Number(v.replace(',', '.')) > 0;

function validateStep1(v: Values): Errors {
  const e: Errors = {};
  if (!v.operation) e.operation = 'Selecciona el tipo de operación.';
  if (!v.origin.trim()) e.origin = 'Indica el país de origen.';
  if (!v.destination.trim()) e.destination = 'Indica el país de destino.';
  if (!v.merch) e.merch = 'Selecciona el tipo de mercancía.';
  if (v.description.trim().length < 5) e.description = 'Describe brevemente qué vas a enviar.';
  const cargo = isCargo(v.operation);
  if (cargo || v.weight) {
    if (!v.weight) e.weight = 'Indica el peso total en kilogramos.';
    else if (!positive(v.weight)) e.weight = 'El peso debe ser mayor que 0 kg.';
  }
  if (cargo) {
    if (!positive(v.length)) e.length = 'Indica el largo en cm.';
    if (!positive(v.width)) e.width = 'Indica el ancho en cm.';
    if (!positive(v.height)) e.height = 'Indica el alto en cm.';
  }
  if (!v.packages) e.packages = 'Indica la cantidad.';
  else if (!/^\d+$/.test(v.packages) || Number(v.packages) < 1) e.packages = 'Usa un número entero mayor que 0.';
  return e;
}

function validateStep2(v: Values, consent: boolean): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = 'Escribe tu nombre y apellido.';
  if (!v.email.trim()) e.email = 'Escribe tu correo electrónico.';
  else if (!emailOk(v.email)) e.email = 'Revisa el formato del correo, por ejemplo nombre@correo.com.';
  if (!v.phone.trim()) e.phone = 'Escribe un teléfono de contacto.';
  else if (!phoneOk(v.phone)) e.phone = 'El teléfono debe tener al menos 7 dígitos.';
  if (!consent) e.consent = 'Debes aceptar el tratamiento de datos para continuar.';
  return e;
}

const fieldOrder: (keyof Errors)[] = [
  'operation', 'origin', 'destination', 'merch', 'description', 'weight', 'packages', 'length', 'width', 'height',
  'name', 'email', 'phone', 'consent',
];

export function Quote() {
  const [step, setStep] = useState<1 | 2>(1);
  const [values, setValues] = useState<Values>(empty);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const stepTitleRef = useRef<HTMLHeadingElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const prevStep = useRef(step);
  const cardRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState(0);

  const goToForm = (opId?: Operation) => {
    if (opId) {
      chooseOperation(opId);
      setStep(1);
      setResult(null);
    }
    cardRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    window.setTimeout(() => {
      const sel = opId ? `input[name="operation"][value="${opId}"]` : 'input[name="operation"]';
      cardRef.current?.querySelector<HTMLElement>(sel)?.focus({ preventScroll: true });
    }, 450);
  };

  // Mueve el foco al título solo cuando el usuario cambia de paso.
  useEffect(() => {
    if (prevStep.current === step) return;
    prevStep.current = step;
    stepTitleRef.current?.focus();
  }, [step]);

  useEffect(() => {
    if (result) statusRef.current?.focus();
  }, [result]);

  const update = (k: keyof Values, value: string) => {
    setValues((v) => ({ ...v, [k]: value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };
  const set = (k: keyof Values) => (e: { target: { value: string } }) => update(k, e.target.value);

  const chooseOperation = (op: Operation) => {
    setValues((v) => {
      const imp = isImport(op);
      const defaults = ['', 'Colombia', 'Estados Unidos'];
      return {
        ...v,
        operation: op,
        origin: defaults.includes(v.origin) ? (imp ? 'Estados Unidos' : 'Colombia') : v.origin,
        destination: defaults.includes(v.destination) ? (imp ? 'Colombia' : '') : v.destination,
      };
    });
    setErrors((er) => ({ ...er, operation: undefined, origin: undefined, destination: undefined }));
  };

  const focusFirstError = (found: Errors) => {
    const first = fieldOrder.find((k) => found[k]);
    if (!first) return;
    const sel = first === 'operation' ? 'input[name="operation"]' : first === 'consent' ? '#quote-consent' : `[name="${first}"]`;
    formRef.current?.querySelector<HTMLElement>(sel)?.focus();
  };

  const next = () => {
    const found = validateStep1(values);
    setErrors(found);
    if (Object.keys(found).length) return focusFirstError(found);
    setStep(2);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (step === 1) return next();
    const found = validateStep2(values, consent);
    setErrors(found);
    if (Object.keys(found).length) return focusFirstError(found);
    setBusy(true);
    const res = await submitForm('quote', { ...values, consent });
    setBusy(false);
    setResult(res);
  };

  const op = operations.find((o) => o.id === values.operation);
  const cargo = isCargo(values.operation);
  const dims = values.length || values.width || values.height ? `${values.length || '–'} × ${values.width || '–'} × ${values.height || '–'} cm` : '';
  const summary: SummaryRow[] = [
    { label: 'Operación', value: op?.label ?? '' },
    { label: 'Origen', value: values.origin },
    { label: 'Destino', value: values.destination },
    { label: 'Tipo de mercancía', value: values.merch },
    { label: 'Descripción', value: values.description },
    { label: 'Peso', value: values.weight ? `${values.weight} kg` : '' },
    { label: 'Dimensiones (largo × ancho × alto)', value: dims },
    { label: cargo ? 'Cantidad de bultos' : 'Cantidad de paquetes', value: values.packages },
  ];
  const contactSummary: SummaryRow[] = [
    { label: 'Nombre', value: values.name },
    { label: 'Empresa', value: values.company },
    { label: 'Correo', value: values.email },
    { label: 'Teléfono', value: values.phone },
  ];

  return (
    <section id="cotizar" className="section section--surface quote" aria-labelledby="quote-title">
      {/* Banner de modalidades (tablet/desktop) */}
      <div className="container">
        <div className="mode-banner" data-reveal>
          <img className="mode-banner__img" src="/img/servicio-carga.webp" alt="" width="1100" height="820" loading="lazy" decoding="async" />
          <div className="mode-banner__head">
            <h2 id="quote-banner-title" className="mode-banner__title">
              <TwoToneTitle light="4 modalidades" bold="de" accent="envío." />
            </h2>
            <p className="mode-banner__text">
              Elige la que corresponde a tu operación y te orientamos sobre los requisitos y las condiciones.
            </p>
            <a className="mode-banner__link" href={links.requirementsPdf} target="_blank" rel="noopener noreferrer">
              Ver requisitos del servicio
              <Icon name="arrowUpRight" size={18} />
              <span className="sr-only"> (PDF, se abre en una pestaña nueva)</span>
            </a>
          </div>
          {/* Acordeón horizontal de modalidades */}
          <div className="mode-accordion">
            {operations.map((o, i) => {
              const open = mode === i;
              return (
                <div
                  key={o.id}
                  className={open ? 'mode-panel is-open' : 'mode-panel'}
                  style={{ ['--img' as string]: 'url(' + modeImages[o.id] + ')' }}
                  onMouseEnter={() => setMode(i)}
                >
                  <button
                    type="button"
                    className="mode-panel__head"
                    aria-expanded={open}
                    aria-controls={'mp-' + o.id}
                    onClick={() => setMode(i)}
                  >
                    <span className="mode-panel__num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="mode-panel__label">{o.label}</span>
                  </button>
                  <div id={'mp-' + o.id} className="mode-panel__body">
                    <span className="mode-panel__icon" aria-hidden="true">
                      <Icon name={o.icon} size={26} />
                    </span>
                    <h3 className="mode-panel__title">{o.label}</h3>
                    <p className="mode-panel__text">{opDetails[o.id].text}</p>
                    <button type="button" className="mode-panel__cta" tabIndex={open ? 0 : -1} onClick={() => goToForm(o.id)}>
                      Cotizar {o.label.toLowerCase()}
                      <Icon name="arrowRight" size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container quote__grid">
        {/* Título del formulario (tablet/desktop) */}
        <div className="quote__form-head" data-reveal>
          <h3 className="quote__form-title">
            <TwoToneTitle light="Cuéntanos sobre tu envío" bold="y solicita tu" accent="cotización." />
          </h3>
          <p className="quote__form-text">
            Completa los datos en dos pasos. Un asesor revisa tu operación y te orienta sobre las alternativas, los
            requisitos y las condiciones.
          </p>
        </div>
        <div className="quote__aside">
          <SectionHeading
            id="quote-title"
            title={<TwoToneTitle light="Encuentra la solución adecuada" bold="para tu" accent="envío." />}
            intro="Cuéntanos qué necesitas transportar y te orientaremos sobre las alternativas disponibles, los requisitos y las condiciones de tu operación."
          />

          <div className="info-list" data-reveal>
            <h3 className="info-list__title">Antes de cotizar, revisa</h3>
            <ul>
              {infoLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} target={l.external ? '_blank' : undefined} rel={l.external ? 'noopener noreferrer' : undefined}>
                    <Icon name={l.icon} size={20} />
                    <span className="info-list__label">{l.label}</span>
                    {l.note ? <span className="info-list__note">{l.note}</span> : null}
                    <Icon name="arrowUpRight" size={18} className="info-list__arrow" />
                    <span className="sr-only"> (se abre en una pestaña nueva)</span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Diseño checklist (tablet/desktop) */}
            <div className="prep">
              <div className="prep__head">
                <div>
                  <h3 className="prep__title">Antes de cotizar, revisa</h3>
                  <p className="prep__subtitle">Información clave para preparar tu envío.</p>
                </div>
              </div>

              <p className="prep__group">Documentos y condiciones</p>
              <ul className="prep__grid">
                {infoLinks
                  .filter((l) => l.note !== 'Asesor')
                  .map((l) => (
                    <li key={l.label}>
                      <a className="prep-tile" href={l.href} target="_blank" rel="noopener noreferrer">
                        <span className="prep-tile__icon" aria-hidden="true">
                          <Icon name={l.icon} size={22} />
                        </span>
                        <span className="prep-tile__label">{l.label}</span>
                        <span className="prep-tile__meta">
                          {l.note ?? 'Página'}
                          <Icon name="arrowUpRight" size={16} />
                        </span>
                        <span className="sr-only"> (se abre en una pestaña nueva)</span>
                      </a>
                    </li>
                  ))}
              </ul>

              <p className="prep__group">Consulta con un asesor</p>
              <ul className="prep__ask">
                {infoLinks
                  .filter((l) => l.note === 'Asesor')
                  .map((l) => (
                    <li key={l.label}>
                      <a className="prep-ask" href={l.href} target="_blank" rel="noopener noreferrer">
                        <span className="prep-ask__icon" aria-hidden="true">
                          <WhatsAppGlyph size={22} />
                        </span>
                        <span className="prep-ask__label">{l.label}</span>
                        <span className="prep-ask__go">
                          WhatsApp
                          <Icon name="arrowRight" size={16} />
                        </span>
                        <span className="sr-only"> (se abre en una pestaña nueva)</span>
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="quote-card" ref={cardRef} data-reveal>
          {result && result.status !== 'error' ? (
            <>
              <h3 className="quote-card__title">Revisión de tu solicitud</h3>
              {result.status === 'sent' ? (
                <FormStatus ref={statusRef} kind="sent" />
              ) : (
                <FormStatus
                  ref={statusRef}
                  kind="not-configured"
                  summary={[...summary, ...contactSummary]}
                  whatsappIntro="Hola, quiero solicitar una cotización. Estos son los datos de mi envío:"
                  onEdit={() => setResult(null)}
                />
              )}
            </>
          ) : (
            <form ref={formRef} noValidate onSubmit={onSubmit} aria-labelledby="quote-step-title">
              <div className="stepper" aria-hidden="true">
                <span className={step >= 1 ? 'is-active' : ''}>
                  <b className="stepper__label"><i>1</i>Operación y mercancía</b>
                </span>
                <span className={step >= 2 ? 'is-active' : ''}>
                  <b className="stepper__label"><i>2</i>Contacto y revisión</b>
                </span>
              </div>
              <p className="quote-card__step">Paso {step} de 2</p>
              <h3 id="quote-step-title" ref={stepTitleRef} tabIndex={-1} className="quote-card__title">
                {step === 1 ? 'Operación y mercancía' : 'Datos de contacto y revisión'}
              </h3>

              {result?.status === 'error' ? <FormStatus ref={statusRef} kind="error" message={result.message} /> : null}

              {step === 1 ? (
                <div className="form-grid">
                  <fieldset className="span-2 op-picker" aria-describedby={errors.operation ? 'op-error' : undefined}>
                    <legend className="field__label">¿Qué tipo de operación necesitas?</legend>
                    <div className="op-picker__grid">
                      {operations.map((o) => (
                        <label key={o.id} className={['op-option', values.operation === o.id && 'is-selected'].filter(Boolean).join(' ')}>
                          <input
                            type="radio"
                            name="operation"
                            value={o.id}
                            checked={values.operation === o.id}
                            onChange={() => chooseOperation(o.id)}
                          />
                          <Icon name={o.icon} size={22} className="op-option__icon" />
                          <span className="op-option__label">{o.label}</span>
                          <span className="op-option__detail">{o.detail}</span>
                        </label>
                      ))}
                    </div>
                    {errors.operation ? (
                      <p className="field__error" id="op-error">
                        {errors.operation}
                      </p>
                    ) : null}
                  </fieldset>

                  {values.operation ? (
                    <>
                      <TextField name="origin" label="País de origen" autoComplete="off" value={values.origin} onChange={set('origin')} error={errors.origin} />
                      <TextField name="destination" label="País de destino" autoComplete="off" value={values.destination} onChange={set('destination')} error={errors.destination} />
                      <SelectField name="merch" label="Tipo de mercancía" value={values.merch} onChange={set('merch')} error={errors.merch} className="span-2">
                        <option value="">Selecciona una opción</option>
                        {merchTypes.map((m) => (
                          <option key={m}>{m}</option>
                        ))}
                      </SelectField>
                      <TextareaField
                        name="description"
                        className="span-2"
                        rows={3}
                        label="Descripción de la mercancía"
                        value={values.description}
                        onChange={set('description')}
                        error={errors.description}
                        hint="Qué es, material, uso y valor aproximado si lo conoces."
                      />
                      <TextField
                        name="weight"
                        label={cargo ? 'Peso total' : 'Peso aproximado'}
                        optional={!cargo}
                        inputMode="decimal"
                        unit="kg"
                        value={values.weight}
                        onChange={set('weight')}
                        error={errors.weight}
                      />
                      <TextField
                        name="packages"
                        label={cargo ? 'Cantidad de bultos' : 'Cantidad de paquetes'}
                        inputMode="numeric"
                        value={values.packages}
                        onChange={set('packages')}
                        error={errors.packages}
                      />
                      <fieldset className="span-2 dims">
                        <legend className="field__label">
                          Dimensiones por bulto{cargo ? '' : <span className="field__optional"> (opcional)</span>}
                        </legend>
                        <div className="dims__grid">
                          <TextField name="length" label="Largo" inputMode="decimal" unit="cm" value={values.length} onChange={set('length')} error={errors.length} />
                          <TextField name="width" label="Ancho" inputMode="decimal" unit="cm" value={values.width} onChange={set('width')} error={errors.width} />
                          <TextField name="height" label="Alto" inputMode="decimal" unit="cm" value={values.height} onChange={set('height')} error={errors.height} />
                        </div>
                      </fieldset>
                    </>
                  ) : (
                    <p className="span-2 quote-card__hint">Selecciona una operación para ver los datos que necesitamos.</p>
                  )}

                  <div className="span-2 form-actions">
                    <Button type="submit" icon="arrowRight">
                      Continuar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="form-grid">
                  <div className="span-2 review">
                    <div className="review__head">
                      <p className="review__title">Tu operación</p>
                      <button type="button" className="link-btn" onClick={() => setStep(1)}>
                        Editar
                      </button>
                    </div>
                    <dl className="summary summary--compact">
                      {summary
                        .filter((r) => r.value)
                        .map((r) => (
                          <div key={r.label} className="summary__row">
                            <dt>{r.label}</dt>
                            <dd>{r.value}</dd>
                          </div>
                        ))}
                    </dl>
                  </div>
                  <TextField name="name" label="Nombre y apellido" autoComplete="name" value={values.name} onChange={set('name')} error={errors.name} />
                  <TextField name="company" label="Empresa" optional autoComplete="organization" value={values.company} onChange={set('company')} />
                  <TextField name="email" type="email" label="Correo electrónico" autoComplete="email" inputMode="email" value={values.email} onChange={set('email')} error={errors.email} />
                  <TextField name="phone" type="tel" label="Teléfono" autoComplete="tel" inputMode="tel" value={values.phone} onChange={set('phone')} error={errors.phone} hint="Incluye el indicativo del país." />
                  <div className="span-2">
                    <ConsentField
                      id="quote-consent"
                      checked={consent}
                      onChange={(v) => {
                        setConsent(v);
                        if (v) setErrors((er) => ({ ...er, consent: undefined }));
                      }}
                      error={errors.consent}
                    >
                      Autorizo el tratamiento de mis datos personales según la{' '}
                      <a href={links.privacy} target="_blank" rel="noopener noreferrer">
                        política de tratamiento de datos
                      </a>
                      .
                    </ConsentField>
                  </div>
                  <div className="span-2 form-actions form-actions--split">
                    <Button variant="secondary" onClick={() => setStep(1)}>
                      Atrás
                    </Button>
                    <Button type="submit" loading={busy}>
                      {busy ? 'Enviando…' : 'Solicitar cotización'}
                    </Button>
                  </div>
                  <p className="span-2 quote-card__hint">
                    La cotización la prepara nuestro equipo según tu operación. No calculamos tarifas automáticas en esta
                    página.
                  </p>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
