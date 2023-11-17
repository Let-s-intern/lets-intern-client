import { InputTitleProps } from '../interface';

const InputTitle = ({ children }: InputTitleProps) => {
  return (
    <h2 className="text-center text-lg font-bold text-neutral-grey">
      {children}
    </h2>
  );
};

export default InputTitle;
