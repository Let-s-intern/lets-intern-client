'use client';

import CheckboxActive from '@/assets/icons/checkbox-active.svg?react';
import CheckboxInActive from '@/assets/icons/checkbox-inactive.svg?react';
import BaseBottomSheet from '@/common/BaseBottomSheet';
import { twMerge } from '@/lib/twMerge';
import { FilterItem } from '@/types/common';
import { useMediaQuery } from '@mui/material';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { memo, ReactNode, useCallback, useEffect, useState } from 'react';

interface Props {
  label: string;
  paramKey: string;
  childParamKeys?: string[];
  list: FilterItem[];
  multiSelect?: boolean;
  dropdownClassName?: string;
  listItemClassName?: string;
  onChange?: () => void;
}

function FilterDropdown({
  label,
  paramKey,
  childParamKeys,
  list,
  multiSelect = false,
  dropdownClassName,
  listItemClassName,
  onChange,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  // 단일 선택
  const [selectedItem, setSelectedItem] = useState<FilterItem | undefined>(
    undefined,
  );
  // 중복 선택
  const [checkedList, setCheckedList] = useState<FilterItem[]>([]);

  const isDesktop = useMediaQuery('(min-width: 768px)');

  const multiSelectCaption =
    checkedList.length > 0
      ? checkedList.length > 1
        ? `${checkedList[0].caption} 외 ${checkedList.length - 1}개`
        : checkedList[0].caption
      : '전체';

  const isAllSelected = multiSelect
    ? checkedList.length === 0 || checkedList.length === list.length
    : !selectedItem;

  const handleQueryParams = (item: FilterItem) => {
    if (onChange) onChange();
    // 쿼리 스트링으로 선택된 아이템 추가
    if (paramKey) {
      const params = new URLSearchParams(searchParams.toString());

      if (multiSelect) {
        const alreadyIncluded = checkedList.some(
          (ele: FilterItem) => ele.value === item.value,
        );
        if (alreadyIncluded) {
          const filtered = checkedList.filter(
            (ele) => ele.value !== item.value,
          );
          if (filtered.length === 0) {
            params.delete(paramKey);
          } else {
            params.set(
              paramKey,
              filtered
                .map((ele) => ele.value)
                .join(',')
                .toLowerCase(),
            );
          }
        } else {
          params.set(
            paramKey,
            [...checkedList, item]
              .map((ele) => ele.value)
              .join(',')
              .toLowerCase(),
          );
        }
      } else {
        if (selectedItem?.value === item.value) {
          params.delete(paramKey);
        } else {
          params.set(paramKey, item.value.toLowerCase());
        }
      }
      childParamKeys?.forEach((childLabel) => {
        params.delete(childLabel);
      });

      router.replace(`${pathname}?${params.toString()}`);
    }
  };

  const handleClickItem = (item: FilterItem) => {
    handleQueryParams(item);
    if (!multiSelect) {
      setIsOpen(false);
    }
  };

  const handleAllClick = useCallback(() => {
    if (onChange) onChange();
    if (isAllSelected) {
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.delete(paramKey);
    childParamKeys?.forEach((childLabel) => {
      params.delete(childLabel);
    });
    router.replace(`${pathname}?${params.toString()}`);
  }, [
    childParamKeys,
    isAllSelected,
    paramKey,
    pathname,
    router,
    searchParams,
    onChange,
  ]);

  useEffect(() => {
    const findItem = (value: string | undefined): FilterItem | undefined => {
      if (value === undefined) return undefined;
      return list.find((item) => item.value === value) as
        | FilterItem
        | undefined;
    };

    const paramValue = searchParams.get(paramKey);

    if (!multiSelect) {
      setSelectedItem(findItem(paramValue?.toUpperCase() ?? undefined));
    } else {
      setCheckedList(
        paramValue
          ? (paramValue
              .toUpperCase()
              .split(',')
              .map(findItem)
              .filter(Boolean) as FilterItem[])
          : [],
      );
    }
  }, [searchParams, paramKey, multiSelect, list]);

  return (
    <>
      {/* 필터 바깥 클릭 시 필터 닫기 */}
      {isOpen && isDesktop && (
        <div className="fixed inset-0" onClick={() => setIsOpen(false)} />
      )}

      {/* 필터 바디 */}
      <div className="relative flex shrink-0 flex-col">
        <div
          className={clsx(
            `flex min-w-[8.5rem] max-w-fit cursor-pointer items-center gap-2 rounded-xxs border bg-[#FBFBFC] px-3 py-2 text-xsmall14 md:text-xsmall16 ${isOpen ? 'border-primary' : 'border-neutral-90'}`,
          )}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="font-medium text-neutral-20">{label}</span>
          <span className="font-semibold text-primary">
            {multiSelect
              ? multiSelectCaption
              : selectedItem
                ? selectedItem.caption
                : '전체'}
          </span>
          <ChevronDown size={20} />
        </div>

        {/* 모바일 바텀 시트 */}
        {!isDesktop && (
          <BaseBottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <div className="px-1">
              <span className="mb-4 block text-small18 font-semibold text-neutral-0">
                {label}
              </span>
              <ul className="max-h-[60vh] overflow-y-auto">
                <FilterList
                  key="all"
                  className={clsx(listItemClassName)}
                  item={{
                    caption: '전체',
                    value: 'all',
                  }}
                  isLastItem={false}
                  multiSelect={multiSelect}
                  checked={isAllSelected}
                  selected={isAllSelected}
                  onClick={handleAllClick}
                />

                {list.map((item, index) => (
                  <FilterList
                    key={item.value}
                    className={clsx(listItemClassName)}
                    item={item}
                    isLastItem={index === list.length - 1}
                    multiSelect={multiSelect}
                    checked={checkedList.some(
                      (ele) => ele.value === item.value,
                    )}
                    selected={
                      !multiSelect && item.value === selectedItem?.value
                    }
                    onClick={() => handleClickItem(item)}
                  />
                ))}
              </ul>
            </div>
          </BaseBottomSheet>
        )}

        {/* 데스크탑 드롭다운 */}
        {isOpen && isDesktop && (
          <ul
            className={twMerge(
              'absolute top-12 z-10 w-max rounded-xxs bg-white px-3 py-2 shadow-[0_0_20px_0_rgba(164,168,179,0.25)]',
              dropdownClassName,
            )}
          >
            <FilterList
              key="all"
              className={clsx(listItemClassName)}
              item={{
                caption: '전체',
                value: 'all',
              }}
              isLastItem={false}
              multiSelect={multiSelect}
              checked={isAllSelected}
              selected={isAllSelected}
              onClick={handleAllClick}
            />

            {list.map((item, index) => (
              <FilterList
                key={item.value}
                className={clsx(listItemClassName)}
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
    </>
  );
}

export default memo(FilterDropdown);

const FilterList = ({
  item,
  isLastItem,
  multiSelect = false,
  checked = false,
  selected = false,
  onClick,
  className,
}: {
  item: FilterItem;
  isLastItem: boolean;
  multiSelect?: boolean;
  checked?: boolean;
  selected?: boolean;
  onClick?: (item: FilterItem) => void;
  className?: string;
}) => {
  return (
    <li
      key={item.value}
      className={twMerge(
        'flex h-10 cursor-pointer items-center justify-between pr-2',
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
      {!multiSelect && selected && (
        <img className="h-6 w-6" src="/icons/check-box.svg" alt="체크박스" />
      )}
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
    <div className="text-xsmall14 font-medium text-neutral-10">
      {multiSelect ? (
        <div className="flex items-center gap-2">
          {checked ? (
            <CheckboxActive className="h-6 w-6" />
          ) : (
            <CheckboxInActive className="h-6 w-6" />
          )}
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
});
