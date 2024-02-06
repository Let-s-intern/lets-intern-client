import clsx from 'clsx';

interface Props {
  children: React.ReactNode;
  className?: string;
}

const TableBodyCell = ({ children, className }: Props) => {
  return (
    <div className={clsx('text-center text-sm', className)}>{children}</div>
  );
};

export default TableBodyCell;
