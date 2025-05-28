import Link from 'next/link';
import { AnchorHTMLAttributes, MouseEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  isNextRouter: boolean;
  force?: boolean;
}

function HybridLink({
  isNextRouter,
  force,
  href = '#',
  children,
  ...restProps
}: Props) {
  const LinkComponent: any = isNextRouter ? Link : RouterLink;
  const linkProps = isNextRouter
    ? {
        ...restProps,
        href,
        onClick: (e: MouseEvent<HTMLAnchorElement, MouseEvent>) => {
          if (force) {
            e.preventDefault();
            window.location.href = href;
          }
        },
      }
    : { ...restProps, to: href, reloadDocument: force };

  return <LinkComponent {...linkProps}>{children}</LinkComponent>;
}

export default HybridLink;
