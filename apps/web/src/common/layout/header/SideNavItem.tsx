'use client';

import Down from '@/assets/icons/down.svg?react';
import { twMerge } from '@/lib/twMerge';
import { AnchorHTMLAttributes, useState } from 'react';
import HybridLink from '../../HybridLink';
import SubNavItem, { SubNavItemProps } from './SubNavItem';

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  subNavList?: SubNavItemProps[];
  isNew?: boolean;
}

function SideNavItem({
  children,
  className,
  href = '#',
  subNavList,
  isNew = false,
  onClick,
  ...restProps
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const linkClassName = twMerge(
    'text-small16 flex max-h-[40px] w-full cursor-pointer gap-0.5 rounded-xs py-2 font-semibold text-neutral-30',
    isNew &&
      "items-center gap-1.5 after:flex after:h-4 after:w-4 after:items-center after:justify-center after:rounded-full after:bg-system-error after:text-[8px] after:font-bold after:leading-none after:text-white after:content-['N']",
    subNavList && 'justify-between',
    className,
  );

  return (
    <div className="flex w-full flex-col px-5">
      <HybridLink
        className={linkClassName}
        href={href}
        onClick={(e) => {
          if (onClick) onClick(e);
          if (subNavList) {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(!isOpen);
          }
        }}
        {...restProps}
      >
        {children}
        {subNavList && (
          <Down
            width={24}
            className={twMerge(
              'flex text-neutral-20 transition-transform',
              isOpen ? 'rotate-180' : 'rotate-0',
            )}
          />
        )}
      </HybridLink>

      {/* 서브 메뉴 */}
      {subNavList && (
        <div
          className={`${isOpen ? 'max-h-screen' : 'max-h-0'} flex h-fit w-full flex-col gap-0.5 overflow-hidden transition-all duration-150`}
          onClick={() => setIsOpen(false)}
        >
          {subNavList.map((item) => (
            <SubNavItem
              key={item.href}
              className="flex h-[36px] px-0 py-2 text-xsmall14 font-semibold text-neutral-20 hover:bg-white"
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
