import RadioChecked from '@/assets/icons/radio-checked.svg?react';
import RadioEmpty from '@/assets/icons/radio-empty.svg?react';

interface RadioButtonProps {
  color: string;
  checked: boolean;
  label: string;
  onClick: () => void;
}

const RadioButton = ({ color, checked, label, onClick }: RadioButtonProps) => {
  return (
    <div
      className="flex w-full cursor-pointer items-center gap-x-2"
      style={{ color }}
      onClick={onClick}
    >
      {checked ? (
        <RadioChecked width={24} height={24} />
      ) : (
        <RadioEmpty width={24} height={24} />
      )}
      <span className="text-xsmall16 text-neutral-0">{label}</span>
    </div>
  );
};

export default RadioButton;
