import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { Icon, type IconName } from '../components/Icon';
import { links } from '../content/site';

/**
 * Recorrido de pasos estilo carrusel (solo tablet/desktop; en móvil se usa
 * la lista vertical original). Navegación manual: flechas, píldoras, teclado,
 * clic en la tarjeta lateral o arrastre. No avanza solo ni captura el scroll.
 */
type Step = {
  title: string;
  text: string;
  icon: IconName;
  phase: 'Antes de Miami' | 'Desde Miami';
  cta?: { label: string; href: string; external?: boolean };
};

const steps: Step[] = [
  {
    title: 'Crea tu casillero',
    text: 'Regístrate en CargoNet USA y obtén los datos de tu casillero para recibir tus compras en Estados Unidos.',
    icon: 'locker',
    phase: 'Antes de Miami',
    cta: { label: 'Crear mi casillero', href: links.register },
  },
  {
    title: 'Realiza tu compra y prealerta el paquete',
    text: 'Compra en la tienda de tu preferencia y registra tu envío en el portal. Adjunta la factura y el número de tracking.',
    icon: 'clipboard',
    phase: 'Antes de Miami',
    cta: { label: 'Registrar prealerta', href: links.prealert },
  },
  {
    title: 'Seguimiento de la transportadora de origen',
    text: 'Consulta el tracking de tu compra para confirmar cuándo ha sido entregada en nuestra bodega de Miami.',
    icon: 'route',
    phase: 'Antes de Miami',
  },
  {
    title: 'Recepción y validación',
    text: 'Se verifica la identificación del paquete y se revisa la documentación y las condiciones del servicio contratado.',
    icon: 'shield',
    phase: 'Desde Miami',
    cta: { label: 'Ver requisitos', href: links.requirementsPdf, external: true },
  },
  {
    title: 'Transporte internacional',
    text: 'Tu paquete continúa el proceso logístico. Consulta los estados y novedades que se registren en el sistema.',
    icon: 'plane',
    phase: 'Desde Miami',
    cta: { label: 'Rastrear mi envío', href: links.tracking },
  },
  {
    title: 'Despacho y entrega',
    text: 'Cuando complete las etapas operativas y las validaciones necesarias, el envío continúa hacia su despacho y entrega.',
    icon: 'pin',
    phase: 'Desde Miami',
  },
];

const pad = (n: number) => String(n).padStart(2, '0');

