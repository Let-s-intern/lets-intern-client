interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = (props: InputProps) => {
  return (
    <input
      type="text"
      className="text-1-medium rounded-md bg-neutral-95 p-3 outline-none"
      autoComplete="off"
      {...props}
    />
  );
};

export default Input;
