import { TwoToneTitle } from '../components/TwoToneTitle';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '../components/Icon';
import { SectionHeading } from '../components/SectionHeading';
import { links } from '../content/site';

type Service = {
  id: string;
  title: string;
  tagline: string;
  text: string;
  /** Versión breve para tarjetas anchas (tablet y desktop). */
  short: string;
  cta: string;
  href: string;
  image: string;
  alt: string;
};

const services: Service[] = [
  {
    id: 'importacion',
    title: 'Importación',
    tagline: 'Trae tu mercancía desde otros países.',
    text: 'Te acompañamos en la gestión de envíos desde otros países, por courier o carga, con orientación sobre los requisitos y la documentación que corresponda a cada operación.',
    short: 'Envíos desde otros países, con orientación sobre requisitos y documentación.',
    cta: 'Cotizar importación',
    href: '#cotizar-envio',
    image: '/img/servicio-carga.webp',
    alt: 'Puerto de contenedores con grúas cargando un buque al atardecer',
  },
  {
    id: 'exportacion',
    title: 'Exportación',
    tagline: 'Lleva tu mercancía a mercados internacionales.',
    text: 'Gestionamos envíos hacia otros países, por courier o carga, sujetos a las condiciones, restricciones y requisitos aplicables a cada mercancía y destino.',
    short: 'Envíos hacia otros países según las condiciones de cada mercancía y destino.',
    cta: 'Cotizar exportación',
    href: '#cotizar-envio',
    image: '/img/servicio-import-export.webp',
    alt: 'Vista aérea de un patio de contenedores con una grúa de carga',
  },
  {
    id: 'casillero',
    title: 'Casillero virtual en Estados Unidos',
    tagline: 'Tus compras en Estados Unidos, más fáciles de gestionar.',
    text: 'Compra en tus tiendas favoritas y utiliza tu casillero CargoNet USA para recibir tus paquetes en nuestra bodega. Registra tus compras, adjunta la factura y el tracking, y consulta su proceso de recepción y envío.',
    short: 'Recibe tus compras en nuestra bodega de Miami y sigue su proceso de envío.',
    cta: 'Obtener mi casillero',
    href: links.register,
    image: '/img/servicio-casillero.webp',
    alt: 'Pasillo de bodega con estanterías altas llenas de cajas',
  },
];

export function Services() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [progress, setProgress] = useState(0);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= max - 4);
    const visible = el.clientWidth / el.scrollWidth;
    setProgress(max > 0 ? visible + (el.scrollLeft / max) * (1 - visible) : 1);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [update]);

  const move = (dir: 1 | -1) => {
    const el = trackRef.current;
    const card = el?.querySelector<HTMLElement>('.services__slide');
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <section id="servicios" className="section services" aria-labelledby="services-title">
      <div className="container">
        <div className="services__head">
          <SectionHeading
            id="services-title"
            title={<TwoToneTitle light="Soluciones logísticas" bold="para cada" accent="necesidad." />}
            intro="Ya sea que quieras recibir tus compras internacionales o transportar mercancía para tu empresa, en CargoNet USA encontrarás alternativas de envío adaptadas a tus necesidades."
          />
          <div className="carousel-nav" data-reveal>
            <button
              type="button"
              className="carousel-nav__btn"
              onClick={() => move(-1)}
              disabled={atStart}
              aria-controls="services-track"
            >
              <Icon name="arrowRight" size={20} className="carousel-nav__prev" />
              <span className="sr-only">Servicio anterior</span>
            </button>
            <button
              type="button"
              className="carousel-nav__btn"
              onClick={() => move(1)}
              disabled={atEnd}
              aria-controls="services-track"
            >
              <Icon name="arrowRight" size={20} />
              <span className="sr-only">Servicio siguiente</span>
            </button>
          </div>
        </div>
      </div>

      <div className="services__viewport" data-reveal>
        <ul
          id="services-track"
          ref={trackRef}
          className="services__track"
          role="region"
          aria-roledescription="carrusel"
          aria-label="Servicios de CargoNet USA"
          tabIndex={0}
        >
          {services.map((s, i) => (
            <li key={s.id} className="services__slide" aria-roledescription="diapositiva" aria-label={`${i + 1} de ${services.length}`}>
              <article id={s.id} className="service-card" aria-labelledby={`${s.id}-title`}>
                <img className="service-card__img" src={s.image} alt={s.alt} width="1100" height="820" loading="lazy" decoding="async" />
                <div className="service-card__frost">
                  <div className="service-card__panel">
                    <h3 id={`${s.id}-title`} className="service-card__title">
                      {s.title}
                    </h3>
                    <p className="service-card__tagline">{s.tagline}</p>
                    <p className="service-card__text">
                      <span className="service-card__text-long">{s.text}</span>
                      <span className="service-card__text-short">{s.short}</span>
                    </p>
                    <a className="service-card__cta" href={s.href}>
                      <span>{s.cta}</span>
                      <span className="service-card__cta-icon" aria-hidden="true">
                        <Icon name="arrowRight" size={18} />
                      </span>
                    </a>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>

      <div className="container">
        <div className="carousel-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>
      </div>
    </section>
  );
}
