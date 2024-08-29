interface FilledInputProps {
  placeholder?: string;
  id?: string;
  name?: string;
}

const FilledInput = ({ placeholder, id, name }: FilledInputProps) => {
  return (
    <input
      id={id}
      className="w-full rounded-md bg-neutral-95 p-3 text-xsmall14"
      type="text"
      placeholder={placeholder}
      name={name}
    />
  );
};

export default FilledInput;
