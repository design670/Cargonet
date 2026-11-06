import { useState } from 'react';
import { Icon } from '../components/Icon';
import { TwoToneTitle } from '../components/TwoToneTitle';
import { contact, links } from '../content/site';

/** Flujo del casillero: qué hace el cliente y qué hace CargoNet en cada paso. */
const steps = [
  {
    title: 'Crea tu casillero',
    you: 'Te registras en el portal en 2 pasos.',
    us: 'Te asignamos tu dirección en Miami con tu código personal.',
  },
  {
    title: 'Compra en la tienda',
    you: 'Compras en Amazon, eBay o la tienda que quieras y pegas tu dirección de Miami al pagar.',
    us: 'Tu dirección queda lista para recibir el paquete en nuestra bodega.',
  },
  {
    title: 'Prealerta con factura y tracking',
    you: 'Registras el tracking de la tienda y la factura donde se vea el producto y el valor.',
    us: 'Identificamos tu paquete en cuanto llega, sin demoras.',
  },
  {
    title: 'Recibimos, validamos y llevamos',
    you: 'Sigues el estado de tu envío hasta la entrega.',
    us: 'Escaneamos tu paquete, revisamos los requisitos Courier, despachamos y te avisamos en cada estado.',
  },
];

/** Anchos de barra (px) del código de barras decorativo; los impares son espacios. */
const bars = [3, 2, 1, 2, 4, 1, 1, 3, 2, 2, 4, 2, 1, 1, 3, 3, 1, 2, 2, 1, 4, 3, 1, 2, 3, 1, 1, 4, 2, 2, 1, 3, 3, 2, 1, 1, 4, 1, 2, 3, 1, 2, 3, 2, 1, 4, 2, 1, 1, 3, 2, 3, 4, 1, 1, 2, 3, 2];

/** Dirección de la bodega en formato postal de EE.UU. */
const street = contact.warehouse[0].replace(' 50 ', ' 50th ');
const cityLine = contact.warehouse[1].replace('Florida', 'FL');

/* Extremos altos para que las banderas queden por encima de la etiqueta */
const ROUTE = 'M24 88 C 170 -24, 430 -24, 576 80';

/** Sección "Casillero virtual": pasos + etiqueta de envío con la dirección de Miami. */
export function Locker() {
  const [reduceMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  let x = 0;
  const rects = bars.map((w, i) => {
    const r = i % 2 === 0 ? <rect key={i} x={x} y={0} width={w} height={60} /> : null;
    x += w;
    return r;
  });

  return (
    <section id="casillero" className="locker" aria-labelledby="locker-title">
      <div className="container locker__grid">
        <div className="locker__copy">
          <h2 id="locker-title" className="h2 locker__title" data-reveal>
            <TwoToneTitle light="Tu dirección en" bold="Miami, lista en" accent="minutos." />
          </h2>
          <p className="locker__lead" data-reveal>
            Compra en cualquier tienda de EE.UU. con tu código personal. Nosotros lo recibimos y te lo llevamos a Colombia.
          </p>

          <a className="btn btn--primary locker__cta" href={links.register} target="_blank" rel="noopener noreferrer">
            Crear mi casillero
            <Icon name="arrowRight" size={18} className="btn__icon" />
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        </div>

        <div className="locker__visual" data-reveal>
          {/* Ruta Miami → Colombia (decorativa) */}
          <svg className="locker__route" viewBox="0 0 600 150" aria-hidden="true">
            <defs>
              <clipPath id="lk-flag">
                <circle r="17" />
              </clipPath>
            </defs>
            <path className="locker__route-line" d={ROUTE} />
            <g className="locker__plane" transform={reduceMotion ? 'translate(300 34)' : undefined}>
              <path d="M12 0 L-6 -7 L-3 0 L-6 7 Z" />
              {reduceMotion ? null : <animateMotion dur="7s" repeatCount="indefinite" rotate="auto" path={ROUTE} />}
            </g>

            {/* Bandera de EE.UU. (Miami) */}
            <g className="locker__flag" transform="translate(24 88)">
              <g clipPath="url(#lk-flag)">
                {Array.from({ length: 13 }, (_, i) => (
                  <rect key={i} x={-17} y={-17 + (i * 34) / 13} width={34} height={34 / 13 + 0.2} fill={i % 2 ? '#fff' : '#b22234'} />
                ))}
                <rect x={-17} y={-17} width={18} height={(34 / 13) * 7} fill="#3c3b6e" />
                {[-12, -7, -2].flatMap((cx) => [-12, -7, -2].map((cy) => <circle key={`${cx}${cy}`} cx={cx} cy={cy} r={1} fill="#fff" />))}
              </g>
              <circle r="17" className="locker__flag-ring" />
            </g>

            {/* Bandera de Colombia */}
            <g className="locker__flag" transform="translate(576 80)">
              <g clipPath="url(#lk-flag)">
                <rect x={-17} y={-17} width={34} height={17} fill="#fcd116" />
                <rect x={-17} y={0} width={34} height={8.5} fill="#003893" />
                <rect x={-17} y={8.5} width={34} height={8.5} fill="#ce1126" />
              </g>
              <circle r="17" className="locker__flag-ring" />
            </g>
          </svg>

          {/* Caja de cartón detrás de la etiqueta */}
          <div className="locker__box" aria-hidden="true">
            <span className="locker__tape" />
          </div>

          <figure className="label" aria-label="Ejemplo de cómo se ve tu dirección de casillero en Miami">
            <div className="label__top">
              <img src="/img/logo-cargonet.png" alt="CargoNet USA" className="label__logo" />
              <span className="label__code">MIA</span>
            </div>
            <div className="label__mid">
              <div className="label__to">
                <p className="label__caption">Enviar a · Ship to</p>
                <p className="label__name">Tu Nombre</p>
                <p>
                  {street} <mark>CNU-00000</mark>
                </p>
                <p>{cityLine}</p>
                <p>United States</p>
              </div>
              <div className="label__dest">
                <strong>CO</strong>
                <span>Destino</span>
              </div>
            </div>
            <div className="label__bottom" aria-hidden="true">
              <svg viewBox={`0 0 ${x} 60`} preserveAspectRatio="none" className="label__barcode">
                {rects}
              </svg>
              <p>CNU 00000 MIA BOG</p>
            </div>
          </figure>
        </div>

        {/* Flujo de 4 pasos: qué haces tú y qué hace CargoNet */}
        <ol className="locker__flow">
          {steps.map((s, i) => (
            <li key={s.title} className="locker__card" data-reveal>
              <span className="locker__num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3>{s.title}</h3>
              <dl className="locker__who">
                <div>
                  <dt>Tú</dt>
                  <dd>{s.you}</dd>
                </div>
                <div>
                  <dt>CargoNet</dt>
                  <dd>{s.us}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
