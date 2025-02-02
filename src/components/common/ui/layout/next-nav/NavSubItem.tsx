'use client';

import Link from 'next/link';

export interface NavSubItemProps {
  text: string;
  to: string;
  isLast?: boolean;
  force?: boolean;
}

const NavSubItem = ({ text, to, isLast, force }: NavSubItemProps) => {
  const active = window.location.pathname.startsWith(to);

  return (
    <Link
      href={to}
      className={`w-full ${!isLast ? 'border-b' : ''} border-neutral-90 bg-white px-5 py-3 text-xsmall14 text-neutral-0 hover:bg-neutral-80 ${active ? 'font-semibold' : 'font-medium'}`}
      onClick={(e) => {
        if (force) {
          e.preventDefault();
          window.location.href = to;
        }
      }}
    >
      {text}
    </Link>
  );
};

export default NavSubItem;
