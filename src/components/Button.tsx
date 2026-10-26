import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

type Variant = 'primary' | 'secondary' | 'light' | 'outline-light' | 'dark';
type Common = {
  variant?: Variant;
  size?: 'md' | 'sm';
  icon?: IconName;
  loading?: boolean;
  block?: boolean;
  children: ReactNode;
};

type AsLink = Common & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type AsButton = Common & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

function classes({ variant = 'primary', size = 'md', block, loading }: Common, extra?: string) {
  return ['btn', `btn--${variant}`, size === 'sm' && 'btn--sm', block && 'btn--block', loading && 'is-loading', extra]
    .filter(Boolean)
    .join(' ');
}

export function Button(props: AsLink | AsButton) {
  const { variant, size, icon, loading, block, children, className, ...rest } = props;
  const content = (
    <>
      {loading ? <Icon name="spinner" size={18} className="btn__spinner" /> : null}
      <span>{children}</span>
      {icon && !loading ? <Icon name={icon} size={18} className="btn__icon" /> : null}
    </>
  );
  const cls = classes({ variant, size, block, loading, children }, className);

  if (typeof (rest as AsLink).href === 'string') {
    return (
      <a className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    );
  }
  const btn = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      className={cls}
      type={btn.type ?? 'button'}
      aria-busy={loading || undefined}
      {...btn}
      disabled={btn.disabled || loading}
    >
      {content}
    </button>
  );
}
