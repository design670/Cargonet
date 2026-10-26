import { TwoToneTitle } from '../components/TwoToneTitle';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { links, whatsappLink } from '../content/site';

export function Closing() {
  return (
    <section className="closing" aria-labelledby="closing-title">
      <div className="container">
        <div className="closing__panel" data-reveal>
          <svg className="closing__route" viewBox="0 0 600 260" fill="none" aria-hidden="true">
            <path d="M-20 240C140 40 420 20 640 150" />
          </svg>
          <div className="closing__copy">
            <h2 id="closing-title" className="h2 closing__title">
              <TwoToneTitle light="Tu próximo envío comienza con una mejor forma" bold="de gestionar tu" accent="logística." />
            </h2>
            <p className="closing__text">
              Crea tu casillero, registra tus compras o solicita una cotización. En CargoNet USA te acompañamos para que
              gestiones tus envíos internacionales con mayor claridad y respaldo.
            </p>
          </div>
          <div className="closing__actions">
            <img
              className="closing__box"
              src="/img/caja-cargonet.webp"
              alt="Caja de envío con el logo de CargoNet USA"
              width="900"
              height="546"
              loading="lazy"
              decoding="async"
            />
            <Button href={links.register} variant="light" icon="arrowRight">
              Crear mi casillero
            </Button>
            <Button href="#cotizar" variant="outline-light">
              Cotizar un envío
            </Button>
            <a className="closing__link" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <Icon name="chat" size={18} />
              Hablar con un asesor
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
