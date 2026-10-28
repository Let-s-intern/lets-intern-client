import ChoiceCard from './ChoiceCard';

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
}: RadioInputProps) => (
  <div role="radiogroup" className="grid gap-2">
    {choices.map((choice, index) => (
      <ChoiceCard
        key={choice}
        id={index === 0 ? id : undefined}
        type="radio"
        name={id}
        label={choice}
        checked={value === choice}
        hasError={hasError}
        onChange={() => onChange(choice)}
        onBlur={onBlur}
      />
    ))}
  </div>
);

export default RadioInput;
