import { TwoToneTitle } from '../components/TwoToneTitle';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Button } from '../components/Button';
import { ConsentField, TextField, TextareaField } from '../components/Field';
import { FormStatus, type SummaryRow } from '../components/FormStatus';
import { Icon } from '../components/Icon';
import { links } from '../content/site';
import { emailOk, phoneOk, submitForm, type SubmitResult } from '../lib/forms';

const benefits = [
  'Orientación para importar repuestos y componentes.',
  'Alternativas de transporte según las características de la mercancía.',
  'Acompañamiento durante el proceso logístico.',
  'Información sobre requisitos y documentación.',
  'Cotización según las necesidades de cada operación.',
];

type Values = {
  name: string;
  company: string;
  email: string;
  phone: string;
  part: string;
  origin: string;
  need: string;
  date: string;
};
const empty: Values = { name: '', company: '', email: '', phone: '', part: '', origin: '', need: '', date: '' };
type Errors = Partial<Record<keyof Values | 'consent', string>>;

function validate(v: Values, consent: boolean): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = 'Escribe tu nombre y apellido.';
  if (!v.company.trim()) e.company = 'Escribe el nombre de tu empresa.';
  if (!v.email.trim()) e.email = 'Escribe tu correo electrónico.';
  else if (!emailOk(v.email)) e.email = 'Revisa el formato del correo, por ejemplo nombre@empresa.com.';
  if (!v.phone.trim()) e.phone = 'Escribe un teléfono de contacto.';
  else if (!phoneOk(v.phone)) e.phone = 'El teléfono debe tener al menos 7 dígitos.';
  if (!v.part.trim()) e.part = 'Indica el tipo de repuesto o componente.';
  if (!v.origin.trim()) e.origin = 'Indica el país o la ciudad de origen.';
  if (v.need.trim().length < 10) e.need = 'Describe tu necesidad con un poco más de detalle.';
  if (!consent) e.consent = 'Debes aceptar el tratamiento de datos para continuar.';
  return e;
}

const order: (keyof Errors)[] = ['name', 'company', 'email', 'phone', 'part', 'origin', 'need', 'consent'];

