import clsx from 'clsx';
import { memo } from 'react';

interface FilterCheckboxProps {
  caption: string;
  isChecked: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  className?: string;
}

const FilterCheckbox = ({
  caption,
  isChecked,
  onClick,
  className,
}: FilterCheckboxProps) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'my-1.5 flex cursor-pointer items-center gap-1 md:my-0 md:gap-3',
        className,
      )}
    >
      <img
        className="w-6 shrink-0"
        src={`/icons/${isChecked ? 'checkbox-fill.svg' : 'checkbox-fill-none.svg'}`}
        alt="체크박스"
      />
      <span className="text-xsmall16 text-neutral-35">{caption}</span>
    </div>
  );
};

const isEqual = (
  oldProps: FilterCheckboxProps,
  newProps: FilterCheckboxProps,
) => oldProps.isChecked === newProps.isChecked;

export default memo(FilterCheckbox, isEqual);
