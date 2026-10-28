import { LONG_TEXT_MAX_LENGTH } from '../../utils/answerValidation';
import { textFieldClassName } from './fieldStyles';

interface LongTextInputProps {
  id: string;
  value: string;
  hasError: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}

/** 장문. 아래에 글자 수를 보여 준다 */
const LongTextInput = ({
  id,
  value,
  hasError,
  onChange,
  onBlur,
}: LongTextInputProps) => (
  <>
    <textarea
      id={id}
      value={value}
      maxLength={LONG_TEXT_MAX_LENGTH}
      placeholder="자유롭게 적어 주세요."
      aria-invalid={hasError}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      className={textFieldClassName(
        hasError,
        'h-28 resize-none py-3 leading-relaxed',
      )}
    />
    <p className="text-xxsmall12 text-neutral-45 mt-1.5 text-right">
      {value.length}/{LONG_TEXT_MAX_LENGTH}
    </p>
  </>
);

export default LongTextInput;
