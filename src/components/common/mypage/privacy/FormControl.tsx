interface FormControlProps {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormControl = ({
  label,
  name,
  value,
  placeholder,
  onChange,
}: FormControlProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-1-semibold">
        {label}
      </label>
      <input
        type="text"
        name={name}
        className="text-1-medium rounded-md bg-neutral-95 p-3 outline-none"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
};

export default FormControl;
