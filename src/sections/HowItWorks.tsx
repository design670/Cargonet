import { TwoToneTitle } from '../components/TwoToneTitle';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { SectionHeading } from '../components/SectionHeading';
import { links } from '../content/site';
import { StepsCarousel } from './StepsCarousel';

type Step = { n: number; title: string; text: string };

const phases: { id: string; title: string; who: string; steps: Step[] }[] = [
  {
    id: 'fase-origen',
    title: 'Hasta nuestra bodega en Miami',
    who: 'Seguimiento con el tracking de la tienda o transportadora de origen.',
    steps: [
      {
        n: 1,
        title: 'Crea tu casillero',
        text: 'Regístrate en CargoNet USA y obtén los datos de tu casillero para recibir tus compras en Estados Unidos.',
      },
      {
        n: 2,
        title: 'Realiza tu compra y prealerta el paquete',
        text: 'Compra en la tienda de tu preferencia y registra tu envío en el portal. Adjunta la factura y el número de tracking para facilitar su identificación.',
      },
      {
        n: 3,
        title: 'Seguimiento de la transportadora de origen',
        text: 'Consulta el tracking de tu compra para verificar su recorrido y confirmar cuándo ha sido entregada en nuestra bodega de Miami.',
      },
    ],
  },
  {
    id: 'fase-cargonet',
    title: 'Con CargoNet USA',
    who: 'Los eventos se registran en tu cuenta CargoNet USA desde la recepción.',
    steps: [
      {
        n: 4,
        title: 'Recepción y validación',
        text: 'Una vez recibido el paquete, se verifica su identificación y se revisa la documentación y las condiciones aplicables al servicio contratado.',
      },
      {
        n: 5,
        title: 'Transporte internacional',
        text: 'Tu paquete continúa el proceso logístico correspondiente. Podrás consultar los estados y las novedades que se registren en el sistema.',
      },
      {
        n: 6,
        title: 'Despacho y entrega',
        text: 'Cuando complete las etapas operativas y las validaciones necesarias, el envío continuará hacia su despacho y entrega.',
      },
    ],
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="section section--surface how" aria-labelledby="how-title">
      {/* Bloque que se fija al hacer scroll (tablet/desktop) */}
      <div className="how__pin">
      <div className="how__sticky">
      <div className="container">
        <SectionHeading
          id="how-title"
          title={<TwoToneTitle light="De tu compra a la entrega," bold="conoce cada" accent="paso." />}
          intro="Queremos que sepas qué hacer, qué documentos necesitas y qué ocurre con tu paquete durante el proceso logístico."
        />

      </div>

      {/* Tablet/desktop: carrusel de pasos. Móvil: lista vertical por fases. */}
      <StepsCarousel />
      </div>
      </div>

      <div className="container">
        <div className="how__phases">
          {phases.map((phase, pi) => (
            <div key={phase.id} className={`phase phase--${pi + 1}`} aria-labelledby={phase.id} role="group">
              <div className="phase__head" data-reveal>
                <div className="phase__titles">
                  <p className="phase__tag">{pi === 0 ? 'Antes de Miami' : 'Desde Miami'}</p>
                  <h3 id={phase.id} className="phase__title">
                    {phase.title}
                  </h3>
                </div>
                <p className="phase__who">
                  <Icon name={pi === 0 ? 'route' : 'package'} size={18} />
                  {phase.who}
                </p>
              </div>
              <div className="phase__track" data-progress aria-hidden="true">
                <span className="phase__track-fill" />
                <span className="phase__parcel">
                  <Icon name="package" size={16} />
                </span>
              </div>
              <ol className="steps" start={phase.steps[0].n} data-reveal-group data-progress>
                {phase.steps.map((s) => (
                  <li key={s.n} className="step" data-reveal>
                    <span className="step__num" aria-hidden="true">
                      {String(s.n).padStart(2, '0')}
                    </span>
                    <h4 className="step__title">
                      <span className="sr-only">Paso {s.n}. </span>
                      {s.title}
                    </h4>
                    <p className="step__text">{s.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        <div className="how__footer" data-reveal>
          <p className="note">
            <Icon name="clock" size={22} />
            <span>
              <strong>Despachos semanales.</strong> Los tiempos de entrega dependen de la modalidad contratada y del
              proceso logístico aplicable.
            </span>
          </p>
          <Button href={links.requirementsPdf} variant="secondary" icon="arrowUpRight" target="_blank" rel="noopener noreferrer">
            Conocer los requisitos del servicio
            <span className="sr-only"> (PDF, se abre en una pestaña nueva)</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
