import { textFieldClassName } from './fieldStyles';

interface NumberInputProps {
  id: string;
  value: string;
  hasError: boolean;
  /** 입력 오른쪽에 붙는 단위(시안 "개월"). 질문 설명을 단위로 쓴다 */
  unit?: string | null;
  onChange: (value: string) => void;
  onBlur: () => void;
}

const NumberInput = ({
  id,
  value,
  hasError,
  unit,
  onChange,
  onBlur,
}: NumberInputProps) => (
  <div className="relative">
    <input
      id={id}
      type="number"
      inputMode="decimal"
      value={value}
      placeholder="0"
      aria-invalid={hasError}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      className={textFieldClassName(hasError, unit ? 'pr-14' : undefined)}
    />
    {unit ? (
      <span className="text-xsmall14 text-neutral-40 pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2">
        {unit}
      </span>
    ) : null}
  </div>
);

export default NumberInput;
