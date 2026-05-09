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
      className="bg-neutral-95 text-xsmall14 w-full rounded-md p-3"
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
