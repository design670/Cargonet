import { TwoToneTitle } from '../components/TwoToneTitle';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '../components/Icon';
import { SectionHeading } from '../components/SectionHeading';
import { links, whatsappLink } from '../content/site';

type Service = {
  id: string;
  title: string;
  tagline: string;
  text: string;
  /** Versión breve para tarjetas anchas (tablet y desktop). */
  short: string;
  /** Botón que despliega el detalle dentro de la tarjeta. */
  cta: string;
  /** Modalidades del servicio (las mismas del cotizador). */
  modes: { name: string; desc: string }[];
  quote: { label: string; message: string };
  image: string;
  alt: string;
};

/** Solo importar y exportar: el casillero ya se explica en la portada y en su propia sección. */
const services: Service[] = [
  {
    id: 'importacion',
    title: 'Importación',
    tagline: 'Trae tu mercancía desde otros países.',
    text: 'Te acompañamos en la gestión de envíos desde otros países, por courier o carga, con orientación sobre los requisitos y la documentación que corresponda a cada operación.',
    short: 'Envíos desde otros países, con orientación sobre requisitos y documentación.',
    cta: 'Ver cómo importar',
    modes: [
      { name: 'Courier', desc: 'Paquetes y compras hacia Colombia.' },
      { name: 'Carga', desc: 'Mercancía que requiere gestión de carga.' },
    ],
    quote: { label: 'Cotizar importación', message: 'Hola, quiero cotizar una importación hacia Colombia.' },
    image: '/img/hero-carguero-1600.webp',
    alt: 'Avión de carga en la plataforma de un aeropuerto',
  },
  {
    id: 'exportacion',
    title: 'Exportación',
    tagline: 'Lleva tu mercancía a mercados internacionales.',
    text: 'Gestionamos envíos hacia otros países, por courier o carga, sujetos a las condiciones, restricciones y requisitos aplicables a cada mercancía y destino.',
    short: 'Envíos hacia otros países según las condiciones de cada mercancía y destino.',
    cta: 'Ver cómo exportar',
    modes: [
      { name: 'Courier', desc: 'Paquetes y documentos desde Colombia.' },
      { name: 'Carga', desc: 'Mercancía comercial hacia otros países.' },
    ],
    quote: { label: 'Cotizar exportación', message: 'Hola, quiero cotizar una exportación desde Colombia.' },
    image: '/img/servicio-carga.webp',
    alt: 'Buque de contenedores cargándose en el puerto al atardecer',
  },
];

export function Services() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState<string | null>(null);

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
            title={<TwoToneTitle light="Soluciones logísticas:" bold="Importar y" accent="Exportar" />}
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
          {services.map((s, i) => {
            const isOpen = open === s.id;
            return (
              <li key={s.id} className="services__slide" aria-roledescription="diapositiva" aria-label={`${i + 1} de ${services.length}`}>
                <article id={s.id} className={isOpen ? 'service-card is-open' : 'service-card'} aria-labelledby={`${s.id}-title`}>
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

                      {/* Detalle completo dentro de la misma tarjeta (acordeón) */}
                      <div id={`${s.id}-detalle`} className="service-card__details" aria-hidden={!isOpen} inert={!isOpen}>
                        <div className="service-card__details-inner">
                        <p className="service-card__full">{s.text}</p>
                        <ul className="service-card__modes">
                          {s.modes.map((m) => (
                            <li key={m.name}>
                              <strong>{m.name}</strong> {m.desc}
                            </li>
                          ))}
                        </ul>
                        <div className="service-card__actions">
                          <a className="btn btn--primary btn--sm" href={whatsappLink(s.quote.message)} target="_blank" rel="noopener noreferrer">
                            {s.quote.label}
                            <span className="sr-only"> (abre WhatsApp)</span>
                          </a>
                          <a className="service-card__link" href={links.requirementsPdf} target="_blank" rel="noopener noreferrer">
                            Requisitos de envío (PDF)
                            <Icon name="arrowUpRight" size={16} />
                            <span className="sr-only"> (se abre en una pestaña nueva)</span>
                          </a>
                        </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="service-card__cta"
                        aria-expanded={isOpen}
                        aria-controls={`${s.id}-detalle`}
                        onClick={() => setOpen(isOpen ? null : s.id)}
                      >
                        <span>{isOpen ? 'Ocultar detalle' : s.cta}</span>
                        <span className="service-card__cta-icon" aria-hidden="true">
                          <Icon name={isOpen ? 'close' : 'plus'} size={18} />
                        </span>
                      </button>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
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
