import { DateTimePicker } from '@mui/x-date-pickers';

import { YYYY_MMDD_THHmmss } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';

interface SettingsDateTimeFieldProps {
  label: string;
  /** `YYYY-MM-DDTHH:mm:ss`, 비어 있으면 '' */
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
  clearable?: boolean;
}

/** 서버 형식 문자열을 그대로 주고받는 일시 입력 */
const SettingsDateTimeField = ({
  label,
  value,
  onChange,
  error,
  helperText,
  clearable = false,
}: SettingsDateTimeFieldProps) => (
  <DateTimePicker
    label={label}
    value={value ? dayjs(value) : null}
    format="YYYY.MM.DD HH:mm"
    ampm={false}
    onChange={(next) =>
      onChange(next?.isValid() ? next.format(YYYY_MMDD_THHmmss) : '')
    }
    slotProps={{
      field: { clearable },
      textField: {
        fullWidth: true,
        error: !!error,
        helperText: error ?? helperText,
      },
    }}
  />
);

export default SettingsDateTimeField;
