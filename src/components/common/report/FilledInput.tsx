const FilledInput = ({ placeholder }: { placeholder?: string }) => {
  return (
    <div className="flex items-center">
      <input
        className="w-full rounded-md bg-neutral-95 p-3 text-xsmall14"
        type="text"
        placeholder={placeholder}
      />
    </div>
  );
};

export default FilledInput;
