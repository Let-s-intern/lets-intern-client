interface DescriptionProps {
  children: React.ReactNode;
}

const Description = ({ children }: DescriptionProps) => (
  <span className="text-0.75 lg:text-1 px-5 text-neutral-20">{children}</span>
);

export default Description;
