import clsx from 'clsx';
import { Link } from 'react-router-dom';

export interface TableTemplateProps {
  title: string;
  headerButton: {
    label: string;
    href: string;
  };
  columnMetaData: Record<
    string,
    {
      headLabel: string;
      cellWidth: string;
    }
  >;
  children: React.ReactNode;
}

const TableTemplate = ({
  title,
  headerButton,
  columnMetaData,
  children,
}: TableTemplateProps) => {
  return (
    <div className="px-12 pt-12">
      <header className="flex items-center justify-between px-3">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <Link
          to={headerButton.href}
          className="rounded-xxs border border-zinc-600 bg-white px-4 py-[2px] text-xs duration-200 hover:bg-neutral-700 hover:text-white"
        >
          {headerButton.label}
        </Link>
      </header>
      <main className="mt-4">
        <div className="flex rounded-sm bg-[#E5E5E5]">
          {Object.keys(columnMetaData).map((columnKey) => (
            <div
              key={columnKey}
              className={clsx(
                'flex justify-center py-2 text-sm font-medium text-[#717179]',
                columnMetaData[columnKey].cellWidth,
              )}
            >
              {columnMetaData[columnKey].headLabel}
            </div>
          ))}
        </div>
        <div className="mb-16 mt-3 flex flex-col gap-2">{children}</div>
      </main>
    </div>
  );
};

TableTemplate.Row = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex rounded-md border border-neutral-200">{children}</div>
  );
};

TableTemplate.Cell = ({
  children,
  cellWidth,
}: {
  cellWidth: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={clsx(
        'flex items-center justify-center py-4 text-sm text-zinc-600',
        cellWidth,
      )}
    >
      {children}
    </div>
  );
};

TableTemplate.ManageContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center gap-2">{children}</div>;
};

export default TableTemplate;
