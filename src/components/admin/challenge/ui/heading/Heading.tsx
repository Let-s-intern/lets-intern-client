interface Props {
  children: React.ReactNode;
}

const Heading = ({ children }: Props) => {
  return <h2 className="ml-3 mt-6 text-xl font-medium">{children}</h2>;
};

export default Heading;
