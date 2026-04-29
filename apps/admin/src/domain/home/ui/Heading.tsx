interface HeadingProps {
  children: React.ReactNode;
}

const Heading = ({ children }: HeadingProps) => (
  <h2 className="text-neutral-0 flex flex-col gap-1 text-lg font-bold md:flex-row lg:text-[1.375rem] lg:font-bold">
    {children}
  </h2>
);

export default Heading;
