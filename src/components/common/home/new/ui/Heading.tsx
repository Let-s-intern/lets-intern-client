interface HeadingProps {
  children: React.ReactNode;
}

const Heading = ({ children }: HeadingProps) => (
  <h1 className="font-bold text-lg lg:font-bold lg:text-[1.375rem] flex flex-col gap-1 text-neutral-0 md:flex-row ">
    {children}
  </h1>
);

export default Heading;
