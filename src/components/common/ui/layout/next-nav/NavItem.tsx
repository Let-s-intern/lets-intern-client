'use client';

import Polygon from '@/assets/icons/polygon.svg?react';
import clsx from 'clsx';
import Link from 'next/link';
import { useState } from 'react';
import NavSubItem, { NavSubItemProps } from './NavSubItem';

interface NavItemProps {
  to?: string;
  active?: boolean;
  as?: keyof JSX.IntrinsicElements;
  children: React.ReactNode;
  hoverItem?: NavSubItemProps[];
  isItemLoaded?: boolean;
  rel?: string;
  target?: string;
  force?: boolean;
}

const NavItem = ({
  to,
  active,
  force,
  as,
  children,
  hoverItem,
  isItemLoaded = true,
  rel,
  target,
}: NavItemProps) => {
  const [hover, setHover] = useState(false);
  const Wrapper = as || Link;
  const style = {
    'text-1.125-bold text-neutral-0': active || hover,
    'text-1.125-medium text-neutral-60': !active && !hover,
  };

  return (
    <Wrapper
      href={to || '#'}
      className={clsx(
        style,
        'relative hidden h-full cursor-pointer items-center 3xl:flex',
      )}
      onClick={(e) => {
        if (force) {
          e.preventDefault();
          window.location.href = to || '#';
        }
      }}
      target={target}
      rel={rel}
    >
      {children}
      <div
        className="absolute left-0 top-0 z-30 w-full pt-[2.75rem] md:pt-[3.375rem] lg:pt-[3.75rem]"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {hover && hoverItem && (
          <div className="relative flex w-full flex-col items-center drop-shadow-05">
            <div className="absolute top-0 z-10 mx-auto h-[13px] w-[20px] overflow-hidden text-white">
              <Polygon />
            </div>
            <div className="mt-[13px] flex w-full flex-col rounded-xs bg-white py-1">
              {!isItemLoaded ? (
                <div className="mx-auto text-xsmall16 font-normal text-neutral-35">
                  Loading...
                </div>
              ) : (
                hoverItem.map((item, idx) => (
                  <NavSubItem
                    target={target}
                    rel={rel}
                    key={item.to}
                    isLast={idx === hoverItem.length - 1}
                    {...item}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default NavItem;
