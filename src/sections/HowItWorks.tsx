import { TwoToneTitle } from '../components/TwoToneTitle';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { SectionHeading } from '../components/SectionHeading';
import { links } from '../content/site';
import { StepsCarousel, steps, type Step } from './StepsCarousel';

/** Lista vertical de móvil: los mismos pasos del carrusel, agrupados por fase. */
const numbered = steps.map((s, i) => ({ ...s, n: i + 1 }));
const phases: { id: string; title: string; who: string; steps: (Step & { n: number })[] }[] = [
  {
    id: 'fase-origen',
    title: 'Hasta nuestra bodega en Miami',
    who: 'Seguimiento con el tracking de la tienda o transportadora de origen.',
    steps: numbered.filter((s) => s.phase === 'Antes de Miami'),
  },
  {
    id: 'fase-cargonet',
    title: 'Con CargoNet USA',
    who: 'Los eventos se registran en tu cuenta CargoNet USA desde la recepción.',
    steps: numbered.filter((s) => s.phase === 'Desde Miami'),
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
                    <ul className="sc-card__points step__points">
                      {s.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
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
