interface DateTimePickerProps {
  label: string;
  id: string;
  name: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DateTimePicker = ({
  label,
  id,
  name,
  value,
  onChange,
}: DateTimePickerProps) => {
  return (
    <div className="ml-4 flex items-center gap-4">
      <label htmlFor={id} className="w-[8rem] font-medium">
        {label}
      </label>
      <input
        id={id}
        type="datetime-local"
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default DateTimePicker;
