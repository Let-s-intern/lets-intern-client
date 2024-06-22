interface LineTableBodyProps {
  children: React.ReactNode;
}

const LineTableBody = ({ children }: LineTableBodyProps) => {
  return <div className="mb-16 mt-3 flex flex-col gap-2">{children}</div>;
};

export default LineTableBody;
