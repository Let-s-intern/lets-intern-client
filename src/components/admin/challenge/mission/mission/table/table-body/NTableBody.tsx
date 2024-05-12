interface NTableBodyProps {
  children: React.ReactNode;
}

const NTableBody = ({ children }: NTableBodyProps) => {
  return <div className="mb-16 mt-3 flex flex-col gap-2">{children}</div>;
};

export default NTableBody;
