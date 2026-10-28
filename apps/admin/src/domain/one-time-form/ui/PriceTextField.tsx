import { TextField, type TextFieldProps } from '@mui/material';

/** 서버 금액은 int 라서 9자리(999,999,999원)까지 받는다 */
const MAX_DIGITS = 9;

/** 숫자만 남긴다. 빼기 기호도 지워지므로 음수가 될 수 없다. 비우면 0 */
export const parsePriceInput = (text: string): number => {
  const digits = text.replace(/\D/g, '').slice(0, MAX_DIGITS);
  return digits === '' ? 0 : Number(digits);
};

type PriceTextFieldProps = Omit<
  TextFieldProps,
  'value' | 'onChange' | 'slotProps'
> & {
  value: number;
  onChange: (price: number) => void;
  /** 표 안처럼 보이는 라벨이 없을 때 입력 칸 이름 */
  inputLabel?: string;
};

/** 원 단위 금액 입력. 천 단위 쉼표로 보이고 0원도 받는다 */
const PriceTextField = ({
  value,
  onChange,
  inputLabel,
  ...props
}: PriceTextFieldProps) => (
  <TextField
    {...props}
    value={value.toLocaleString()}
    onChange={(e) => onChange(parsePriceInput(e.target.value))}
    slotProps={{
      htmlInput: { inputMode: 'numeric', 'aria-label': inputLabel },
    }}
  />
);

export default PriceTextField;
