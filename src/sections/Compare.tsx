import { Icon } from '../components/Icon';
import { TwoToneTitle } from '../components/TwoToneTitle';
import { courier } from '../lib/courier-rates';

const usd = (n: number) => `US$${n.toFixed(2)}`;

const direct = [
  'Muchas tiendas no envían a Colombia o cobran envíos de US$50 o más',
  'Pagas un envío internacional por cada paquete',
  'No sabes cuánto vas a pagar en impuestos',
  'Si hay un problema, nadie te responde en español',
];

const withLocker = [
  'Cualquier tienda de EE.UU. te envía a tu dirección en Miami',
  `Tarifa clara por libra: ${usd(courier.ratePerLb)} de 1 a 8 lb y ${usd(courier.ratePerLbFrom9)} desde 9 lb`,
  'Cotización estimada con impuestos y requisitos Courier validados',
  'Te avisamos en cada estado y un asesor revisa cualquier novedad',
];

/** Aliados logísticos (logos en public/img/aliados). */
const partners = [
  { id: 'fedex', name: 'FedEx' },
  { id: 'dhl', name: 'DHL' },
  { id: 'latam', name: 'LATAM Airlines' },
  { id: 'servientrega', name: 'Servientrega' },
  { id: 'coordinadora', name: 'Coordinadora' },
];

/** Sección "Sabes qué esperar antes de enviar": comparación + aliados (antes de testimonios). */
export function Compare() {
  return (
    <section id="por-que-cargonet" className="compare" aria-labelledby="compare-title">
      <div className="container">
        <h2 id="compare-title" className="h2 compare__title" data-reveal>
          <TwoToneTitle light="Sabes qué esperar" bold="antes de" accent="enviar." />
        </h2>

        <div className="compare__grid">
          <div className="compare__card" data-reveal>
            <h3>Comprando directo al exterior</h3>
            <ul>
              {direct.map((t) => (
                <li key={t}>
                  <Icon name="close" size={18} className="compare__mark" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="compare__card compare__card--ours" data-reveal>
            <span className="compare__badge">Recomendado</span>
            <h3>Con tu casillero CargoNet</h3>
            <ul>
              {withLocker.map((t) => (
                <li key={t}>
                  <Icon name="check" size={18} className="compare__mark" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <h3 className="compare__partners-title" data-reveal>
          Nuestros aliados
        </h3>
        <ul className="compare__partners" data-reveal>
          {partners.map((p) => (
            <li key={p.id}>
              <img src={`/img/aliados/${p.id}.svg`} alt={p.name} className={`compare__logo compare__logo--${p.id}`} loading="lazy" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
