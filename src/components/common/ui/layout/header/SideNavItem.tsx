'use client';

import { twMerge } from '@/lib/twMerge';
import Link from 'next/link';
import { AnchorHTMLAttributes, MouseEvent, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import SubNavItem, { SubNavItemProps } from './SubNavItem';

/**
 * @param {boolean} force
 *   true로 설정하면 window.location.href으로 라우팅
 *   Next.js App Router <-> React Router로 이동할 때 사용합니다.
 */

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  isNextRouter: boolean;
  subNavList?: SubNavItemProps[];
  force?: boolean;
  isNew?: boolean;
}

function SideNavItem({
  children,
  force = false,
  className,
  isNextRouter,
  href = '#',
  subNavList,
  isNew = false,
  onClick,
  ...restProps
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const linkClassName = twMerge(
    'flex w-full cursor-pointer rounded-xs py-3 text-small18 font-semibold text-neutral-30',
    isNew &&
      "items-center gap-1.5 after:flex after:h-4 after:w-4 after:items-center after:justify-center after:rounded-full after:bg-system-error after:text-[10px] after:font-bold after:leading-none after:text-white after:content-['N']",
    isOpen && 'bg-primary-5',
    className,
  );
  const LinkComponent: any = isNextRouter ? Link : RouterLink;
  const linkProps = isNextRouter
    ? {
        ...restProps,
        href: subNavList ? '#' : href,
        onClick: (e: MouseEvent<HTMLAnchorElement>) => {
          if (onClick) onClick(e);
          if (subNavList) {
            e.stopPropagation();
            setIsOpen(!isOpen);
            return;
          }
          // 서브 메뉴 있을 땐 동작 X
          if (force) {
            e.preventDefault();
            window.location.href = href;
          }
        },
      }
    : { ...restProps, to: href, reloadDocument: force, onClick };

  return (
    <div className="flex w-full flex-col px-5">
      <LinkComponent className={linkClassName} {...linkProps}>
        {children}
      </LinkComponent>

      {/* 서브 메뉴 */}
      {subNavList && (
        <div
          className={`${isOpen ? 'max-h-screen pt-2' : 'max-h-0'} flex h-fit w-full flex-col gap-1.5 overflow-hidden transition-all duration-150`}
          onClick={() => setIsOpen(false)}
        >
          {subNavList.map((item) => (
            <SubNavItem
              key={item.href}
              className="flex px-8 py-2 text-xsmall16 font-semibold text-neutral-20 hover:bg-white"
              {...item}
            >
              {item.children}
            </SubNavItem>
          ))}
        </div>
      )}
    </div>
  );
}

export default SideNavItem;
