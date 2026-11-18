import { twMerge } from '@/lib/twMerge';
import { AnchorHTMLAttributes } from 'react';
import HybridLink from '../../HybridLink';

export interface SubNavItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  align?: 'left' | 'right';
  /** 누르지 않는 회색 묶음 제목 (예: 프로그램 카테고리의 "서류 작성") */
  isHeader?: boolean;
}

function SubNavItem({
  children,
  className,
  href = '#',
  align = 'left',
  onClick,
  isHeader = false,
  ...restProps
}: SubNavItemProps) {
  if (isHeader) {
    return (
      <span
        className={twMerge(
          'px-2.5 pb-1 pt-3 text-xxsmall12 font-medium text-neutral-50',
          align === 'right' ? 'w-[120px]' : 'w-[184px]',
        )}
      >
        {children}
      </span>
    );
  }

  const active = window.location.pathname.startsWith(href);

  return (
    <HybridLink
      className={twMerge(
        `h-[40px] w-[172px] whitespace-nowrap bg-white px-2.5 py-2.5 text-xsmall14 text-neutral-0 hover:bg-neutral-80 ${active ? 'font-semibold' : 'font-medium'}`,
        className,
        align === 'right' ? 'w-[120px]' : 'w-[184px]',
      )}
      href={href}
      onClick={onClick}
      {...restProps}
    >
      {children}
    </HybridLink>
  );
}

export default SubNavItem;
