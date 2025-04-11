'use client';

import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import { Dispatch, memo, SetStateAction } from 'react';
import Label from '../ui/input/Label';

interface Props {
  options: string[];
  selectedOpts: string[];
  isOpen: boolean;
  openDispatch: Dispatch<SetStateAction<boolean>>;
  onClose: () => void;
  onChange?: (value: string) => void;
}

const JobSelect = ({
  options,
  selectedOpts,
  isOpen,
  openDispatch,
  onClose,
  onChange,
}: Props) => {
  const hasSelectedValues = selectedOpts.length > 0;

  return (
    <>
      {/* 드롭다운 바깥 쪽 클릭 시 닫기 */}
      {isOpen && <div className="fixed inset-0" onClick={onClose} />}

      <div className="relative">
        {/* label */}
        <Label required>관심 직무</Label>

        {/* select */}
        <div
          className={clsx(
            'mt-1 flex w-full cursor-pointer items-center justify-between rounded-md border bg-neutral-95 p-3 text-xsmall14 outline-none',
            hasSelectedValues ? 'border-primary' : 'border-neutral-95',
          )}
          onClick={() => openDispatch(!isOpen)}
        >
          <span
            className={
              hasSelectedValues
                ? 'font-medium text-neutral-10'
                : 'text-neutral-0/35'
            }
          >
            {hasSelectedValues
              ? selectedOpts.join(', ')
              : '관심 직무를 선택해주세요요'}
          </span>
          <ChevronDown className="max-h-[204px] text-neutral-40" />
        </div>

        {/* option 리스트 */}
        {isOpen && (
          <ul className="absolute z-10 mt-2 max-h-[204px] w-full overflow-y-auto rounded-md bg-white px-3 py-2">
            {options.map((opt, index) => (
              <OptionListItem
                key={opt}
                isSelected={selectedOpts.includes(opt)}
                value={opt}
                hideHr={index === Object.keys(options).length - 1}
                onClick={() => onChange && onChange(opt)}
              />
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

const OptionListItem = memo(
  function OptionListItem({
    onClick,
    value,
    isSelected = false,
    hideHr = false,
  }: {
    onClick?: () => void;
    value: string;
    isSelected?: boolean;
    hideHr?: boolean;
  }) {
    return (
      <>
        <li
          className="flex cursor-pointer items-center justify-between py-2"
          onClick={onClick}
        >
          <span className="text-xsmall14 font-medium text-neutral-10">
            {value}
          </span>
          {isSelected && (
            <i>
              <img className="h-5 w-5" src="/icons/check-box.svg" alt="" />
            </i>
          )}
        </li>
        {/* 마지막 아이템이 아니면 <hr> 추가 */}
        {!hideHr && <hr />}
      </>
    );
  },
  (oldProps, newProps) => oldProps.isSelected === newProps.isSelected,
);

export default JobSelect;
