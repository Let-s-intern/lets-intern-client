interface SectionTitleProps {
  className?: string;
  children: React.ReactNode;
}

const SectionTitle = ({ children, className }: SectionTitleProps) => {
  return (
    <h1 className={`text-2xl font-bold${className ? ` ${className}` : ''}`}>
      {children}
    </h1>
  );
};

export default SectionTitle;
