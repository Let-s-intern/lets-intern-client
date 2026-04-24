import clsx from 'clsx';

interface TableHeadProps {
  children?: React.ReactNode;
  className?: string;
}

const TableHeadCell = ({ children, className }: TableHeadProps) => {
  return (
    <div
      className={clsx(
        'py-2 text-center text-sm font-medium text-zinc-500',
        className,
      )}
    >
      {children}
    </div>
  );
};

export default TableHeadCell;
