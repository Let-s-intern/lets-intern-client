import { twMerge } from 'tailwind-merge';

interface OutlinedTextareaProps {
  className?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}

function OutlinedTextarea({
  className,
  name,
  placeholder,
  value,
  onChange,
}: OutlinedTextareaProps) {
  return (
    <textarea
      className={twMerge('rounded-sm border p-2', className)}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}

export default OutlinedTextarea;
