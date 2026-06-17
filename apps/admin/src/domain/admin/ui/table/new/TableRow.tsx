interface TableRowProps {
  children: React.ReactNode;
  minWidth?: string;
}

const TableRow = ({ children, minWidth }: TableRowProps) => {
  return (
    <div
      className="flex w-full rounded-md border border-neutral-200"
      style={{ minWidth }}
    >
      {children}
    </div>
  );
};

export default TableRow;
