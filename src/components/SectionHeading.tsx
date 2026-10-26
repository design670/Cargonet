import type { ReactNode } from 'react';

type Props = {
  id?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: 'start' | 'center';
  tone?: 'default' | 'inverse';
  className?: string;
};

/** Encabezado de sección (H2 + introducción opcional). */
export function SectionHeading({ id, title, intro, align = 'start', tone = 'default', className }: Props) {
  return (
    <div
      className={['section-heading', `section-heading--${align}`, tone === 'inverse' && 'section-heading--inverse', className]
        .filter(Boolean)
        .join(' ')}
      data-reveal
    >
      <h2 id={id} className="h2">
        {title}
      </h2>
      {intro ? <p className="lead">{intro}</p> : null}
    </div>
  );
}
