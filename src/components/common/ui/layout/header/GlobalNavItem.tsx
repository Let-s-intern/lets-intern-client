import { twMerge } from '@/lib/twMerge';
import Link from 'next/link';
import { AnchorHTMLAttributes } from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  isNextRouter: boolean;
}

function GlobalNavItem({
  children,
  active = false,
  className,
  isNextRouter,
  href = '#',
  ...restProps
}: Props) {
  const linkClassName = twMerge(
    `hidden text-[15px] font-semibold md:inline ${active ? 'text-primary' : 'text-neutral-0'}`,
    className,
  );
  const LinkComponent: any = isNextRouter ? Link : RouterLink;
  const linkProps = isNextRouter
    ? { ...restProps, href }
    : { ...restProps, to: href, reloadDocument: true };

  return (
    <LinkComponent className={linkClassName} {...linkProps}>
      {children}
    </LinkComponent>
  );
}

export default GlobalNavItem;
