interface Props {
  children: React.ReactNode;
}

const SectionHeading = ({ children }: Props) => {
  return <h2 className="text-lg font-semibold">{children}</h2>;
};

export default SectionHeading;
