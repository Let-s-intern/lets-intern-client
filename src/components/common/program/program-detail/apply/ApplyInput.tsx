interface ApplyInputProps {
  label: string;
  name: string;
}

const ApplyInput = ({ label, name }: ApplyInputProps) => {
  return (
    <li className="flex flex-col gap-1">
      <label htmlFor={name} className="px-2.5">
        {label}
      </label>
      <input
        className="h-full w-full rounded-md bg-neutral-95 p-3"
        type="text"
        name={name}
      />
    </li>
  );
};

export default ApplyInput;
