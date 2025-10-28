interface CheckboxItemProps {
  label: string;
  isSelected: boolean;
  isDisabled?: boolean;
  onChange: () => void;
}

export function CheckboxItem({
  label,
  isSelected,
  isDisabled = false,
  onChange,
}: CheckboxItemProps) {
  return (
    <label
      className={`flex cursor-pointer items-center rounded-xxs px-3 py-1.5 leading-[26px] text-neutral-20 ${
        isDisabled ? 'cursor-not-allowed text-gray-300' : 'hover:bg-neutral-95'
      }`}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onChange}
        disabled={isDisabled}
        className="peer sr-only"
      />
      <div className="mr-3 flex h-4 w-4 items-center justify-center rounded-[2px] border border-neutral-70 peer-checked:border-none peer-checked:bg-primary-90 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
        {isSelected && (
          <svg
            className="h-3 w-3 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
      <span>{label}</span>
    </label>
  );
}
