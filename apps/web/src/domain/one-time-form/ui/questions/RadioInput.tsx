import { twMerge } from '@/lib/twMerge';
import ChoiceCard, { isChipLayout } from './ChoiceCard';

interface RadioInputProps {
  /** 첫 선택지에 붙는 id. 첫 오류 칸 포커스에 쓴다 */
  id: string;
  choices: string[];
  value: string;
  hasError: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}

const RadioInput = ({
  id,
  choices,
  value,
  hasError,
  onChange,
  onBlur,
}: RadioInputProps) => {
  const chip = isChipLayout(choices);

  return (
    <div
      role="radiogroup"
      className={twMerge('grid gap-2', chip && 'grid-cols-4')}
    >
      {choices.map((choice, index) => (
        <ChoiceCard
          key={choice}
          id={index === 0 ? id : undefined}
          type="radio"
          name={id}
          label={choice}
          checked={value === choice}
          hasError={hasError}
          chip={chip}
          onChange={() => onChange(choice)}
          onBlur={onBlur}
        />
      ))}
    </div>
  );
};

export default RadioInput;
