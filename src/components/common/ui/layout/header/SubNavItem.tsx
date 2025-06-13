import { twMerge } from '@/lib/twMerge';
import { AnchorHTMLAttributes } from 'react';
import HybridLink from '../../HybridLink';

export interface SubNavItemProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  isNextRouter: boolean;
  force?: boolean;
  align?: 'left' | 'right';
}

function SubNavItem({
  children,
  className,
  force = false,
  isNextRouter,
  href = '#',
  align = 'left',
  onClick,
  ...restProps
}: SubNavItemProps) {
  const active = window.location.pathname.startsWith(href);

  return (
    <HybridLink
      className={twMerge(
        `h-[40px] w-[172px] whitespace-nowrap bg-white px-2.5 py-2.5 text-xsmall14 text-neutral-0 hover:bg-neutral-80 ${active ? 'font-semibold' : 'font-medium'}`,
        className,
        align === 'right' ? 'w-[120px]' : 'w-[172px]',
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
