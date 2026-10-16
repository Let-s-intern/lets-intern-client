'use client';

import clsx from 'clsx';

interface ChipOption<Value extends string> {
  value: Value;
  label: string;
}

interface CategoryChipsProps<Value extends string> {
  options: ChipOption<Value>[];
  selected: Value;
  onChange: (value: Value) => void;
  /** 컨테이너 className (sticky·bg·padding 등 주입) */
  className?: string;
  /** 선택 칩 색상 override (기본: bg-neutral-10 text-neutral-100) */
  activeClassName?: string;
  /** 미선택 칩 색상 override (기본: bg-neutral-90 text-neutral-40 hover:bg-neutral-80) */
  inactiveClassName?: string;
}

const DEFAULT_ACTIVE = 'bg-neutral-10 text-neutral-100';
const DEFAULT_INACTIVE = 'bg-neutral-90 text-neutral-40 hover:bg-neutral-80';

const CategoryChips = <Value extends string>({
  options,
  selected,
  onChange,
  className,
  activeClassName,
  inactiveClassName,
}: CategoryChipsProps<Value>) => {
  return (
    <div
      className={clsx(
        'scrollbar-hide flex gap-2 overflow-x-auto whitespace-nowrap',
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
              'md:text-xsmall16 text-xsmall14 shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 leading-5 transition-colors md:px-4',
              isActive
                ? (activeClassName ?? DEFAULT_ACTIVE)
                : (inactiveClassName ?? DEFAULT_INACTIVE),
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export { CategoryChips };
