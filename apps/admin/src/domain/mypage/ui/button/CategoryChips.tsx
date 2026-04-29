import clsx from 'clsx';

interface CategoryOption<Value extends string> {
  value: Value;
  label: string;
}

interface CategoryChipsProps<Value extends string> {
  options: CategoryOption<Value>[];
  selected: Value;
  onChange: (value: Value) => void;
  className?: string;
}

const CategoryChips = <Value extends string>({
  options,
  selected,
  onChange,
  className,
}: CategoryChipsProps<Value>) => {
  return (
    <div
      className={clsx(
        'scrollbar-hide flex gap-3 overflow-x-auto whitespace-nowrap',
        className,
      )}
    >
      {options.map((option) => {
        const isActive = option.value === selected;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={clsx(
              'text-xsmall14 rounded-full px-3 py-1.5 leading-5',
              'shrink-0 whitespace-nowrap border transition-colors',
              isActive
                ? 'bg-neutral-10 text-neutral-100'
                : 'bg-neutral-90 text-neutral-40 hover:bg-neutral-80',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryChips;
