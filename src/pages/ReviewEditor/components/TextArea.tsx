import { TextAreaProps } from '../interface';

const TextArea = ({ placeholder }: TextAreaProps) => {
  return (
    <textarea
      rows={7}
      placeholder={placeholder}
      className="mt-3 w-full resize-none rounded border border-stone-300 px-4 py-4 outline-none"
    ></textarea>
  );
};

export default TextArea;
