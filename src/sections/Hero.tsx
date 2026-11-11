import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { links } from '../content/site';

/**
 * Escena del hero en escritorio (≥1080px): barco, avión y camión a todo el ancho y alto.
 * La foto se muestra de inmediato; el video animado (Kling 4.0, 10 s en bucle) se carga encima
 * solo en escritorio y si el usuario no pidió reducir el movimiento.
 */
const HERO_IMAGE = "/img/hero-transporte-2000.jpg";
const HERO_VIDEO = "/video/hero-transporte.mp4";
const VIDEO_QUERY = "(min-width: 1080px) and (prefers-reduced-motion: no-preference)";

function useHeroVideo() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(VIDEO_QUERY);
    const update = () => setShow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return show;
}

export function Hero() {
  const showVideo = useHeroVideo();
  const [videoReady, setVideoReady] = useState(false);

  return (
    <section id="inicio" className="hero" aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden="true" />
      <div className={videoReady ? "hero__scene has-video" : "hero__scene"} aria-hidden="true">
        {/* Foto: solo se descarga en escritorio; en pantallas pequeñas queda un GIF vacío */}
        <picture>
          <source media="(min-width: 1080px)" srcSet={HERO_IMAGE} />
          <img
            src="data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA="
            alt=""
            width="2000"
            height="1121"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        {showVideo ? (
          <video
            className="hero__video"
            src={HERO_VIDEO}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onPlaying={() => setVideoReady(true)}
          />
        ) : null}
      </div>
      <div className="container hero__grid">
        <div className="hero__copy">
          <h1 id="hero-title" className="h1 hero__title">
            {/* Versión breve en tablet/desktop; el texto completo se mantiene en móvil */}
            <span className="hero__text-short"><strong className="hero__title-strong">Compra en USA.</strong><br />Recíbelo en Colombia.</span>
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
            {/* "Crear mi casillero" es el botón dominante; "Cotizar / rastrear" lleva al panel de herramientas */}
            <Button href={links.register} variant="light" icon="arrowRight" className="hero__cta-main">
              <span className="hero__text-short">Crear mi casillero</span>
              <span className="hero__text-long">Crear mi casillero USA</span>
            </Button>
            <Button href="#cotizar-envio" variant="outline-light" className="hero__cta-alt">
              <span className="hero__text-short">Cotizar / rastrear</span>
              <span className="hero__text-long">Cotizar un envío</span>
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
