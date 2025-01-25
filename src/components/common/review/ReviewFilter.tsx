'use client';

import { useMediaQuery } from '@mui/material';
import clsx from 'clsx';
import { Check, ChevronDown } from 'lucide-react';
import { memo, useState } from 'react';

import CheckboxActive from '@/assets/icons/checkbox-active.svg?react';
import CheckboxInActive from '@/assets/icons/checkbox-inactive.svg?react';
import BaseBottomSheet from '@components/ui/BaseBottomSheet';

interface FilterItem {
  caption: string;
  value: string;
}

interface Props {
  label: string;
  defaultValue?: string;
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

  // 전체 or caption or caption외 N개
  const multiSelectCaption =
    checkedList.length > 0
      ? checkedList.length > 1
        ? `${checkedList[0].caption}외 ${checkedList.length - 1}개`
        : checkedList[0].caption
      : '전체';

  function findItem(value?: string) {
    return list.find((item) => item.value === value);
  }

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
          {multiSelect ? multiSelectCaption : selectedItem?.caption}
        </span>
        <ChevronDown size={20} />
      </div>

      {/* 모바일 바텀 시트 */}
      {!isDesktop && isOpen && (
        <BaseBottomSheet
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        ></BaseBottomSheet>
      )}

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
                {multiSelect &&
                  // 체크박스 체크 여부
                  (checkedList.some((ele) => ele.value === item.value) ? (
                    <CheckboxActive className="w-6 h-6" />
                  ) : (
                    <CheckboxInActive className="w-6 h-6" />
                  ))}
                {item.caption}
              </div>
              {/* [단일 선택] 선택된 아이템에 체크 표시 */}
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
