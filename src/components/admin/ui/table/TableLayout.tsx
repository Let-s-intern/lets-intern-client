import React from 'react';
import { Link } from 'react-router-dom';

interface TableLayoutProps {
  title: string;
  headerButton?: {
    label: string;
    href: string;
  };
  children: React.ReactNode;
}

const TableLayout = ({ title, headerButton, children }: TableLayoutProps) => {
  return (
    <div className="px-12 pt-12">
      <header className="flex items-center justify-between px-3">
        <h1 className="text-2xl font-semibold">{title}</h1>
        {headerButton && (
          <Link
            to={headerButton.href}
            className="h-full rounded-xxs border border-primary bg-white px-4 py-0.5 text-xsmall14 text-primary duration-200 hover:bg-primary-20 hover:font-semibold"
          >
            {headerButton.label}
          </Link>
        )}
      </header>
      <main className="mt-4 flex flex-col gap-2">{children}</main>
    </div>
  );
};

export default TableLayout;
