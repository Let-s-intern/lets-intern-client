interface ChipOption<T extends string> {
  value: T;
  label: string;
}

interface ChipCheckboxGroupProps<T extends string> {
  name: string;
  options: readonly ChipOption<T>[];
  value: T[];
  onChange: (value: T[]) => void;
  onBlur?: () => void;
  invalid?: boolean;
}

/** 다중 선택 칩. 네이티브 체크박스를 sr-only 로 두어 키보드·스크린리더 동작을 유지한다 */
export default function ChipCheckboxGroup<T extends string>({
  name,
  options,
  value,
  onChange,
  onBlur,
  invalid,
}: ChipCheckboxGroupProps<T>) {
  const toggle = (option: T, checked: boolean) => {
    onChange(
      checked
        ? options
            .map((o) => o.value)
            .filter((v) => v === option || value.includes(v))
        : value.filter((v) => v !== option),
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <label key={option.value} className="cursor-pointer">
          <input
            type="checkbox"
            name={name}
            value={option.value}
            checked={value.includes(option.value)}
            onChange={(e) => toggle(option.value, e.target.checked)}
            onBlur={onBlur}
            aria-invalid={invalid ? true : false}
            className="peer sr-only"
          />
          <span className="text-xsmall14 border-neutral-80 text-neutral-20 hover:border-neutral-60 peer-checked:border-primary peer-checked:bg-primary-10 peer-checked:text-primary peer-focus-visible:ring-primary-10 inline-block rounded-full border px-4 py-2 transition-colors peer-checked:font-semibold peer-focus-visible:ring-2">
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
}
