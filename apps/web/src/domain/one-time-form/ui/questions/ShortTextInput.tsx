import { SHORT_TEXT_MAX_LENGTH } from '../../utils/answerValidation';
import { textFieldClassName } from './fieldStyles';

interface ShortTextInputProps {
  id: string;
  value: string;
  hasError: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}

const ShortTextInput = ({
  id,
  value,
  hasError,
  onChange,
  onBlur,
}: ShortTextInputProps) => (
  <input
    id={id}
    type="text"
    value={value}
    maxLength={SHORT_TEXT_MAX_LENGTH}
    aria-invalid={hasError}
    onChange={(e) => onChange(e.target.value)}
    onBlur={onBlur}
    className={textFieldClassName(hasError)}
  />
);

export default ShortTextInput;
