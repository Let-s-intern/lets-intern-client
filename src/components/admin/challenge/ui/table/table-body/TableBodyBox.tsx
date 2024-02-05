interface Props {
  children: React.ReactNode;
}

const TableBodyBox = ({ children }: Props) => {
  return <div className="mt-3 flex flex-col gap-2">{children}</div>;
};

export default TableBodyBox;
