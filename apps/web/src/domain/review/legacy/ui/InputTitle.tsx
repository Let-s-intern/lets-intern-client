interface InputTitleProps {
  children: React.ReactNode;
}

const InputTitle = ({ children }: InputTitleProps) => {
  return (
    <h2 className="text-neutral-grey text-center text-lg font-bold">
      {children}
    </h2>
  );
};

export default InputTitle;
