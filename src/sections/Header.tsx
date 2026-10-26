import { useEffect, useRef, useState } from 'react';
import { Button } from '../components/Button';
import { Icon, type IconName } from '../components/Icon';
import { contact, links, whatsappLink } from '../content/site';

/* ---------- Datos del menú ---------- */

const services = [
  { label: 'Casillero USA', href: '#casillero' },
  { label: 'Courier internacional', href: '#courier' },
  { label: 'Carga internacional', href: '#carga' },
];

const primaryNav = [
  { label: 'Soluciones para empresas', href: '#empresas' },
  { label: 'Cómo funciona', href: '#como-funciona' },
];

type MegaItem = { label: string; desc: string; href: string; icon: IconName; external?: boolean };
type MegaGroup = { title: string; items: MegaItem[] };
type Mega = { id: string; label: string; groups: MegaGroup[]; feature?: boolean };

const megaMenus: Mega[] = [
  {
    id: 'servicios',
    label: 'Servicios',
    feature: true,
    groups: [
      {
        title: 'Para personas',
        items: [
          {
            label: 'Casillero USA',
            desc: 'Tus compras en Estados Unidos, más fáciles de gestionar.',
            href: '#casillero',
            icon: 'locker',
          },
          {
            label: 'Courier internacional',
            desc: 'Una solución práctica para enviar paquetes y documentos.',
            href: '#courier',
            icon: 'package',
          },
        ],
      },
      {
        title: 'Para empresas',
        items: [
          {
            label: 'Carga internacional',
            desc: 'Carga aérea y marítima para tus necesidades comerciales.',
            href: '#carga',
            icon: 'plane',
          },
          {
            label: 'Importaciones y exportaciones',
            desc: 'Conecta tus operaciones con mercados internacionales.',
            href: '#import-export',
            icon: 'globe',
          },
          {
            label: 'Soluciones para empresas',
            desc: 'Importación de repuestos y componentes desde el exterior.',
            href: '#empresas',
            icon: 'wrench',
          },
        ],
      },
    ],
  },
  {
    id: 'herramientas',
    label: 'Herramientas',
    groups: [
      {
        title: 'Gestiona tus envíos',
        items: [
          {
            label: 'Crear mi casillero',
            desc: 'Obtén tu casillero en Estados Unidos para recibir tus compras.',
            href: links.register,
            icon: 'locker',
          },
          {
            label: 'Prealertar una compra',
            desc: 'Registra tu paquete con la factura y el número de tracking.',
            href: links.prealert,
            icon: 'clipboard',
          },
          {
            label: 'Rastrear mi envío',
            desc: 'Consulta el estado y las novedades de tu paquete.',
            href: links.tracking,
            icon: 'search',
          },
          {
            label: 'Cotizar un envío',
            desc: 'Recibe orientación sobre la alternativa adecuada.',
            href: '#cotizar',
            icon: 'calculator',
          },
        ],
      },
    ],
  },
  {
    id: 'ayuda',
    label: 'Ayuda',
    groups: [
      {
        title: 'Estamos para ayudarte',
        items: [
          {
            label: 'Preguntas frecuentes',
            desc: 'Resolvemos tus dudas antes de enviar.',
            href: '#preguntas',
            icon: 'info',
          },
          {
            label: 'Requisitos del servicio',
            desc: 'Documentos, restricciones y condiciones (PDF).',
            href: links.requirementsPdf,
            icon: 'file',
            external: true,
          },
          {
            label: 'Hablar con un asesor',
            desc: `Atención por WhatsApp ${contact.whatsappLabel}.`,
            href: whatsappLink(),
            icon: 'chat',
            external: true,
          },
        ],
      },
    ],
  },
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

  const active = megaMenus.find((m) => m.id === openMega);

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

            <nav className="main-nav" aria-label="Principal">
              <ul className="main-nav__list">
                {megaMenus.slice(0, 2).map((m) => (
                  <li key={m.id}>
                    <button
                      type="button"
                      className="main-nav__trigger"
                      aria-expanded={openMega === m.id}
                      aria-controls={`mega-${m.id}`}
                      onClick={() => setOpenMega((v) => (v === m.id ? null : m.id))}
                      onPointerEnter={hoverOpen(m.id)}
                    >
                      {m.label}
                      <Icon name="chevronDown" size={16} />
                    </button>
                  </li>
                ))}
                <li>
                  <a href="#como-funciona" onPointerEnter={hoverOpen(null)}>
                    Cómo funciona
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    className="main-nav__trigger"
                    aria-expanded={openMega === 'ayuda'}
                    aria-controls="mega-ayuda"
                    onClick={() => setOpenMega((v) => (v === 'ayuda' ? null : 'ayuda'))}
                    onPointerEnter={hoverOpen('ayuda')}
                  >
                    Ayuda
                    <Icon name="chevronDown" size={16} />
                  </button>
                </li>
              </ul>
            </nav>

            <div className="site-header__actions">
              <a className="header-tool" href={links.login}>
                <Icon name="user" size={20} />
                <span className="header-tool__label">Iniciar sesión</span>
              </a>
              <a className="header-tool header-tool--icon header-tool--alert" href={links.prealert} title="Prealertar una compra">
                <span className="header-tool__bell" aria-hidden="true">
                  <Icon name="bell" size={20} />
                  <span className="header-tool__dot" />
                </span>
                <span className="header-tool__label">Prealerta</span>
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

            {/* Megamenú (solo desktop) */}
            {megaMenus.map((m) => (
              <div
                key={m.id}
                id={`mega-${m.id}`}
                className={`mega mega--${m.id}`}
                hidden={active?.id !== m.id}
                onPointerEnter={hoverKeep}
              >
                <div className="mega__groups">
                  {m.groups.map((g) => (
                    <div key={g.title} className="mega__group">
                      <p className="mega__title">{g.title}</p>
                      <ul className="mega__list">
                        {g.items.map((it) => (
                          <li key={it.label}>
                            <a
                              className="mega__item"
                              href={it.href}
                              onClick={() => setOpenMega(null)}
                              target={it.external ? '_blank' : undefined}
                              rel={it.external ? 'noopener noreferrer' : undefined}
                            >
                              <span className="mega__icon" aria-hidden="true">
                                <Icon name={it.icon} size={22} />
                              </span>
                              <span className="mega__text">
                                <span className="mega__label">{it.label}</span>
                                <span className="mega__desc">{it.desc}</span>
                              </span>
                              <Icon name="arrowRight" size={18} className="mega__arrow" />
                              {it.external ? <span className="sr-only"> (se abre en una pestaña nueva)</span> : null}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                {m.feature ? (
                  <div className="mega__feature">
                    <p className="mega__feature-title">¿No sabes qué servicio necesitas?</p>
                    <p className="mega__feature-text">
                      Cuéntanos qué vas a transportar y te orientamos sobre la alternativa adecuada.
                    </p>
                    <Button href="#cotizar" variant="light" size="sm" icon="arrowRight" onClick={() => setOpenMega(null)}>
                      Cotizar un envío
                    </Button>
                  </div>
                ) : null}
              </div>
            ))}
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
