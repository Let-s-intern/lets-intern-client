import { twMerge } from '@/lib/twMerge';
import { AnchorHTMLAttributes } from 'react';
import HybridLink from '../../HybridLink';

export interface SubNavItemProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  isNextRouter: boolean;
  force?: boolean;
}

function SubNavItem({
  children,
  className,
  force = false,
  isNextRouter,
  href = '#',
  ...restProps
}: SubNavItemProps) {
  const active = window.location.pathname.startsWith(href);

  return (
    <HybridLink
      className={twMerge(
        `w-full bg-white px-5 py-3 text-xsmall14 text-neutral-0 hover:bg-neutral-80 ${active ? 'font-semibold' : 'font-medium'}`,
        className,
      )}
      isNextRouter={isNextRouter}
      force={force}
      href={href}
      {...restProps}
    >
      {children}
    </HybridLink>
  );
}

export default SubNavItem;
