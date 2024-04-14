interface DateTimePickerProps {
  label: string;
  id: string;
  name: string;
}

const DateTimePicker = ({ label, id, name }: DateTimePickerProps) => {
  return (
    <div className="ml-4 flex items-center gap-4">
      <label htmlFor={id} className="w-[8rem] font-medium">
        {label}
      </label>
      <input id={id} type="datetime-local" name={name} />
    </div>
  );
};

export default DateTimePicker;
