/** Aliados logísticos (logos en public/img/aliados). */
const partners = [
  { id: 'fedex', name: 'FedEx' },
  { id: 'dhl', name: 'DHL' },
  { id: 'latam', name: 'LATAM Airlines' },
  { id: 'servientrega', name: 'Servientrega' },
  { id: 'coordinadora', name: 'Coordinadora' },
];

/** Sección "Nuestros aliados": título grande y logos (antes de testimonios). */
export function Compare() {
  return (
    <section id="aliados" className="compare" aria-labelledby="compare-title">
      <div className="container">
        <h2 id="compare-title" className="h2 compare__title" data-reveal>
          <span className="tt-light">Nuestros</span>{' '}
          <span className="tt-strong">
            <em className="tt-accent">aliados.</em>
          </span>
        </h2>

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
