interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const TextArea = (props: TextAreaProps) => {
  return (
    <textarea
      className="text-1-medium resize-none rounded-md bg-neutral-95 p-3 outline-none"
      {...props}
    />
  );
};

export default TextArea;
