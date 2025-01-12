'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useState } from 'react';
import { NavSubItemProps } from '../nav/NavSubItem';

interface SideNavItemProps {
  to: string;
  onClick?: () => void;
  children: string;
  target?: string;
  rel?: string;
  className?: string;
  hoverItem?: NavSubItemProps[];
}

const SideNavItem = ({
  to,
  onClick,
  children,
  target,
  rel,
  className,
  hoverItem,
}: SideNavItemProps) => {
  const Wrapper = hoverItem ? 'div' : Link;
  const [open, setOpen] = useState(false);

  return (
    <div className="flex w-full flex-col px-5">
      <Wrapper
        href={to}
        className={clsx(
          'flex w-full cursor-pointer justify-between rounded-xs px-2.5 py-3 text-neutral-30',
          hoverItem && open && 'bg-primary-5',
          className,
        )}
        onClick={() => {
          if (hoverItem) {
            setOpen(!open);
          } else if (onClick) {
            onClick();
          }
        }}
        target={target}
        rel={rel}
      >
        <span className="text-1.125-bold">{children}</span>
      </Wrapper>
      {hoverItem && (
        <div
          className={`flex ${open ? 'max-h-screen' : 'max-h-0'} w-full transform flex-col gap-y-1.5 overflow-hidden duration-150`}
        >
          <div className="h-[7px]" />
          {hoverItem.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              onClick={onClick}
              className="flex w-full px-8 py-2 text-xsmall16 font-semibold text-neutral-20"
            >
              {item.text}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SideNavItem;
