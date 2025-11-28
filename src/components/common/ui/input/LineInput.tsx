import { twMerge } from '@/lib/twMerge';

const LineInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  const { className, ...newProps } = props;

  return (
    <input
      type="text"
      className={twMerge(
        `w-full rounded-xxs border border-neutral-80 px-3 py-2 text-neutral-0 placeholder:text-neutral-50 focus:border-primary focus:outline-none`,
        props.readOnly ? 'text-xsmall16 text-neutral-50' : '',
        className,
      )}
      autoComplete="off"
      {...newProps}
    />
  );
};

export default LineInput;
