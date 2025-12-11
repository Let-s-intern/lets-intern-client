import clsx from 'clsx';
import Link from 'next/link';

export interface TableTemplateProps<T extends string> {
  title: string;
  headerButton?: {
    label: string;
    href: string;
  };
  columnMetaData: {
    [name in T]: {
      headLabel: string;
      cellWidth: string;
    };
  };
  minWidth?: string;
  children: React.ReactNode;
}

const TableTemplate = <T extends string>({
  title,
  headerButton,
  columnMetaData,
  minWidth,
  children,
}: TableTemplateProps<T>) => {
  return (
    <div className="px-12 pt-12">
      <header className="flex items-center justify-between px-3">
        <h1 className="text-2xl font-semibold">{title}</h1>
        {headerButton && (
          <Link
            href={headerButton.href}
            className="rounded-xxs border border-zinc-600 bg-white px-4 py-[2px] text-xs duration-200 hover:bg-neutral-700 hover:text-white"
          >
            {headerButton.label}
          </Link>
        )}
      </header>
      <main className="mt-4">
        <div
          className="flex w-full rounded-sm bg-[#E5E5E5]"
          style={{ minWidth }}
        >
          {Object.keys(columnMetaData).map((columnKey) => (
            <div
              key={columnKey}
              className={clsx(
                'flex justify-center py-2 text-sm font-medium text-[#717179]',
                columnMetaData[columnKey as T].cellWidth,
              )}
            >
              {columnMetaData[columnKey as T].headLabel}
            </div>
          ))}
        </div>
        <div className="mb-16 mt-3 flex flex-col gap-2">{children}</div>
      </main>
    </div>
  );
};

export default TableTemplate;
