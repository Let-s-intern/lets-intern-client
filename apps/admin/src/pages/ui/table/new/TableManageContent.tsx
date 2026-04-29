interface TableManageContentProps {
  children: React.ReactNode;
}

const TableManageContent = ({ children }: TableManageContentProps) => {
  return <div className="flex items-center gap-2">{children}</div>;
};

export default TableManageContent;
