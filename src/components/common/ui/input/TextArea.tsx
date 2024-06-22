import { useEffect, useState } from 'react';

interface TextAreaProps
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
    <div className="rounded-md bg-neutral-95 p-3">
      <textarea
        className="text-1-medium w-full resize-none bg-neutral-95 outline-none"
        {...props}
        onChange={handleTextAreaChange}
      />
      {props.maxLength && (
        <div className="text-right">
          <span className="text-sm font-light text-neutral-0 text-opacity-[36%]">
            {textLength}/{props.maxLength}
          </span>
        </div>
      )}
    </div>
  );
};

export default TextArea;
