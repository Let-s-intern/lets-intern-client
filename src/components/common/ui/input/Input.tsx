import { twMerge } from '@/lib/twMerge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = (props: InputProps) => {
  const { className, ...newProps } = props;

  return (
    <input
      type="text"
      className={twMerge(
        `min-w-0 rounded-md bg-neutral-95 p-3 text-xsmall14 outline-none disabled:opacity-100`,
        props.readOnly ? 'text-neutral-50' : '',
        className,
      )}
      autoComplete="off"
      {...newProps}
    />
  );
};

export default Input;
