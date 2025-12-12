import RadioChecked from '@/assets/icons/radio-checked.svg?react';
import RadioEmpty from '@/assets/icons/radio-empty.svg?react';
import { twMerge } from '@/lib/twMerge';

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
        <RadioChecked className="h-5 w-5 md:h-6 md:w-6" />
      ) : (
        <RadioEmpty className="h-5 w-5 md:h-6 md:w-6" />
      )}
      <span
        className={twMerge(
          `text-xsmall14 md:text-xsmall16`,
          !checked && 'text-neutral-0',
          checked && 'font-semibold',
        )}
      >
        {label}
      </span>
    </div>
  );
};

export default RadioButton;
