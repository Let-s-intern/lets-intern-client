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
  onClick,
  ...restProps
}: SubNavItemProps) {
  const active = window.location.pathname.startsWith(href);

  return (
    <HybridLink
      className={twMerge(
        `h-[40px] min-w-[120px] max-w-[172px] whitespace-nowrap bg-white px-2.5 py-2.5 text-xsmall14 text-neutral-0 hover:bg-neutral-80 ${active ? 'font-semibold' : 'font-medium'}`,
        className,
      )}
      isNextRouter={isNextRouter}
      force={force}
      href={href}
      onClick={onClick}
      {...restProps}
    >
      {children}
    </HybridLink>
  );
}

export default SubNavItem;
