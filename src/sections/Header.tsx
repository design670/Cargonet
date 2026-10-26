import { useEffect, useRef, useState } from 'react';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { contact, links, whatsappLink } from '../content/site';

/* ---------- Datos del menú ---------- */

const services = [
  { label: 'Importación', href: '#importacion' },
  { label: 'Exportación', href: '#exportacion' },
  { label: 'Casillero USA', href: '#casillero' },
];

const primaryNav = [
  { label: 'Cómo funciona', href: '#como-funciona' },
];

/* ---------- Componente ---------- */

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMega, setOpenMega] = useState<string | null>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Escape cierra menú móvil y megamenú; clic fuera cierra el megamenú.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (menuOpen) {
        setMenuOpen(false);
        menuBtn.current?.focus();
      }
      if (openMega) {
        barRef.current?.querySelector<HTMLButtonElement>(`[aria-controls="mega-${openMega}"]`)?.focus();
        setOpenMega(null);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (openMega && barRef.current && !barRef.current.contains(e.target as Node)) setOpenMega(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [menuOpen, openMega]);

  // Menú móvil: bloquea el scroll de fondo y lleva el foco al primer enlace.
  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    if (menuOpen) panelRef.current?.querySelector<HTMLElement>('a, button')?.focus();
  }, [menuOpen]);

  // Al cambiar de tamaño se cierran los menús abiertos.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1080px)');
    const onChange = () => {
      if (mq.matches) setMenuOpen(false);
      else setOpenMega(null);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const closeAll = () => {
    setMenuOpen(false);
    setOpenMega(null);
  };

  // Apertura por hover solo con mouse; teclado y táctil usan clic.
  const hoverOpen = (id: string | null) => (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setOpenMega(id), id ? 90 : 220);
  };
  const hoverKeep = () => window.clearTimeout(hoverTimer.current);


  return (
    <>
      <div className="utility-bar">
        <div className="container utility-bar__inner">
          <a className="utility-bar__contact" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
            <Icon name="chat" size={16} />
            <span>
              Asesoría por WhatsApp <span className="utility-bar__muted">{contact.whatsappLabel}</span>
            </span>
          </a>
          <ul className="utility-bar__links" aria-label="Herramientas para clientes">
            <li>
              <a href={links.tracking}>
                <Icon name="search" size={16} />
                Rastrear envío
              </a>
            </li>
            <li>
              <a href={links.login}>
                <Icon name="user" size={16} />
                Iniciar sesión
              </a>
            </li>
          </ul>
        </div>
      </div>

      <header
        className={['site-header', scrolled && 'is-scrolled', menuOpen && 'is-menu-open', openMega && 'is-mega-open']
          .filter(Boolean)
          .join(' ')}
      >
        <div className="container site-header__wrap">
          <div className="site-header__inner" ref={barRef} onPointerLeave={hoverOpen(null)} onPointerEnter={hoverKeep}>
            <a href="#inicio" className="site-header__logo" aria-label="CargoNet USA, ir al inicio" onClick={closeAll}>
              <img src="/img/logo-cargonet.png" alt="" width="270" height="77" />
            </a>


            <div className="site-header__actions">
              <a className="header-tool" href={links.login}>
                <Icon name="user" size={20} />
                <span className="header-tool__label">Iniciar sesión</span>
              </a>
              <a className="header-tool header-tool--icon header-tool--alert" href={links.prealert} title="Prealertar paquete">
                <span className="header-tool__bell" aria-hidden="true">
                  <Icon name="bell" size={20} />
                  <span className="header-tool__dot" />
                </span>
                <span className="header-tool__label">Prealertar paquete</span>
              </a>
              <Button href={links.register} className="site-header__cta">
                <span className="cta-long">Crear mi casillero</span>
                <span className="cta-short">Crear casillero</span>
              </Button>
              <button
                ref={menuBtn}
                type="button"
                className="menu-toggle"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                onClick={() => setMenuOpen((v) => !v)}
              >
                <Icon name={menuOpen ? 'close' : 'menu'} size={24} />
                <span className="sr-only">{menuOpen ? 'Cerrar menú' : 'Abrir menú'}</span>
              </button>
            </div>

          </div>
        </div>

        <div id="mobile-menu" ref={panelRef} className="mobile-menu" hidden={!menuOpen}>
          <div className="container">
            <nav aria-label="Menú móvil">
              <ul className="mobile-menu__list">
                <li>
                  <a href="#inicio" onClick={closeAll}>
                    Inicio
                  </a>
                </li>
                {services.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} onClick={closeAll}>
                      {s.label}
                    </a>
                  </li>
                ))}
                {primaryNav.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} onClick={closeAll}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <ul className="mobile-menu__tools" aria-label="Herramientas para clientes">
              <li>
                <a href={links.tracking}>
                  <Icon name="search" size={20} />
                  Rastrear envío
                </a>
              </li>
              <li>
                <a href={links.prealert}>
                  <Icon name="clipboard" size={20} />
                  Prealertar una compra
                </a>
              </li>
              <li>
                <a href={links.login}>
                  <Icon name="user" size={20} />
                  Iniciar sesión
                </a>
              </li>
            </ul>
            <Button href={links.register} block icon="arrowRight">
              Crear mi casillero
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}
