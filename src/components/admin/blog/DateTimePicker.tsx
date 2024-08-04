import { FormHelperText } from '@mui/material';

interface DateTimePickerProps {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const DateTimePicker = ({ value, onChange }: DateTimePickerProps) => {
  return (
    <div className="flex flex-col">
      <label htmlFor="displayDate" className="font-medium">
        게시 일자
      </label>
      <FormHelperText>미래 날짜를 선택해주세요.</FormHelperText>
      <input
        className="mt-2 w-60"
        id="displayDate"
        type="datetime-local"
        name="displayDate"
        required
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default DateTimePicker;
