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
      className={`rounded-xxs text-neutral-20 flex cursor-pointer items-center px-3 py-1.5 leading-[26px] ${
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
      <div className="border-neutral-70 peer-checked:bg-primary-90 mr-3 flex h-4 w-4 items-center justify-center rounded-[2px] border peer-checked:border-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
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
      <span className={isDisabled ? 'text-neutral-50' : 'text-neutral-20'}>
        {label}
      </span>
    </label>
  );
}
