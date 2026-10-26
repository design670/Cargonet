import { Button } from '../components/Button';
import { links } from '../content/site';

export function Hero() {
  return (
    <section id="inicio" className="hero" aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden="true" />
      {/* Foto de marca a sangre (solo desktop); en pantallas pequeñas se carga un GIF vacío */}
      <picture className="hero__photo">
        <source
          media="(min-width: 1080px)"
          type="image/webp"
          srcSet="/img/hero-cargonet-1100.webp 1100w, /img/hero-cargonet-1672.webp 1672w"
          sizes="62vw"
        />
        <img
          src="data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA="
          alt="Mensajero de CargoNet USA sosteniendo una caja con el logo de la marca"
          width="1672"
          height="941"
          fetchPriority="high"
          decoding="async"
        />
      </picture>
      <div className="container hero__grid">
        <div className="hero__copy">
          <h1 id="hero-title" className="h1 hero__title">
            {/* Versión breve en tablet/desktop; el texto completo se mantiene en móvil */}
            <span className="hero__text-short">Tus compras internacionales, en buenas manos.</span>
            <span className="hero__text-long">Tus compras y envíos internacionales, con el respaldo que necesitas.</span>
          </h1>
          <p className="hero__lead">
            <span className="hero__text-short">
              Trae tus compras desde Estados Unidos y gestiona tus envíos internacionales con la seguridad, el
              acompañamiento y la experiencia de CargoNet USA. Obtén tu casillero, registra tus paquetes y consulta su
              estado en un solo lugar.
            </span>
            <span className="hero__text-long">
              Trae tus compras desde Estados Unidos, gestiona tus paquetes y consulta el estado de tus envíos con
              CargoNet USA. Te acompañamos en cada etapa con soluciones de courier y carga internacional, atención
              personalizada y tarifas competitivas.
            </span>
          </p>
          <div className="hero__ctas">
            <Button href={links.register} variant="light" icon="arrowRight">
              <span className="hero__text-short">Crear mi casillero</span>
              <span className="hero__text-long">Crear mi casillero USA</span>
            </Button>
            <Button href="#cotizar-envio" variant="outline-light">
              Cotizar un envío
            </Button>
          </div>
          <p className="hero__clients">
            <span>¿Ya tienes casillero?</span>{' '}
            <a href={links.prealert}>Prealerta tu compra</a> <span>o</span>{' '}
            <a href={links.tracking}>consulta tus envíos</a>.
          </p>
        </div>

        <figure className="hero__media">
          <picture>
            <source
              media="(max-width: 1079px)"
              type="image/webp"
              srcSet="/img/hero-carguero-900.webp 900w, /img/hero-carguero-1600.webp 1600w"
              sizes="(min-width: 1080px) 40vw, 100vw"
            />
            <img
              src="data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA="
              alt="Avión carguero en plataforma de aeropuerto con escalera de acceso, listo para operación de carga"
              width="1600"
              height="1200"
              fetchPriority="high"
              decoding="async"
            />
          </picture>

          <div className="route-card" aria-hidden="true">
            <svg className="route-card__svg" viewBox="0 0 220 64" fill="none">
              <path className="route-card__track" d="M14 50C60 6 160 6 206 50" />
              <path className="route-card__line" d="M14 50C60 6 160 6 206 50" pathLength={1} />
              <circle cx="14" cy="50" r="5" className="route-card__dot" />
              <circle cx="206" cy="50" r="5" className="route-card__dot route-card__dot--end" />
            </svg>
            <div className="route-card__labels">
              <span>Miami, FL</span>
              <span>Colombia</span>
            </div>
          </div>
        </figure>
      </div>
    </section>
  );
}
