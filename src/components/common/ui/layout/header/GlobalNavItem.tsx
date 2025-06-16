'use client';

import Down from '@/assets/icons/down.svg?react';
import { twMerge } from '@/lib/twMerge';
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
  showDropdownIcon?: boolean;
  align?: 'left' | 'right';
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
  align = 'left',
  ...restProps
}: Props) {
  const linkClassName = twMerge(
    'text-small18 font-semibold',
    active ? 'text-primary' : 'text-neutral-0',
    isNew &&
      "flex items-center gap-1 after:flex after:h-3 after:w-3 after:items-center after:justify-center after:rounded-full after:bg-system-error after:text-[8px] after:font-bold after:leading-none after:text-white after:content-['N']",
    className,
  );

  const [hover, setHover] = useState(false);

  const getAlignmentClass = () => {
    switch (align) {
      case 'right':
        return 'right-0';
      default:
        return 'left-0';
    }
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative"
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
            <Down
              width={24}
              className="text-neutral-20 transition-transform group-hover:text-neutral-0"
            />
          )}
        </span>
      </HybridLink>

      {/* 서브 메뉴 */}
      {subNavList && hover && (
        <div
          className={`absolute ${getAlignmentClass()} top-4 z-10 flex flex-col items-center drop-shadow-xl`}
        >
          <div className="mx-auto h-auto w-[20px] text-white">
            {/* <Polygon /> */}
          </div>
          <div className="my-3 flex w-full flex-col rounded-xs bg-white py-1">
            {subNavList.map((item, index) => (
              <Fragment key={item.href}>
                <SubNavItem {...item} align={align}>
                  {item.children}
                </SubNavItem>
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
