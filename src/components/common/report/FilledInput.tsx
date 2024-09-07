interface FilledInputProps {
  placeholder?: string;
  id?: string;
  name?: string;
  value?: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FilledInput = ({
  placeholder,
  id,
  name,
  value,
  required,
  onChange,
}: FilledInputProps) => {
  return (
    <input
      id={id}
      className="w-full rounded-md bg-neutral-95 p-3 text-xsmall14"
      type="text"
      placeholder={placeholder}
      name={name}
      value={value}
      required={required}
      onChange={onChange}
    />
  );
};

export default FilledInput;
