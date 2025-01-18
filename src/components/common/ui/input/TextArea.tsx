import { useEffect, useState } from 'react';

import { twMerge } from '@/lib/twMerge';

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxLength?: number;
}

const TextArea = (props: TextAreaProps) => {
  const [textLength, setTextLength] = useState<number>(0);

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (props.maxLength) {
      if (e.target.value.length > props.maxLength) {
        e.target.value = e.target.value.slice(0, props.maxLength);
      }
    }

    if (props.onChange) {
      props.onChange(e);
    }
  };

  useEffect(() => {
    setTextLength(props.value?.toString().length || 0);
  }, [props.value]);

  return (
    <div className="flex gap-2 rounded-md bg-neutral-95 p-3">
      <textarea
        {...props}
        className={twMerge(
          'w-full resize-none bg-neutral-95 text-xsmall14 font-medium outline-none placeholder:font-normal placeholder:text-black/35',
          props.className,
        )}
        onChange={handleTextAreaChange}
      />
      {props.maxLength && (
        <div className="flex items-end text-right">
          <span className="text-xxsmall12 text-black/35">
            {textLength}/{props.maxLength}
          </span>
        </div>
      )}
    </div>
  );
};

export default TextArea;
