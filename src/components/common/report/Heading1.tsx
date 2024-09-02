interface Heading1Props {
  children: React.ReactNode;
}

const Heading1 = ({ children }: Heading1Props) => {
  return <h1 className="py-6 text-small20 font-bold">{children}</h1>;
};
export default Heading1;
