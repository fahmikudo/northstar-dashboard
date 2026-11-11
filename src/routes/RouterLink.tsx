import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type RouterLinkProps = {
  href?: string;
  children?: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

/**
 * Adapts React Router to Astryx's `as` prop, which hands components an `href`
 * and expects a rendered anchor. Keeps in-app navigation client-side.
 */
export function RouterLink({ href = '/', children, ...rest }: RouterLinkProps) {
  return (
    <Link to={href} {...rest}>
      {children}
    </Link>
  );
}
