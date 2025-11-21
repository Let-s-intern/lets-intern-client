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
          className={`pb-1 text-primary ${!isRequired && 'hidden'}`}
          size={16}
        />
      </label>

      <button
        onClick={onClick}
        disabled={disabled}
        className={`${className} flex w-full items-center justify-between truncate rounded-xxs border border-neutral-80 px-3 py-2.5 text-left ${
          disabled
            ? 'cursor-not-allowed border-neutral-80 bg-neutral-100 text-neutral-50'
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
