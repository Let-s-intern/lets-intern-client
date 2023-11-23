interface THProps {
  children: React.ReactNode;
}

const TH = ({ children }: THProps) => {
  return (
    <th className="border border-slate-300 bg-gray-100 px-4 py-2 text-left font-medium">
      {children}
    </th>
  );
};

export default TH;
