import Link from 'next/link';
import React from 'react';

interface TableLayoutProps {
  title: string;
  headerButton?: {
    label: string;
    href: string;
  };
  children: React.ReactNode;
  tabs?: React.ReactNode;
}

const TableLayout = ({
  title,
  headerButton,
  children,
  tabs,
}: TableLayoutProps) => {
  return (
    <div className="px-12 pt-12">
      <header className="flex items-center justify-between px-3">
        <h1 className="text-2xl font-semibold">{title}</h1>
        {headerButton && (
          <Link
            href={headerButton.href}
            className="h-full rounded-xxs border border-primary bg-white px-4 py-0.5 text-xsmall14 text-primary duration-200 hover:bg-primary-20 hover:font-semibold"
          >
            {headerButton.label}
          </Link>
        )}
      </header>
      {tabs && <div className="mt-3 px-3">{tabs}</div>}
      <main className="mt-4 flex flex-col gap-2">{children}</main>
    </div>
  );
};

export default TableLayout;
