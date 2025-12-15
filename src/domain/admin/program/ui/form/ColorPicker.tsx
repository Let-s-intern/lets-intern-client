interface ColorPickerProps {
  label: string;
  id: string;
  name: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ColorPicker = ({
  label,
  id,
  name,
  value,
  onChange,
}: ColorPickerProps) => {
  return (
    <div className="ml-4 flex items-center gap-4">
      <label htmlFor={id} className="w-[8rem] font-medium">
        {label}
      </label>
      <input
        id={id}
        type="color"
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default ColorPicker;
