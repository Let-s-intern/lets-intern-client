import { twMerge } from '@/lib/twMerge';
import Link from 'next/link';
import { AnchorHTMLAttributes, MouseEvent as ReactMouseEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';

/**
 * @param {boolean} force
 *   true로 설정하면 window.location.href으로 라우팅
 *   Next.js App Router -> React Router로 이동할 때 사용합니다.
 */

export interface SubNavItemProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  isNextRouter: boolean;
  force?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
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
  const LinkComponent: any = isNextRouter ? Link : RouterLink;
  const linkProps = isNextRouter
    ? {
        ...restProps,
        href,
        onClick: (e: ReactMouseEvent<HTMLAnchorElement, MouseEvent>) => {
          if (force) {
            e.preventDefault();
            window.location.href = href;
          }
          if (onClick) {
            onClick(e);
          }
        },
      }
    : { ...restProps, to: href, reloadDocument: true, onClick };
  const active = window.location.pathname.startsWith(href);

  return (
    <LinkComponent
      className={twMerge(
        `h-[40px] min-w-[120px] max-w-[172px] whitespace-nowrap bg-white px-2.5 py-2.5 text-xsmall14 text-neutral-0 hover:bg-neutral-80 ${active ? 'font-semibold' : 'font-medium'}`,
        className,
      )}
      {...linkProps}
    >
      {children}
    </LinkComponent>
  );
}

export default SubNavItem;
