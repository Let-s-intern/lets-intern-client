'use client';

import CheckboxActive from '@/assets/icons/checkbox-active.svg?react';
import CheckboxInActive from '@/assets/icons/checkbox-inactive.svg?react';
import { twMerge } from '@/lib/twMerge';
import BaseBottomSheet from '@components/ui/BaseBottomSheet';
import { useMediaQuery } from '@mui/material';
import { Check, ChevronDown } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { memo, ReactNode, useState } from 'react';

export interface ReviewFilterItem {
  caption: string;
  value: string;
}

interface Props {
  label: string;
  labelValue?: string;
  defaultValue?: string;
  list: ReviewFilterItem[];
  multiSelect?: boolean;
  onSelect?: (value: string) => void;
}

function ReviewFilter({
  label,
  labelValue,
  defaultValue,
  list,
  multiSelect = false,
  onSelect,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const findItem = (
    value: string | undefined,
  ): ReviewFilterItem | undefined => {
    if (value === undefined) return undefined;
    list.find((item) => item.value === value) as ReviewFilterItem | undefined;
  };

  const [isOpen, setIsOpen] = useState(false);
  // 단일 선택
  const [selectedItem, setSelectedItem] = useState<
    ReviewFilterItem | undefined
  >(() => findItem(defaultValue));
  // 중복 선택
  const [checkedList, setCheckedList] = useState<ReviewFilterItem[]>(() =>
    findItem(defaultValue) ? [findItem(defaultValue)!] : [],
  );

  const isDesktop = useMediaQuery('(min-width: 768px)');

  const handleQueryParams = (item: ReviewFilterItem) => {
    // 쿼리 스트링으로 선택된 아이템 추가
    if (labelValue) {
      const params = new URLSearchParams(searchParams.toString());

      if (multiSelect) {
        const alreadyIncluded = checkedList.some(
          (ele: ReviewFilterItem) => ele.value === item.value,
        );
        if (alreadyIncluded) {
          const filtered = checkedList.filter(
            (ele) => ele.value !== item.value,
          );
          if (filtered.length === 0) {
            params.delete(labelValue);
          } else {
            params.set(labelValue, filtered.map((ele) => ele.value).join(','));
          }
        } else {
          params.set(
            labelValue,
            [...checkedList, item].map((ele) => ele.value).join(','),
          );
        }
      } else {
        params.set(labelValue, item.value);
      }

      router.replace(`${pathname}?${params.toString()}`);
    }
  };

  const multiSelectCaption =
    checkedList.length > 0
      ? checkedList.length > 1
        ? `${checkedList[0].caption}외 ${checkedList.length - 1}개`
        : checkedList[0].caption
      : '전체';

  const handleClickItem = (item: ReviewFilterItem) => {
    if (onSelect) onSelect(item.value);

    // 중복 선택
    if (multiSelect) {
      setCheckedList((prev) => {
        const alreadyIncluded = prev.some(
          (ele: ReviewFilterItem) => ele.value === item.value,
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

    if (labelValue) handleQueryParams(item);
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
        <BaseBottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="px-1">
            <span className="block mb-4 text-small18 font-semibold text-neutral-0 ">
              {label}
            </span>
            <ul>
              {list.map((item, index) => (
                <FilterList
                  key={item.value}
                  item={item}
                  isLastItem={index === list.length - 1}
                  multiSelect={multiSelect}
                  checked={checkedList.some((ele) => ele.value === item.value)}
                  selected={!multiSelect && item.value === selectedItem?.value}
                  onClick={() => handleClickItem(item)}
                />
              ))}
            </ul>
          </div>
        </BaseBottomSheet>
      )}

      {/* 데스크탑 드롭다운 */}
      {isOpen && isDesktop && (
        <ul className="bg-white z-10 absolute w-full top-12 shadow-[0_0_20px_0_rgba(164,168,179,0.25)] rounded-xxs py-2 px-3">
          {list.map((item, index) => (
            <FilterList
              key={item.value}
              className="py-2"
              item={item}
              isLastItem={index === list.length - 1}
              multiSelect={multiSelect}
              checked={checkedList.some((ele) => ele.value === item.value)}
              selected={!multiSelect && item.value === selectedItem?.value}
              onClick={() => handleClickItem(item)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default memo(ReviewFilter);

const FilterList = ({
  item,
  isLastItem,
  multiSelect = false,
  checked = false,
  selected = false,
  onClick,
  className,
}: {
  item: ReviewFilterItem;
  isLastItem: boolean;
  multiSelect?: boolean;
  checked?: boolean;
  selected?: boolean;
  onClick?: (item: ReviewFilterItem) => void;
  className?: string;
}) => {
  return (
    <li
      key={item.value}
      className={twMerge(
        'cursor-pointer justify-between flex items-center py-3',
        isLastItem ? '' : 'border-b border-neutral-90',
        className,
      )}
      value={item.value}
      onClick={() => onClick && onClick(item)}
    >
      <FilterCaption multiSelect={multiSelect} checked={checked}>
        {item.caption}
      </FilterCaption>
      {/* [단일 선택] 선택된 아이템에 체크 표시 */}
      {!multiSelect && selected && <Check size={16} color="#4D55F5" />}
    </li>
  );
};

const FilterCaption = memo(function FilterCaption({
  multiSelect,
  checked = false,
  children,
}: {
  multiSelect: boolean;
  checked?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="text-xsmall14 font-semibold text-neutral-10">
      {multiSelect ? (
        <div className="flex items-center gap-2">
          {checked ? (
            <CheckboxActive className="w-6 h-6" />
          ) : (
            <CheckboxInActive className="w-6 h-6" />
          )}
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
});