export function Business() {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Values>(empty);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (open) panelRef.current?.querySelector<HTMLInputElement>('input')?.focus();
  }, [open]);

  useEffect(() => {
    if (result) statusRef.current?.focus();
  }, [result]);

  const set = (k: keyof Values) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validate(values, consent);
    setErrors(found);
    const first = order.find((k) => found[k]);
    if (first) {
      const sel = first === 'consent' ? '#parts-consent' : `[name="${first}"]`;
      formRef.current?.querySelector<HTMLElement>(sel)?.focus();
      return;
    }
    setBusy(true);
    const res = await submitForm('parts', { ...values, consent });
    setBusy(false);
    setResult(res);
  };

  const today = new Date().toISOString().slice(0, 10);
  const summary: SummaryRow[] = [
    { label: 'Nombre', value: values.name },
    { label: 'Empresa', value: values.company },
    { label: 'Correo', value: values.email },
    { label: 'Teléfono', value: values.phone },
    { label: 'Repuesto o componente', value: values.part },
    { label: 'Origen', value: values.origin },
    { label: 'Necesidad', value: values.need },
    { label: 'Fecha en que se requiere', value: values.date },
  ];

  return (
    <section id="empresas" className="section business" aria-labelledby="business-title">
      <div className="container business__grid">
        <div className="business__media" data-reveal>
          <picture>
            <source media="(min-width: 768px)" srcSet="/img/empresas-repuestos-1400.webp" width="1400" height="1100" />
            <img
              src="/img/empresas-repuestos-800.webp"
              alt="Técnico revisando una pieza metálica industrial en un taller de mantenimiento"
              width="800"
              height="800"
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>

        <div className="business__copy">
          <p className="kicker business__kicker" data-reveal>
            Soluciones para empresas
          </p>
          <h2 id="business-title" className="h2" data-reveal>
            <TwoToneTitle light="Cuando tu operación necesita un repuesto," bold="cada hora" accent="cuenta." />
          </h2>
          <p className="lead" data-reveal>
            Una falla en un equipo o una máquina puede afectar la productividad de tu empresa. CargoNet USA busca ser tu
            aliado para gestionar la importación de repuestos y componentes desde el exterior, ayudándote a coordinar el
            proceso logístico y a reducir tiempos de espera.
          </p>
          <ul className="checklist" data-reveal-group>
            {benefits.map((b) => (
              <li key={b} data-reveal>
                <span className="checklist__icon" aria-hidden="true">
                  <Icon name="check" size={16} />
                </span>
                {b}
              </li>
            ))}
          </ul>
          <div data-reveal>
            <Button
              icon={open ? undefined : 'arrowRight'}
              aria-expanded={open}
              aria-controls="form-repuestos"
              onClick={() => setOpen((v) => !v)}
              variant={open ? 'secondary' : 'primary'}
            >
              {open ? 'Ocultar formulario' : 'Necesito importar un repuesto'}
            </Button>
          </div>
        </div>
      </div>

      <div className="container">
        <div id="form-repuestos" ref={panelRef} className="parts-form" hidden={!open}>
          <div className="parts-form__head">
            <h3 className="h3">Cuéntanos qué repuesto necesitas</h3>
            <p>Un asesor revisará tu solicitud y te orientará sobre las alternativas de importación.</p>
          </div>

          {result && result.status !== 'error' ? (
            result.status === 'sent' ? (
              <FormStatus ref={statusRef} kind="sent" />
            ) : (
              <FormStatus
                ref={statusRef}
                kind="not-configured"
                summary={summary}
                whatsappIntro="Hola, necesito importar un repuesto. Estos son mis datos:"
                onEdit={() => setResult(null)}
              />
            )
          ) : (
            <form ref={formRef} noValidate onSubmit={onSubmit} className="form-grid" aria-label="Solicitud de importación de repuesto">
              {result?.status === 'error' ? <FormStatus ref={statusRef} kind="error" message={result.message} /> : null}
              <TextField name="name" label="Nombre y apellido" autoComplete="name" value={values.name} onChange={set('name')} error={errors.name} />
              <TextField name="company" label="Empresa" autoComplete="organization" value={values.company} onChange={set('company')} error={errors.company} />
              <TextField name="email" type="email" label="Correo electrónico" autoComplete="email" inputMode="email" value={values.email} onChange={set('email')} error={errors.email} />
              <TextField name="phone" type="tel" label="Teléfono" autoComplete="tel" inputMode="tel" value={values.phone} onChange={set('phone')} error={errors.phone} hint="Incluye el indicativo del país." />
              <TextField name="part" label="Tipo de repuesto o componente" value={values.part} onChange={set('part')} error={errors.part} hint="Por ejemplo: rodamiento, tarjeta electrónica, bomba hidráulica." />
              <TextField name="origin" label="País o ciudad de origen" value={values.origin} onChange={set('origin')} error={errors.origin} />
              <TextareaField
                name="need"
                className="span-2"
                label="Descripción de la necesidad"
                value={values.need}
                onChange={set('need')}
                error={errors.need}
                hint="Referencia, cantidad, equipo en el que se usa y cualquier dato que ayude a identificarlo."
              />
              <TextField
                name="date"
                type="date"
                optional
                min={today}
                label="Fecha estimada en la que necesitas la mercancía"
                value={values.date}
                onChange={set('date')}
                hint="Nos ayuda a priorizar tu solicitud. No representa una fecha de entrega comprometida."
              />
              <div className="span-2">
                <ConsentField id="parts-consent" checked={consent} onChange={(v) => { setConsent(v); if (v) setErrors((er) => ({ ...er, consent: undefined })); }} error={errors.consent}>
                  Autorizo el tratamiento de mis datos personales según la{' '}
                  <a href={links.privacy} target="_blank" rel="noopener noreferrer">
                    política de tratamiento de datos
                  </a>
                  .
                </ConsentField>
              </div>
              <div className="span-2 form-actions">
                <Button type="submit" loading={busy}>
                  {busy ? 'Enviando…' : 'Enviar solicitud'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
