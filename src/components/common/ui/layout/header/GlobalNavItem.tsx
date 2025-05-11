'use client';

import Polygon from '@/assets/icons/polygon.svg?react';
import { twMerge } from '@/lib/twMerge';
import Link from 'next/link';
import { AnchorHTMLAttributes, Fragment, MouseEvent, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import SubNavItem, { SubNavItemProps } from './SubNavItem';

/**
 * @param {boolean} force
 *   true로 설정하면 window.location.href으로 라우팅
 *   Next.js App Router <-> React Router로 이동할 때 사용합니다.
 */

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  isNextRouter: boolean;
  subNavList?: SubNavItemProps[];
  force?: boolean;
}

function GlobalNavItem({
  children,
  active = false,
  force = false,
  className,
  isNextRouter,
  href = '#',
  subNavList,
  ...restProps
}: Props) {
  const linkClassName = twMerge(
    `hidden text-[15px] font-semibold md:inline ${active ? 'text-primary' : 'text-neutral-0'}`,
    className,
  );
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

  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <LinkComponent className={linkClassName} {...linkProps}>
        {children}
      </LinkComponent>

      {/* 서브 메뉴 */}
      {subNavList && hover && (
        <div className="absolute z-10 flex flex-col items-center drop-shadow-05">
          <div className="mx-auto h-auto w-[20px] text-white">
            <Polygon />
          </div>
          <div className="flex w-full flex-col rounded-xs bg-white py-1">
            {subNavList.map((item, index) => (
              <Fragment key={item.href}>
                <SubNavItem {...item}>{item.children}</SubNavItem>
                {index < subNavList.length - 1 && (
                  <hr className="border-t border-neutral-90" />
                )}
              </Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default GlobalNavItem;
