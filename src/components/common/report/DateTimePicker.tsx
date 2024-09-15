import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Dayjs } from 'dayjs';
import 'dayjs/locale/ko';

import './date-pickers-toolbar.scss';

const dateTimePickerSx = {
  width: '50%',
  label: {
    fontSize: '0.875rem',
    color: '#4C4F56',
  },
  '.MuiInputBase-formControl': {
    borderRadius: '0.75rem',
    fontSize: '0.875rem',
    color: '#5177FF',
    fontWeight: 500,
  },
};

interface DateTimePickerProps {
  name?: string;
  date?: Dayjs | null | undefined;
  time?: number | null | undefined;
  minDate?: Dayjs;
  timeOption: number[];
  onChangeDate?: (date: Dayjs | null, name?: string) => void;
  onChangeTime?: (e: SelectChangeEvent<unknown>) => void;
}

const DateTimePicker = ({
  name,
  date,
  time,
  minDate,
  timeOption,
  onChangeDate,
  onChangeTime,
}: DateTimePickerProps) => {
  return (
    <div className="mt-3 flex items-center gap-4">
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        <DatePicker
          sx={dateTimePickerSx}
          format="YY년 M월 D일(dd)"
          label="날짜 선택"
          name={name}
          value={date}
          onChange={(date) => onChangeDate && onChangeDate(date, name)}
          minDate={minDate}
        />
      </LocalizationProvider>
      <FormControl sx={dateTimePickerSx}>
        <InputLabel id="time-select-label">시간 선택</InputLabel>
        <Select
          labelId="time-select-label"
          label="시간 선택"
          name={name}
          value={time}
          onChange={onChangeTime}
        >
          {timeOption.map((option) => (
            <MenuItem key={option} value={option}>
              {`${option < 12 ? '오전' : '오후'} ${option < 13 ? option : option - 12}:00`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default DateTimePicker;
