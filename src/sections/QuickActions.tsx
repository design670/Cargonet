import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { TwoToneTitle } from '../components/TwoToneTitle';
import { Icon, type IconName } from '../components/Icon';
import { QuotePanel } from './track-quote/QuotePanel';
import { TrackPanel } from './track-quote/TrackPanel';

type Tab = 'track' | 'quote';

const tabs: { id: Tab; label: string; icon: IconName }[] = [
  { id: 'track', label: 'Rastrear', icon: 'search' },
  { id: 'quote', label: 'Cotizar', icon: 'calculator' },
];

/** Enlaces que abren directamente la pestaña Cotizar. */
export const QUOTE_ANCHOR = '#cotizar-envio';


/** Sección "Cotiza o rastrea tu envío": panel con pestañas + accesos secundarios. */
export function QuickActions() {
  const [tab, setTab] = useState<Tab>('track');
  const tabRefs = useRef<Record<Tab, HTMLButtonElement | null>>({ track: null, quote: null });

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
      <div className="container">
        <div className="quick__panel tq__panel" id="cotizar-envio">
          <div className="tq__head" data-reveal>
            <h2 id="quick-title" className="quick__title tq__title">
              <TwoToneTitle light="Cotiza o" bold="rastrea tu" accent="envío." />
            </h2>
          </div>

          <div className="tq__tabs" role="tablist" aria-label="Rastrear o cotizar" onKeyDown={onKey}>
            {tabs.map((t) => (
              <button
                key={t.id}
                ref={(el) => {
                  tabRefs.current[t.id] = el;
                }}
                type="button"
                role="tab"
                id={`tq-tab-${t.id}`}
                aria-selected={tab === t.id}
                aria-controls={`tq-panel-${t.id}`}
                tabIndex={tab === t.id ? 0 : -1}
                className={tab === t.id ? 'tq__tab is-active' : 'tq__tab'}
                onClick={() => setTab(t.id)}
              >
                <Icon name={t.icon} size={20} />
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* Ambos paneles permanecen montados para conservar los datos al cambiar de pestaña */}
          <div role="tabpanel" id="tq-panel-track" aria-labelledby="tq-tab-track" hidden={tab !== 'track'} className="tq__panelbody">
            <TrackPanel />
          </div>
          <div role="tabpanel" id="tq-panel-quote" aria-labelledby="tq-tab-quote" hidden={tab !== 'quote'} className="tq__panelbody">
            <QuotePanel />
          </div>
        </div>

      </div>
    </section>
  );
}
