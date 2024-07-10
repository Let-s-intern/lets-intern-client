import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = (props: InputProps) => {
  const { className, ...newProps } = props;

  return (
    <input
      type="text"
      className={clsx(
        `text-1-medium min-w-0 rounded-md bg-neutral-95 p-3 outline-none ${props.readOnly ? 'text-neutral-50' : ''}`,
        className,
      )}
      autoComplete="off"
      {...newProps}
      readOnly={props.readOnly}
    />
  );
};

export default Input;
