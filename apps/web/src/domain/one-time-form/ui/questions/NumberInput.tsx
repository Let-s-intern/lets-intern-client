import { textFieldClassName } from './fieldStyles';

interface NumberInputProps {
  id: string;
  value: string;
  hasError: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}

const NumberInput = ({
  id,
  value,
  hasError,
  onChange,
  onBlur,
}: NumberInputProps) => (
  <input
    id={id}
    type="number"
    inputMode="decimal"
    value={value}
    placeholder="0"
    aria-invalid={hasError}
    onChange={(e) => onChange(e.target.value)}
    onBlur={onBlur}
    className={textFieldClassName(hasError)}
  />
);

export default NumberInput;
