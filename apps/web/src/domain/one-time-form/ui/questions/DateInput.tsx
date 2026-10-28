import { textFieldClassName } from './fieldStyles';

interface DateInputProps {
  id: string;
  value: string;
  hasError: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}

/** 브라우저 날짜 선택기. 값은 YYYY-MM-DD */
const DateInput = ({
  id,
  value,
  hasError,
  onChange,
  onBlur,
}: DateInputProps) => (
  <input
    id={id}
    type="date"
    value={value}
    aria-invalid={hasError}
    onChange={(e) => onChange(e.target.value)}
    onBlur={onBlur}
    className={textFieldClassName(hasError, 'cursor-pointer')}
  />
);

export default DateInput;
