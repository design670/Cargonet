import { useEffect } from 'react';

/**
 * Activa las entradas suaves de los elementos con [data-reveal].
 * El contenido es visible por defecto: solo se oculta cuando el documento
 * tiene la clase .motion (JS disponible y sin prefers-reduced-motion).
 * Los grupos [data-reveal-group] escalonan a sus hijos [data-reveal].
 */
export function useReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce.matches || !('IntersectionObserver' in window)) return;

    root.classList.add('motion');

    document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
      group.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el, i) => {
        el.style.setProperty('--reveal-delay', `${Math.min(i, 6) * 80}ms`);
      });
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );

    const targets = document.querySelectorAll<HTMLElement>('[data-reveal], [data-progress]');
    targets.forEach((el) => io.observe(el));

    // Red de seguridad: si algo falla, el contenido aparece igual.
    const fallback = window.setTimeout(() => {
      targets.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) el.classList.add('is-visible');
      });
    }, 1500);

    const onChange = () => {
      if (reduce.matches) {
        root.classList.remove('motion');
        targets.forEach((el) => el.classList.add('is-visible'));
      }
    };
    reduce.addEventListener('change', onChange);

    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
      reduce.removeEventListener('change', onChange);
    };
  }, []);
}
