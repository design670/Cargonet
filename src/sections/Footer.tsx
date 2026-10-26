import { Icon } from '../components/Icon';
import { company, contact, links, whatsappLink } from '../content/site';

type L = { label: string; href: string; external?: boolean };

const groups: { title: string; items: L[] }[] = [
  {
    title: 'Servicios',
    items: [
      { label: 'Casillero USA', href: '#casillero' },
      { label: 'Courier internacional', href: '#courier' },
      { label: 'Carga aérea y marítima', href: '#carga' },
      { label: 'Importaciones y exportaciones', href: '#import-export' },
      { label: 'Soluciones para empresas', href: '#empresas' },
    ],
  },
  {
    title: 'Herramientas',
    items: [
      { label: 'Rastrear envío', href: links.tracking },
      { label: 'Prealertar una compra', href: links.prealert },
      { label: 'Acceso al portal', href: links.login },
      { label: 'Crear mi casillero', href: links.register },
      { label: 'Cotizar un envío', href: '#cotizar' },
    ],
  },
  {
    title: 'Información legal',
    items: [
      { label: 'Política de tratamiento de datos', href: links.privacy, external: true },
      { label: 'Términos y condiciones', href: links.terms, external: true },
      { label: 'Restricciones y condiciones del servicio', href: links.requirementsPdf, external: true },
      { label: 'Canales de PQR', href: links.pqr, external: true },
    ],
  },
];

function FooterLink({ l }: { l: L }) {
  return (
    <a href={l.href} target={l.external ? '_blank' : undefined} rel={l.external ? 'noopener noreferrer' : undefined}>
      {l.label}
      {l.external ? <span className="sr-only"> (se abre en una pestaña nueva)</span> : null}
    </a>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <picture>
              <source media="(min-width: 700px)" srcSet="/img/logo-cargonet-blanco.png" width="950" height="154" />
              <img src="/img/logo-cargonet.png" alt="CargoNet USA" width="270" height="77" loading="lazy" />
            </picture>
            <p>Casillero en Estados Unidos, courier y carga internacional.</p>
          </div>

          <nav className="site-footer__nav" aria-label="Pie de página">
            {groups.slice(0, 2).map((g) => (
              <div key={g.title} className="site-footer__group">
                <h2 className="site-footer__title">{g.title}</h2>
                <ul>
                  {g.items.map((l) => (
                    <li key={l.label}>
                      <FooterLink l={l} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="site-footer__group">
              <h2 className="site-footer__title">Ayuda y contacto</h2>
              <ul className="site-footer__contact">
                <li>
                  <a href="#preguntas">Preguntas frecuentes</a>
                </li>
                <li>
                  <a href={links.contact} target="_blank" rel="noopener noreferrer">
                    Contacto<span className="sr-only"> (se abre en una pestaña nueva)</span>
                  </a>
                </li>
                <li>
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                    <Icon name="chat" size={18} />
                    WhatsApp {contact.whatsappLabel}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${contact.email}`}>
                    <Icon name="mail" size={18} />
                    <span className="break">{contact.email}</span>
                  </a>
                </li>
                <li className="site-footer__address">
                  <Icon name="pin" size={18} />
                  <span>
                    Bodega Miami
                    <br />
                    {contact.warehouse.join(', ')}
                  </span>
                </li>
                {contact.hours ? (
                  <li className="site-footer__address">
                    <Icon name="clock" size={18} />
                    <span>{contact.hours}</span>
                  </li>
                ) : null}
              </ul>
            </div>

            {groups.slice(2).map((g) => (
              <div key={g.title} className="site-footer__group">
                <h2 className="site-footer__title">{g.title}</h2>
                <ul>
                  {g.items.map((l) => (
                    <li key={l.label}>
                      <FooterLink l={l} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="site-footer__bottom">
          <p>
            © {year} {company.name}. Todos los derechos reservados.
          </p>
          <ul className="site-footer__social" aria-label="Redes sociales">
            <li>
              <a href={links.instagram} target="_blank" rel="noopener noreferrer">
                <Icon name="instagram" size={20} className="site-footer__social-icon" />
                <span className="site-footer__social-label">Instagram</span>
              </a>
            </li>
            <li>
              <a href={links.facebook} target="_blank" rel="noopener noreferrer">
                <Icon name="facebook" size={20} className="site-footer__social-icon" />
                <span className="site-footer__social-label">Facebook</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
