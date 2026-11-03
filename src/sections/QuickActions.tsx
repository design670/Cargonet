import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { TwoToneTitle } from '../components/TwoToneTitle';
import { Icon, type IconName } from '../components/Icon';
import { PrealertTab } from './quick-tools/PrealertTab';
import { QuoteTab } from './quick-tools/QuoteTab';
import { TrackTab } from './quick-tools/TrackTab';

type Tab = 'quote' | 'track' | 'prealert';

const tabs: { id: Tab; label: string; icon: IconName }[] = [
  { id: 'quote', label: 'Cotizar', icon: 'calculator' },
  { id: 'track', label: 'Rastrear', icon: 'search' },
  { id: 'prealert', label: 'Prealertar', icon: 'bell' },
];

/** Tiendas de la franja animada detrás del panel (logos de Wikimedia Commons en public/img/tiendas). */
const stores: { id: string; name: string }[] = [
  { id: 'ebay', name: 'eBay' },
  { id: 'walmart', name: 'Walmart' },
  { id: 'bestbuy', name: 'Best Buy' },
  { id: 'nike', name: 'Nike' },
  { id: 'sephora', name: 'Sephora' },
  { id: 'target', name: 'Target' },
  { id: 'apple', name: 'Apple' },
  { id: 'costco', name: 'Costco' },
  { id: 'shein', name: 'Shein' },
  { id: 'macys', name: "Macy's" },
  { id: 'bh', name: 'B&H' },
];

/** Enlaces que abren directamente la pestaña Cotizar. */
export const QUOTE_ANCHOR = '#cotizar-envio';

/** Sección "Cotiza o rastrea tu envío": pestañas Cotizar / Rastrear / Prealertar. */
export function QuickActions() {
  const [tab, setTab] = useState<Tab>('quote');
  const tabRefs = useRef<Record<Tab, HTMLButtonElement | null>>({ quote: null, track: null, prealert: null });

  // Si se llega desde un botón de cotización, abrir "Cotizar".
  useEffect(() => {
    const openQuote = () => {
      if (window.location.hash === QUOTE_ANCHOR) setTab('quote');
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.(`a[href="${QUOTE_ANCHOR}"]`);
      if (a) setTab('quote');
    };
    openQuote();
    window.addEventListener('hashchange', openQuote);
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('hashchange', openQuote);
      document.removeEventListener('click', onClick);
    };
  }, []);

  const onKey = (e: KeyboardEvent) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const i = tabs.findIndex((t) => t.id === tab);
    const next =
      e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    setTab(tabs[next].id);
    tabRefs.current[tabs[next].id]?.focus();
  };

  return (
    <section id="herramientas" className="quick tq" aria-labelledby="quick-title">
      {/* Franja de tiendas: se ve a los lados del panel, sobre el borde inferior del hero */}
      <div className="qt-stores">
        <p className="sr-only">Compra en tiendas de EE.UU. como {stores.map((s) => s.name).join(', ')}.</p>
        <div className="qt-stores__track" aria-hidden="true">
          {[0, 1].map((copy) => (
            <ul key={copy} className="qt-stores__list">
              {stores.map((s) => (
                <li key={s.id}>
                  <img className={`qt-stores__logo qt-stores__logo--${s.id}`} src={`/img/tiendas/${s.id}.svg`} alt="" loading="lazy" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <div className="container">
        <div className="qt" id="cotizar-envio">
          <h2 id="quick-title" className="qt__title" data-reveal>
            <TwoToneTitle light="Cotiza o" bold="rastrea tu" accent="envío." />
          </h2>

          <div className="qt__tabs" role="tablist" aria-label="Cotizar, rastrear o prealertar" onKeyDown={onKey}>
            {tabs.map((t) => (
              <button
                key={t.id}
                ref={(el) => {
                  tabRefs.current[t.id] = el;
                }}
                type="button"
                role="tab"
                id={`qt-tab-${t.id}`}
                aria-selected={tab === t.id}
                aria-controls={`qt-panel-${t.id}`}
                tabIndex={tab === t.id ? 0 : -1}
                className={tab === t.id ? 'qt__tab is-active' : 'qt__tab'}
                onClick={() => setTab(t.id)}
              >
                <Icon name={t.icon} size={18} />
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* Los paneles permanecen montados para conservar los datos al cambiar de pestaña */}
          {tabs.map((t) => (
            <div key={t.id} role="tabpanel" id={`qt-panel-${t.id}`} aria-labelledby={`qt-tab-${t.id}`} hidden={tab !== t.id} className="qt__body">
              {t.id === 'quote' ? <QuoteTab /> : t.id === 'track' ? <TrackTab /> : <PrealertTab />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
