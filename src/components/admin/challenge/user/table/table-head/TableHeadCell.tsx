import clsx from 'clsx';

interface Props {
  children?: React.ReactNode;
  className?: string;
}

const TableHeadCell = ({ children, className }: Props) => {
  return <div className={clsx('px-2', className)}>{children}</div>;
};

export default TableHeadCell;
