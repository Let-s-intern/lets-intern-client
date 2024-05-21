interface NewTableBodyRowProps {
  children?: React.ReactNode;
}

const NewTableBodyRow = ({ children }: NewTableBodyRowProps) => {
  return (
    <div className="flex gap-px rounded-md border border-neutral-200 p-1 font-pretendard">
      {children}
    </div>
  );
};

export default NewTableBodyRow;
