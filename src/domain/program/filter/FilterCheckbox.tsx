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
        'flex cursor-pointer items-center gap-3 py-2.5',
        className,
      )}
    >
      <div
        className={clsx(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border',
          isChecked
            ? 'border-primary bg-primary'
            : 'border-neutral-70 bg-static-100',
        )}
      >
        {isChecked && (
          <svg
            width="12"
            height="9"
            viewBox="0 0 12 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 4L4.5 7.5L11 1"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span className="text-0.875 text-neutral-10">{caption}</span>
    </div>
  );
};

const isEqual = (
  oldProps: FilterCheckboxProps,
  newProps: FilterCheckboxProps,
) => oldProps.isChecked === newProps.isChecked;

export default memo(FilterCheckbox, isEqual);
