import clsx from 'clsx';

interface Props {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const TableBodyRowBox = ({ children, className, onClick }: Props) => {
  return (
    <div
      className={clsx(
        'flex cursor-pointer rounded-md border border-neutral-200 font-pretendard',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default TableBodyRowBox;
