interface Props {
  children: React.ReactNode;
  onClick?: () => void;
}

const TableBodyRowBox = ({ children, onClick }: Props) => {
  return (
    <div
      className="flex cursor-pointer rounded-md border border-neutral-200 font-pretendard"
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default TableBodyRowBox;
