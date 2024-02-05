interface Props {
  children: React.ReactNode;
}

const TableBodyRowBox = ({ children }: Props) => {
  return (
    <div className="flex cursor-pointer rounded-md border border-neutral-200 font-pretendard">
      {children}
    </div>
  );
};

export default TableBodyRowBox;
