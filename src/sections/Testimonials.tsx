import { useEffect, useRef } from 'react';
import { Icon } from '../components/Icon';
import { SectionHeading } from '../components/SectionHeading';
import { TwoToneTitle } from '../components/TwoToneTitle';

// Testimonios de ejemplo (inventados) hasta que CargoNet envíe los reales. Ver PENDIENTES.md.
type Person = { name: string; place: string; initials: string };
type Testimonial =
  | { kind: 'chat'; person: Person; quote: string; reply: string }
  | { kind: 'photo'; person: Person; quote: string; image: string }
  | { kind: 'stats'; person: Person; quote: string; stats: { value: string; label: string }[] };

const testimonials: Testimonial[] = [
  {
    kind: 'chat',
    person: { name: 'Laura Méndez', place: 'Compradora frecuente, Bogotá', initials: 'LM' },
    quote: 'Compré en tres tiendas distintas y todo llegó junto a mi casillero. Me avisaron cada paso.',
    reply: '¡Gracias, Laura! Nos alegra que tu compra llegara completa.',
  },
  {
    kind: 'photo',
    person: { name: 'Andrés Castillo', place: 'Importador, Barranquilla', initials: 'AC' },
    quote: 'Mis cajas llegan bien embaladas y con la información clara desde Miami hasta mi bodega.',
    image: '/img/servicio-casillero.webp',
  },
  {
    kind: 'stats',
    person: { name: 'Carolina Ruiz', place: 'Tienda en línea, Medellín', initials: 'CR' },
    quote: 'Traigo inventario cada mes. Cotizar es rápido y siempre sé cuánto voy a pagar antes de enviar.',
    stats: [
      { value: '24', label: 'Envíos al año' },
      { value: '5', label: 'Tiendas distintas' },
    ],
  },
  {
    kind: 'chat',
    person: { name: 'Jorge Pineda', place: 'Cliente de casillero, Cali', initials: 'JP' },
    quote: 'Tenía dudas con la prealerta y un asesor me guio por WhatsApp en minutos.',
    reply: 'Para eso estamos, Jorge. ¡Feliz compra!',
  },
  {
    kind: 'photo',
    person: { name: 'Mariana Torres', place: 'Emprendedora, Cartagena', initials: 'MT' },
    quote: 'Exporté mis primeros productos con su acompañamiento. Todo el proceso fue claro.',
    image: '/img/servicio-import-export.webp',
  },
  {
    kind: 'stats',
    person: { name: 'Felipe Ortega', place: 'Repuestos automotrices, Bucaramanga', initials: 'FO' },
    quote: 'La tarifa fue la que nos cotizaron y la carga llegó en el tiempo acordado.',
    stats: [
      { value: '+40%', label: 'Más pedidos atendidos' },
      { value: '8 días', label: 'Tiempo promedio' },
    ],
  },
];

const SPEED = 40; // px por segundo

function Author({ person }: { person: Person }) {
  return (
    <footer className="tm-card__author">
      <span className="tm-card__avatar" aria-hidden="true">
        {person.initials}
      </span>
      <span>
        <strong>{person.name}</strong>
        <small>{person.place}</small>
      </span>
    </footer>
  );
}

function Card({ t }: { t: Testimonial }) {
  if (t.kind === 'photo') {
    return (
      <figure className="tm-card tm-card--photo">
        <img src={t.image} alt="" loading="lazy" decoding="async" />
        <blockquote>{t.quote}</blockquote>
        <figcaption>
          <strong>{t.person.name}</strong>
          <small>{t.person.place}</small>
        </figcaption>
      </figure>
    );
  }
  return (
    <figure className={`tm-card tm-card--${t.kind}`}>
      {t.kind === 'chat' ? (
        <>
          <blockquote className="tm-card__bubble">{t.quote}</blockquote>
          <p className="tm-card__bubble tm-card__bubble--reply">
            <span className="sr-only">Respuesta de CargoNet: </span>
            {t.reply}
          </p>
        </>
      ) : (
        <>
          <blockquote className="tm-card__quote">{t.quote}</blockquote>
          <dl className="tm-card__stats">
            {t.stats.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </>
      )}
      <Author person={t.person} />
    </figure>
  );
}

export function Testimonials() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const state = useRef({ offset: 0, paused: false, visible: false, nudge: 0 });

  // Desplazamiento continuo; el contenido va duplicado y el offset se envuelve para que sea infinito.
  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const io = new IntersectionObserver(([e]) => (state.current.visible = e.isIntersecting));
    io.observe(viewport);

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const s = state.current;
      const dt = Math.min(now - last, 64) / 1000;
      last = now;
      const half = track.scrollWidth / 2;
      if (s.nudge !== 0) {
        const step = s.nudge * Math.min(1, dt * 8);
        s.offset += step;
        s.nudge -= step;
        if (Math.abs(s.nudge) < 0.5) s.nudge = 0;
      } else if (!s.paused && s.visible && !reduce.matches) {
        s.offset += SPEED * dt;
      }
      if (half > 0) s.offset = ((s.offset % half) + half) % half;
      track.style.transform = `translate3d(${-s.offset}px,0,0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  const move = (dir: 1 | -1) => {
    const card = trackRef.current?.querySelector('li');
    const gap = trackRef.current ? parseFloat(getComputedStyle(trackRef.current).columnGap) || 0 : 0;
    if (card) state.current.nudge += dir * (card.getBoundingClientRect().width + gap);
  };
  const pause = (paused: boolean) => () => (state.current.paused = paused);

  return (
    <section className="section tm" aria-labelledby="tm-title">
      <div className="container">
        <SectionHeading
          id="tm-title"
          align="center"
          title={<TwoToneTitle light="Lo que dicen" bold="nuestros" accent="clientes." />}
          intro="Experiencias de personas y empresas que envían con CargoNet USA."
        />
      </div>
      <div
        ref={viewportRef}
        className="tm__viewport"
        onMouseEnter={pause(true)}
        onMouseLeave={pause(false)}
        onFocus={pause(true)}
        onBlur={pause(false)}
      >
        <ul ref={trackRef} className="tm__track">
          {[...testimonials, ...testimonials].map((t, i) => (
            <li key={i} aria-hidden={i >= testimonials.length ? true : undefined}>
              <Card t={t} />
            </li>
          ))}
        </ul>
      </div>
      <div className="container tm__nav">
        <button type="button" className="tm__btn" onClick={() => move(-1)} aria-label="Testimonio anterior">
          <Icon name="chevronLeft" size={18} />
        </button>
        <button type="button" className="tm__btn" onClick={() => move(1)} aria-label="Testimonio siguiente">
          <Icon name="chevronRight" size={18} />
        </button>
      </div>
    </section>
  );
}
