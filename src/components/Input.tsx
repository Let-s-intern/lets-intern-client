interface InputProps {
  type?: string;
  value?: string;
  placeholder: string;
}

const Input = ({ type = 'text', value, placeholder }: InputProps) => {
  return (
    <input
      type={type}
      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
      placeholder={placeholder}
      value={value}
    />
  );
};

export default Input;
