interface HeadingProps {
  children: React.ReactNode;
}

const Heading = ({ children }: HeadingProps) => (
  <h1 className="text-1.125-bold md:text-1.375-bold lg:text-1.5-bold xl:text-1.5-semibold flex flex-col gap-1 text-neutral-0 md:flex-row px-5 ">
    {children}
  </h1>
);

export default Heading;
