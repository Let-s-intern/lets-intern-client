import { memo } from 'react';

interface FilterCheckboxProps {
  caption: string;
  isChecked: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const FilterCheckbox = ({
  caption,
  isChecked,
  onClick,
}: FilterCheckboxProps) => {
  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer items-center gap-2 px-2 py-2.5"
    >
      <img
        className="w-8"
        src={`/icons/${
          isChecked ? 'checkbox-fill.svg' : 'checkbox-unchecked.svg'
        }`}
        alt="체크박스"
      />
      <span className="text-1 text-neutral-0/75">{caption}</span>
    </div>
  );
};

const isEqual = (
  oldProps: FilterCheckboxProps,
  newProps: FilterCheckboxProps,
) => oldProps.isChecked === newProps.isChecked;

export default memo(FilterCheckbox, isEqual);
