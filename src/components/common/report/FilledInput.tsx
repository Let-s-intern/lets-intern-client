interface FilledInputProps {
  placeholder?: string;
  id?: string;
}

const FilledInput = ({ placeholder, id }: FilledInputProps) => {
  return (
    <input
      id={id}
      className="w-full rounded-md bg-neutral-95 p-3 text-xsmall14"
      type="text"
      placeholder={placeholder}
    />
  );
};

export default FilledInput;
