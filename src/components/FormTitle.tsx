interface FormTitleProps {
  textAlign?: string;
  className?: string;
  children: React.ReactNode;
}

const FormTitle = ({
  textAlign = 'left',
  className,
  children,
}: FormTitleProps) => {
  return (
    <h2
      className={`text-2xl font-semibold ${
        textAlign === 'center' ? 'text-center' : 'text-left'
      }${className ? ` ${className}` : ''}`}
    >
      {children}
    </h2>
  );
};

export default FormTitle;
