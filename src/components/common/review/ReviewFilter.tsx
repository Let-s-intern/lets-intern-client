'use client';

import { useMediaQuery } from '@mui/material';
import clsx from 'clsx';
import { Check, ChevronDown, SquareCheck } from 'lucide-react';
import { memo, useState } from 'react';

interface FilterItem {
  caption: string;
  value: string;
}

interface Props {
  label: string;
  defaultValue: string;
  list: FilterItem[];
  multiSelect?: boolean;
  onSelect?: (value: string) => void;
}

function ReviewFilter({
  label,
  defaultValue,
  list,
  multiSelect = false,
  onSelect,
}: Props) {
  const findItem = (value: string) =>
    list.find((item) => item.value === value) as FilterItem | undefined;

  const [isOpen, setIsOpen] = useState(false);
  // 단일 선택
  const [selectedItem, setSelectedItem] = useState(() =>
    findItem(defaultValue),
  );
  // 중복 선택
  const [checkedList, setCheckedList] = useState<FilterItem[]>(() =>
    findItem(defaultValue) ? [findItem(defaultValue)!] : [],
  );

  const isDesktop = useMediaQuery('(min-width: 768px)');

  const handleClickItem = (item: FilterItem) => {
    if (onSelect) onSelect(item.value);

    // 중복 선택
    if (multiSelect) {
      setCheckedList((prev) => {
        const alreadyIncluded = prev.some(
          (ele: FilterItem) => ele.value === item.value,
        );
        return alreadyIncluded
          ? prev.filter((ele) => ele.value !== item.value)
          : [...prev, item];
      });
    } else {
      // 단일 선택
      setIsOpen(false);
      setSelectedItem(item);
    }
  };

  return (
    <div className="flex flex-col relative w-fit">
      <div
        className={`cursor-pointer rounded-xxs md:text-xsmall16 text-xxsmall12 py-2 flex gap-2 min-w-[8.5rem] px-3 border  bg-[#FBFBFC] ${isOpen ? 'border-primary' : 'border-neutral-90'}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="font-medium text-neutral-20">{label}</span>
        <span className="font-bold text-primary">
          {multiSelect
            ? checkedList.length > 0 &&
              (checkedList.length > 1
                ? `${checkedList[0].caption}외 ${checkedList.length - 1}개`
                : checkedList[0].caption)
            : selectedItem?.caption}
        </span>
        <ChevronDown size={20} />
      </div>

      {/* 데스크탑 드롭다운 */}
      {isOpen && isDesktop && (
        <ul className="bg-white z-10 absolute w-full top-12 shadow-[0_0_20px_0_rgba(164,168,179,0.25)] rounded-xxs py-2 px-3">
          {list.map((item, index) => (
            <li
              key={item.value}
              className={clsx(
                'cursor-pointer justify-between flex items-center py-2',
                {
                  // 마지막 아이템은 border 없음
                  'border-b border-neutral-90': index !== list.length - 1,
                },
              )}
              value={item.value}
              onClick={() => handleClickItem(item)}
            >
              <div className="flex items-center gap-2">
                {multiSelect && (
                  <SquareCheck
                    color="#CFCFCF"
                    fill={
                      // 체크 여부
                      checkedList.some((ele) => ele.value === item.value)
                        ? '#5F66F6'
                        : 'white'
                    }
                  />
                )}
                {item.caption}
              </div>
              {/* 선택된 아이템에 체크 표시 */}
              {!multiSelect && item.value === selectedItem?.value && (
                <Check size={20} color="#4D55F5" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default memo(ReviewFilter);
