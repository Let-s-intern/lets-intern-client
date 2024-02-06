interface Props {
  children: React.ReactNode;
}

const Table = ({ children }: Props) => {
  return <div className="mt-4">{children}</div>;
};

export default Table;
