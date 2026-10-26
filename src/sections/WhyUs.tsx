import { TwoToneTitle } from '../components/TwoToneTitle';
import { Icon, type IconName } from '../components/Icon';
import { company } from '../content/site';

const reasons: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'headset',
    title: 'Atención personalizada',
    text: 'Acompañamiento y orientación para resolver dudas y gestionar las necesidades de cada envío.',
  },
  {
    icon: 'tag',
    title: 'Tarifas competitivas',
    text: 'Alternativas de transporte con condiciones y costos claros para cada modalidad.',
  },
  {
    icon: 'shield',
    title: 'Seguridad y cuidado de la mercancía',
    text: 'Procesos de identificación, recepción y seguimiento orientados a gestionar adecuadamente los paquetes.',
  },
  {
    icon: 'file',
    title: 'Información clara',
    text: 'Acceso a los requisitos, documentos, estados y novedades de cada operación.',
  },
  {
    icon: 'devices',
    title: 'Tecnología al servicio del cliente',
    text: 'Herramientas digitales para registrar prealertas, consultar envíos y centralizar la información disponible.',
  },
];

export function WhyUs() {
  return (
    <section className="section why" aria-labelledby="why-title">
      <div className="container">
        <h2 id="why-title" className="h2 why__title" data-reveal>
          <TwoToneTitle light="Tu mercancía merece" bold="respaldo en cada" accent="etapa." />
        </h2>
        <div className="why__grid">
          <div className="why__highlight" data-reveal>
            <img className="why__photo" src="/img/hero-cargonet-1100.webp" alt="" width="1100" height="619" loading="lazy" decoding="async" />
            <p className="why__number" aria-hidden="true">
              {company.experienceYears}
              <span className="why__number-unit">años</span>
            </p>
            <h3 className="why__highlight-title">Experiencia en logística internacional</h3>
            <p className="why__highlight-text">{company.experienceYears} años de experiencia en el sector.</p>
            <svg className="why__route" viewBox="0 0 320 120" fill="none" aria-hidden="true">
              <path d="M8 110C80 20 240 20 312 110" />
            </svg>
          </div>
          <ul className="why__list" data-reveal-group>
            {reasons.map((r) => (
              <li key={r.title} className="why__item" data-reveal>
                <span className="why__icon" aria-hidden="true">
                  <Icon name={r.icon} size={24} />
                </span>
                <div>
                  <h3 className="why__item-title">{r.title}</h3>
                  <p>{r.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
