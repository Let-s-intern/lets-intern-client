import { twMerge } from '@/lib/twMerge';
import Link from 'next/link';
import { AnchorHTMLAttributes, MouseEvent } from 'react';
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
}

function SubNavItem({
  children,
  className,
  force = false,
  isNextRouter,
  href = '#',
  ...restProps
}: SubNavItemProps) {
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
    : { ...restProps, to: href, reloadDocument: true };
  const active = window.location.pathname.startsWith(href);

  return (
    <LinkComponent
      className={twMerge(
        `w-full bg-white px-5 py-3 text-xsmall14 text-neutral-0 hover:bg-neutral-80 ${active ? 'font-semibold' : 'font-medium'}`,
        className,
      )}
      {...linkProps}
    >
      {children}
    </LinkComponent>
  );
}

export default SubNavItem;
