interface HeadingProps {
  title: string;
}

const Heading = ({ title }: HeadingProps) => (
  <h1 className="lg:text-1.5-semibold text-1.125-bold md:text-1.375-semibold text-neutral-0">
    {title}
  </h1>
);

export default Heading;
