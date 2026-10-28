import { textFieldClassName } from './fieldStyles';

interface UrlInputProps {
  id: string;
  value: string;
  hasError: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}

const UrlInput = ({ id, value, hasError, onChange, onBlur }: UrlInputProps) => (
  <input
    id={id}
    type="url"
    inputMode="url"
    value={value}
    placeholder="https://"
    aria-invalid={hasError}
    onChange={(e) => onChange(e.target.value)}
    onBlur={onBlur}
    className={textFieldClassName(hasError)}
  />
);

export default UrlInput;
