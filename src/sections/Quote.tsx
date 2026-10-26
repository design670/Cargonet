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
  weightUnit: WeightUnit;
  length: string;
  dimUnit: DimUnit;
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
  weightUnit: 'kg',
  length: '',
  dimUnit: 'cm',
  width: '',
  height: '',
  packages: '',
  name: '',
  company: '',
  email: '',
  phone: '',
};

type Errors = Partial<Record<keyof Values | 'consent', string>>;

type WeightUnit = 'kg' | 'lb';
type DimUnit = 'cm' | 'in';
const weightName: Record<WeightUnit, string> = { kg: 'kilogramos', lb: 'libras' };
const dimName: Record<DimUnit, string> = { cm: 'centímetros', in: 'pulgadas' };

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
    if (!v.weight) e.weight = `Indica el peso total en ${weightName[v.weightUnit]}.`;
    else if (!positive(v.weight)) e.weight = `El peso debe ser mayor que 0 ${v.weightUnit}.`;
  }
  if (cargo) {
    if (!positive(v.length)) e.length = `Indica el largo en ${dimName[v.dimUnit]}.`;
    if (!positive(v.width)) e.width = `Indica el ancho en ${dimName[v.dimUnit]}.`;
    if (!positive(v.height)) e.height = `Indica el alto en ${dimName[v.dimUnit]}.`;
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
  const dims = values.length || values.width || values.height ? `${values.length || '–'} × ${values.width || '–'} × ${values.height || '–'} ${values.dimUnit}` : '';
  const summary: SummaryRow[] = [
    { label: 'Operación', value: op?.label ?? '' },
    { label: 'Origen', value: values.origin },
    { label: 'Destino', value: values.destination },
    { label: 'Tipo de mercancía', value: values.merch },
    { label: 'Descripción', value: values.description },
    { label: 'Peso', value: values.weight ? `${values.weight} ${values.weightUnit}` : '' },
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
                  <h3 className="prep__title">
                    <span className="tt-light">Antes de cotizar,</span>{' '}
                    <span className="tt-strong">
                      <em className="tt-accent">revisa</em>
                    </span>
                  </h3>
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
                      <div className="span-2 unit-switch">
                        <UnitToggle
                          label="Peso"
                          name="weightUnit"
                          options={[['kg', 'Kilogramos (kg)'], ['lb', 'Libras (lb)']]}
                          value={values.weightUnit}
                          onChange={(v) => update('weightUnit', v)}
                        />
                        <UnitToggle
                          label="Medidas"
                          name="dimUnit"
                          options={[['cm', 'Centímetros (cm)'], ['in', 'Pulgadas (in)']]}
                          value={values.dimUnit}
                          onChange={(v) => update('dimUnit', v)}
                        />
                      </div>
                      <TextField
                        name="weight"
                        label={cargo ? 'Peso total' : 'Peso aproximado'}
                        optional={!cargo}
                        inputMode="decimal"
                        unit={values.weightUnit}
                        value={values.weight}
                        onChange={set('weight')}
                        error={errors.weight}
                      />
                      <div className="tax-alert" role="note">
                        <Icon name="alert" size={22} />
                        <p>
                          <strong>Ten en cuenta los impuestos.</strong> Los impuestos y aranceles de importación dependen
                          del valor declarado, el peso, el tipo de mercancía y la normativa del país de destino. Un asesor
                          te confirmará si tu envío los genera.
                        </p>
                      </div>
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
                          <TextField name="length" label="Largo" inputMode="decimal" unit={values.dimUnit} value={values.length} onChange={set('length')} error={errors.length} />
                          <TextField name="width" label="Ancho" inputMode="decimal" unit={values.dimUnit} value={values.width} onChange={set('width')} error={errors.width} />
                          <TextField name="height" label="Alto" inputMode="decimal" unit={values.dimUnit} value={values.height} onChange={set('height')} error={errors.height} />
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

/** Selector segmentado de unidades. */
function UnitToggle({
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
    <fieldset className="unit-toggle">
      <legend className="unit-toggle__label">{label}</legend>
      <div className="unit-toggle__options">
        {options.map(([v, text]) => (
          <label key={v} className={value === v ? 'unit-toggle__opt is-active' : 'unit-toggle__opt'}>
            <input type="radio" name={name} value={v} checked={value === v} onChange={() => onChange(v)} />
            <span aria-hidden="true">{v}</span>
            <span className="sr-only">{text}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
