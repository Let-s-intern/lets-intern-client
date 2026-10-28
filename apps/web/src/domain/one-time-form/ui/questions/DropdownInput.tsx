import { ChevronDown } from 'lucide-react';
import { textFieldClassName } from './fieldStyles';

interface DropdownInputProps {
  id: string;
  choices: string[];
  value: string;
  hasError: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}

const DropdownInput = ({
  id,
  choices,
  value,
  hasError,
  onChange,
  onBlur,
}: DropdownInputProps) => (
  <div className="relative">
    <select
      id={id}
      value={value}
      aria-invalid={hasError}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      className={textFieldClassName(
        hasError,
        `cursor-pointer appearance-none pr-10 ${value ? '' : 'text-neutral-45'}`,
      )}
    >
      <option value="" disabled>
        선택해 주세요
      </option>
      {choices.map((choice) => (
        <option key={choice} value={choice} className="text-neutral-0">
          {choice}
        </option>
      ))}
    </select>
    <ChevronDown
      size={20}
      aria-hidden
      className="text-neutral-40 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
    />
  </div>
);

export default DropdownInput;
