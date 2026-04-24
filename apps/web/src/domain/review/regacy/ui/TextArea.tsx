interface TextAreaProps {
  placeholder: string;
  name: string;
  value: string;
  onChange: (e: any) => void;
}

const TextArea = ({ placeholder, name, value, onChange }: TextAreaProps) => {
  return (
    <textarea
      rows={7}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      className="mt-3 w-full resize-none rounded border border-stone-300 px-4 py-4 outline-none"
    ></textarea>
  );
};

export default TextArea;
