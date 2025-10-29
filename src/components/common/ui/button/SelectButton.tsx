import { Asterisk, ChevronRight } from 'lucide-react';
interface SelectButtonProps {
  label: string;
  value: string;
  placeholder: string;
  isRequired: boolean;
  onClick: () => void;
}

export function SelectButton({
  label,
  value,
  placeholder,
  isRequired,
  onClick,
}: SelectButtonProps) {
  const isEmpty = value === placeholder;
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5">
        <span>{label}</span>
        <Asterisk
          className={`text-primary ${!isRequired && 'hidden'}`}
          size={10}
        />
      </label>

      <button
        onClick={onClick}
        className="flex w-full items-center justify-between truncate rounded-xxs border border-neutral-80 px-3 py-2.5 text-left"
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
