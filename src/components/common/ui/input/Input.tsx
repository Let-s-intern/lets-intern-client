import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = (props: InputProps) => {
  const { className, ...newProps } = props;

  return (
    <input
      type="text"
      className={clsx(
        'text-1-medium rounded-md bg-neutral-95 p-3 outline-none',
        className,
      )}
      autoComplete="off"
      {...newProps}
    />
  );
};

export default Input;
