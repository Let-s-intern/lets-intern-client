import clsx from 'clsx';
import { useEffect, useRef } from 'react';

interface TextareaCellProps {
  name: string;
  placeholder: string;
  value: string;
  disabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}

const TextareaCell = ({
  name,
  placeholder,
  value,
  disabled = false,
  onChange,
}: TextareaCellProps) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    ref.current!.style.height = `${ref.current!.scrollHeight}px`;
  }, [value, disabled]);

  return (
    <textarea
      ref={ref}
      name={name}
      rows={1}
      className={clsx(
        {
          'rounded-md border border-neutral-200': !disabled,
        },
        'w-full resize-none overflow-hidden bg-static-100 p-2',
      )}
      placeholder={placeholder}
      disabled={disabled}
      value={value}
      onChange={onChange}
    />
  );
};

export default TextareaCell;
