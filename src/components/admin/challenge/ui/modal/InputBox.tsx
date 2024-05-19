interface InputBoxProps {
  label: string;
  name: string;
  value: string | number;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
}

const InputBox = ({ label, name, value, handleChange }: InputBoxProps) => (
  <div className="flex items-center">
    <label htmlFor={name} className="w-20">
      {label}
    </label>
    <input
      type="text"
      className="flex-1 rounded-sm border border-neutral-400 px-4 py-2 text-sm outline-none"
      name={name}
      value={value}
      placeholder={label}
      onChange={handleChange}
      autoComplete="off"
    />
  </div>
);
export default InputBox;
