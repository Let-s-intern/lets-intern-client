interface Props {
  children: React.ReactNode;
}

const Table = ({ children }: Props) => {
  return <div className="w-full">{children}</div>;
};

export default Table;
