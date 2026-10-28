import ChoiceCard from './ChoiceCard';

interface CheckboxInputProps {
  /** 첫 선택지에 붙는 id. 첫 오류 칸 포커스에 쓴다 */
  id: string;
  choices: string[];
  value: string[];
  hasError: boolean;
  onChange: (value: string[]) => void;
  onBlur: () => void;
}

/** 여러 개 고르기. 값은 선택지 순서를 유지한다 */
const CheckboxInput = ({
  id,
  choices,
  value,
  hasError,
  onChange,
  onBlur,
}: CheckboxInputProps) => {
  const toggle = (choice: string) => {
    const next = value.includes(choice)
      ? value.filter((picked) => picked !== choice)
      : [...value, choice];
    onChange(choices.filter((item) => next.includes(item)));
  };

  return (
    <div className="grid gap-2">
      {choices.map((choice, index) => (
        <ChoiceCard
          key={choice}
          id={index === 0 ? id : undefined}
          type="checkbox"
          name={id}
          label={choice}
          checked={value.includes(choice)}
          hasError={hasError}
          onChange={() => toggle(choice)}
          onBlur={onBlur}
        />
      ))}
    </div>
  );
};

export default CheckboxInput;
