'use client';

import { twMerge } from '@/lib/twMerge';
import { ChevronDown } from 'lucide-react';
import { AnchorHTMLAttributes, Fragment, useState } from 'react';
import HybridLink from '../../HybridLink';
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
  isNew?: boolean;
  showDropdownIcon?: boolean; // 새로 추가
}

function GlobalNavItem({
  children,
  active = false,
  force = false,
  className,
  isNextRouter,
  href = '#',
  subNavList,
  isNew = false,
  showDropdownIcon,
  ...restProps
}: Props) {
  const linkClassName = twMerge(
    'hidden text-small18 font-semibold md:inline-block',
    active ? 'text-primary' : 'text-neutral-0',
    isNew &&
      "items-center gap-1 after:flex after:h-3 after:w-3 after:items-center after:justify-center after:rounded-full after:bg-system-error after:text-[0.5rem] after:font-bold after:leading-none after:text-white after:content-['N'] md:flex",
    className,
  );

  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <HybridLink
        isNextRouter={isNextRouter}
        force={force}
        className={linkClassName}
        href={href}
        {...restProps}
      >
        <span className="flex items-center">
          {children}
          {showDropdownIcon && subNavList && (
            <ChevronDown
              size={24}
              className="text-gray-20 transition-transform group-hover:text-neutral-0"
            />
          )}
        </span>
      </HybridLink>

      {/* 서브 메뉴 */}
      {subNavList && hover && (
        <div className="absolute z-10 flex flex-col items-center drop-shadow-xl">
          <div className="mx-auto h-auto w-[20px] text-white">
            {/* <Polygon /> */}
          </div>
          <div className="my-3 flex w-full flex-col rounded-xs bg-white py-1">
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
