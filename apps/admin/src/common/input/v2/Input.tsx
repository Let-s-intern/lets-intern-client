import { twMerge } from '@/lib/twMerge';

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  const { className, ...newProps } = props;

  return (
    <input
      type="text"
      className={twMerge(
        `bg-neutral-95 text-xsmall14 min-w-0 rounded-md p-3 outline-none disabled:opacity-100`,
        props.readOnly ? 'text-neutral-50' : '',
        className,
      )}
      autoComplete="off"
      {...newProps}
    />
  );
};

export default Input;
