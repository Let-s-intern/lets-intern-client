import { Asterisk, ChevronRight } from 'lucide-react';
interface SelectButtonProps {
  label: string;
  className?: string;
  value: string;
  placeholder: string;
  isRequired?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export function SelectButton({
  label,
  className,
  value,
  placeholder,
  isRequired,
  disabled,
  onClick,
}: SelectButtonProps) {
  const isEmpty = value === placeholder;
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5">
        <span className={className}>{label}</span>
        <Asterisk
          className={`text-primary pb-1 ${!isRequired && 'hidden'}`}
          size={16}
        />
      </label>

      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`${className} rounded-xxs border-neutral-80 flex w-full items-center justify-between truncate border px-3 py-2.5 text-left ${
          disabled
            ? 'border-neutral-80 cursor-not-allowed bg-neutral-100 text-neutral-50'
            : ''
        }`}
      >
        <span
          className={`truncate ${isEmpty ? 'text-neutral-50' : 'text-gray-0'}`}
        >
          {value}
        </span>
        <ChevronRight className="stroke-[1.5] text-neutral-50" size={24} />
      </button>
    </div>
  );
}