export function StepsCarousel() {
  const [active, setActive] = useState(0);
  const startX = useRef<number | null>(null);
  const total = steps.length;
  const rootRef = useRef<HTMLDivElement>(null);
  const pinned = useRef(false);

  /*
   * Modo fijo por scroll (tablet/desktop con altura suficiente y sin
   * reducción de movimiento): la sección queda fija y el scroll avanza
   * los pasos. Al terminar el último paso la página continúa.
   */
  useEffect(() => {
    const pin = rootRef.current?.closest<HTMLElement>('.how__pin');
    if (!pin) return;
    const mq = window.matchMedia('(min-width: 700px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)');

    const onScroll = () => {
      if (!pinned.current) return;
      const range = pin.offsetHeight - window.innerHeight;
      const progress = Math.min(1, Math.max(0, -pin.getBoundingClientRect().top / range));
      const i = Math.min(total - 1, Math.floor(progress * total));
      setActive((prev) => (prev === i ? prev : i));
      pin.style.setProperty('--progress', String(progress));
    };

    const apply = () => {
      pinned.current = mq.matches;
      pin.classList.toggle('is-pinned', mq.matches);
      pin.style.setProperty('--steps', String(total));
      onScroll();
    };

    apply();
    mq.addEventListener('change', apply);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      mq.removeEventListener('change', apply);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      pin.classList.remove('is-pinned');
    };
  }, [total]);

  const go = (i: number) => {
    const n = Math.max(0, Math.min(total - 1, i));
    const pin = rootRef.current?.closest<HTMLElement>('.how__pin');
    if (pinned.current && pin) {
      // En modo fijo, los controles mueven el scroll hasta ese paso.
      const range = pin.offsetHeight - window.innerHeight;
      const top = pin.getBoundingClientRect().top + window.scrollY + ((n + 0.5) / total) * range;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setActive(n);
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1); }
  };
  const onDown = (e: PointerEvent) => { startX.current = e.clientX; };
  const onUp = (e: PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 50) go(active + (dx < 0 ? 1 : -1));
  };

  return (
    <div
      ref={rootRef}
      className="steps-carousel"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Pasos del servicio"
      onKeyDown={onKey}
      style={{ ['--i' as string]: active }}
    >
      <div className="steps-carousel__viewport" onPointerDown={onDown} onPointerUp={onUp} onPointerCancel={() => (startX.current = null)}>
        <ol className="steps-carousel__track">
          {steps.map((s, i) => {
            const isActive = i === active;
            return (
              <li
                key={s.title}
                className={['sc-card', isActive && 'is-active', s.phase === 'Desde Miami' && 'sc-card--cargonet'].filter(Boolean).join(' ')}
                aria-roledescription="paso"
                aria-label={`Paso ${i + 1} de ${total}`}
                aria-current={isActive ? 'step' : undefined}
                onClick={() => !isActive && go(i)}
                onFocus={() => !isActive && go(i)}
              >
                <span className="sc-card__bignum" aria-hidden="true">
                  {pad(i + 1)}
                </span>
                <div className="sc-card__head">
                  <span className="sc-card__icon" aria-hidden="true">
                    <Icon name={s.icon} size={24} />
                  </span>
                  <p className="sc-card__step">Paso {pad(i + 1)}</p>
                  <span className="sc-card__phase">{s.phase}</span>
                </div>
                <h3 className="sc-card__title">{s.title}</h3>
                <p className="sc-card__text">{s.text}</p>
                {s.cta ? (
                  <a
                    className="sc-card__cta"
                    href={s.cta.href}
                    tabIndex={isActive ? 0 : -1}
                    target={s.cta.external ? '_blank' : undefined}
                    rel={s.cta.external ? 'noopener noreferrer' : undefined}
                  >
                    {s.cta.label}
                    <Icon name={s.cta.external ? 'arrowUpRight' : 'arrowRight'} size={16} />
                    {s.cta.external ? <span className="sr-only"> (PDF, se abre en una pestaña nueva)</span> : null}
                  </a>
                ) : null}
              </li>
            );
          })}
        </ol>

      </div>

      {/* Ruta lineal: un punto por paso y el paquete que avanza */}
      <div className="sc-route" aria-hidden="true" style={{ ['--p' as string]: active / (total - 1) }}>
        <div className="sc-route__line">
          <span className="sc-route__fill" />
          {steps.map((s, i) => (
            <span key={s.title} className={['sc-route__node', i <= active && 'is-done', i === active && 'is-current'].filter(Boolean).join(' ')} style={{ left: `${(i / (total - 1)) * 100}%` }} />
          ))}
          <span className="sc-route__parcel">
            <Icon name="package" size={20} />
          </span>
        </div>
        <div className="sc-route__ends">
          <span>Tu compra</span>
          <span>Entrega</span>
        </div>
      </div>

      <div className="steps-carousel__controls">
        <button type="button" className="sc-arrow" onClick={() => go(active - 1)} disabled={active === 0}>
          <Icon name="arrowRight" size={18} className="sc-arrow__prev" />
          <span className="sr-only">Paso anterior</span>
        </button>
        <div className="sc-pills">
          {steps.map((s, i) => (
            <button
              key={s.title}
              type="button"
              className={['sc-pill', i === active && 'is-active'].filter(Boolean).join(' ')}
              aria-label={`Ir al paso ${i + 1}: ${s.title}`}
              aria-pressed={i === active}
              onClick={() => go(i)}
            >
              <span className="sc-pill__dot" aria-hidden="true" />
              {pad(i + 1)}
            </button>
          ))}
        </div>
        <button type="button" className="sc-arrow" onClick={() => go(active + 1)} disabled={active === total - 1}>
          <Icon name="arrowRight" size={18} />
          <span className="sr-only">Paso siguiente</span>
        </button>
      </div>
      <div className={['sc-scroll-hint', active === total - 1 && 'is-last'].filter(Boolean).join(' ')} aria-hidden="true">
        <span className="sc-scroll-hint__mouse" />
        <span className="sc-scroll-hint__text">{active === total - 1 ? 'Sigue bajando' : 'Baja para avanzar los pasos'}</span>
      </div>
      <p className="sr-only" aria-live="polite">
        Paso {active + 1} de {total}: {steps[active].title}
      </p>
    </div>
  );
}
