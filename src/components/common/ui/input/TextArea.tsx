import { useEffect, useState } from 'react';

import { twMerge } from '@/lib/twMerge';

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxLength?: number;
  wrapperClassName?: string;
}

const TextArea = ({
  maxLength,
  wrapperClassName,
  onChange,
  ...props
}: TextAreaProps) => {
  const [textLength, setTextLength] = useState<number>(0);

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (maxLength) {
      if (e.target.value.length > maxLength) {
        e.target.value = e.target.value.slice(0, maxLength);
      }
    }

    if (onChange) {
      onChange(e);
    }
  };

  useEffect(() => {
    setTextLength(props.value?.toString().length || 0);
  }, [props.value]);

  return (
    <div
      className={twMerge(
        'flex flex-col rounded-md bg-neutral-95 p-3',
        wrapperClassName,
      )}
    >
      <textarea
        {...props}
        className={twMerge(
          'h-full w-full resize-none bg-neutral-95 text-xsmall14 font-normal outline-none placeholder:font-normal placeholder:text-black/35',
          props.className,
        )}
        maxLength={maxLength}
        onChange={handleTextAreaChange}
      />
      {maxLength && (
        <div className="text-right">
          <span className="text-xxsmall12 text-black/35">
            {textLength}/{maxLength}
          </span>
        </div>
      )}
    </div>
  );
};

export default TextArea;
