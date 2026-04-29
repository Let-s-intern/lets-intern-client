import { twMerge } from '@/lib/twMerge';

const LineInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  const { className, ...newProps } = props;

  return (
    <input
      type="text"
      className={twMerge(
        `rounded-xxs border-neutral-80 text-neutral-0 focus:border-primary w-full border px-3 py-2 placeholder:text-neutral-50 focus:outline-none`,
        props.readOnly ? 'text-xsmall16 text-neutral-50' : '',
        className,
      )}
      autoComplete="off"
      {...newProps}
    />
  );
};

export default LineInput;
