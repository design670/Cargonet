import { TwoToneTitle } from '../components/TwoToneTitle';
import { Icon, type IconName } from '../components/Icon';
import { links } from '../content/site';

type Action = { icon: IconName; title: string; text: string; cta: string; href: string; featured?: boolean };

const actions: Action[] = [
  {
    icon: 'locker',
    title: 'Crear mi casillero',
    text: 'Obtén tu casillero en Estados Unidos y prepara tu cuenta para recibir tus compras.',
    cta: 'Crear casillero',
    href: links.register,
  },
  {
    icon: 'clipboard',
    title: 'Prealertar una compra',
    text: 'Registra tu paquete con la factura y el número de tracking para facilitar su identificación.',
    cta: 'Registrar prealerta',
    href: links.prealert,
  },
  {
    icon: 'search',
    title: 'Rastrear mi envío',
    text: 'Consulta el estado de tu paquete y revisa las novedades de su proceso logístico.',
    cta: 'Rastrear paquete',
    href: links.tracking,
    featured: true,
  },
  {
    icon: 'calculator',
    title: 'Cotizar un envío',
    text: 'Cuéntanos qué necesitas transportar y recibe orientación sobre la alternativa adecuada.',
    cta: 'Solicitar cotización',
    href: '#cotizar',
  },
];

export function QuickActions() {
  return (
    <section id="herramientas" className="quick" aria-labelledby="quick-title">
      <div className="container">
        <div className="quick__panel">
          <h2 id="quick-title" className="quick__title" data-reveal>
            <TwoToneTitle light="¿Qué necesitas" bold="hacer" accent="hoy?" />
          </h2>
          <ul className="quick__grid" data-reveal-group>
            {actions.map((a) => (
              <li key={a.title} data-reveal>
                <a className={a.featured ? 'action-card action-card--featured' : 'action-card'} href={a.href}>
                  <span className="action-card__icon" aria-hidden="true">
                    <Icon name={a.icon} size={26} />
                  </span>
                  <span className="action-card__title">{a.title}</span>
                  <span className="action-card__text">{a.text}</span>
                  <span className="action-card__cta">
                    {a.cta}
                    <Icon name="arrowRight" size={18} />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
