function FaqInput({
  name,
  placeholder,
  value,
  onChange,
}: React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) {
  return (
    <input
      type="text"
      className="rounded-sm border border-[#cbd5e0] px-4 py-2 text-sm"
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}

export default FaqInput;
