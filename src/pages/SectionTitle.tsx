interface SectionTitleProps {
  fontWeight?: 'bold' | 'normal';
  className?: string;
  children: React.ReactNode;
}

const SectionTitle = ({
  fontWeight = 'normal',
  children,
  className,
}: SectionTitleProps) => {
  return (
    <h1
      className={`text-2xl${className ? ` ${className}` : ''}${
        fontWeight === 'normal' ? ' font-base' : ' font-bold'
      }`}
    >
      {children}
    </h1>
  );
};

export default SectionTitle;
