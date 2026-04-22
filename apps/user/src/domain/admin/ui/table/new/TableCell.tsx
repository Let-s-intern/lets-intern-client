import clsx from 'clsx';

interface TableCellProps {
  children: React.ReactNode;
  cellWidth: string;
  textEllipsis?: boolean;
}

const TableCell = ({
  children,
  cellWidth,
  textEllipsis = false,
}: TableCellProps) => {
  return (
    <div
      className={clsx(
        'flex flex-shrink-0 items-center justify-center py-4 text-center text-sm text-zinc-600',
        cellWidth,
      )}
    >
      {textEllipsis ? (
        <div className="overflow-hidden text-ellipsis">{children}</div>
      ) : (
        <>{children}</>
      )}
    </div>
  );
};

export default TableCell;
