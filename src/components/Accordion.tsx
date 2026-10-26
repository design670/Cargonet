import { useId, useState, type ReactNode } from 'react';
import { Icon } from './Icon';

export type AccordionItem = { question: string; answer: ReactNode };

/** Acordeón accesible: botones con aria-expanded y regiones asociadas. */
export function Accordion({ items, headingLevel = 3 }: { items: AccordionItem[]; headingLevel?: 3 | 4 }) {
  const base = useId();
  const [open, setOpen] = useState<number | null>(0);
  const Heading = `h${headingLevel}` as 'h3' | 'h4';

  return (
    <div className="accordion">
      {items.map((item, i) => {
        const expanded = open === i;
        const btnId = `${base}-b${i}`;
        const panelId = `${base}-p${i}`;
        return (
          <div className={['accordion__item', expanded && 'is-open'].filter(Boolean).join(' ')} key={item.question}>
            <Heading className="accordion__heading">
              <button
                type="button"
                id={btnId}
                className="accordion__trigger"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpen(expanded ? null : i)}
              >
                <span>{item.question}</span>
                <span className="accordion__icon" aria-hidden="true">
                  <Icon name="plus" size={20} />
                </span>
              </button>
            </Heading>
            <div id={panelId} role="region" aria-labelledby={btnId} className="accordion__panel" hidden={!expanded}>
              <div className="accordion__content">{item.answer}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
