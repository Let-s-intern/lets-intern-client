'use client';

import CheckboxActive from '@/assets/icons/checkbox-active.svg?react';
import CheckboxInActive from '@/assets/icons/checkbox-inactive.svg?react';
import BaseBottomSheet from '@/common/sheet/BaseBottomSheet';
import { twMerge } from '@/lib/twMerge';
import { FilterItem } from '@/types/common';
import { useMediaQuery } from '@mui/material';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { memo, ReactNode, useCallback, useEffect, useState } from 'react';

interface Props {
  label: string;
  list: FilterItem[];
  dropdownClassName?: string;
  listItemClassName?: string;
  paramKey: string;
  onChange?: () => void; // 필터를 선택했을 때 핸들링
}

function BlogFilter({
  label,
  list,
  dropdownClassName,
  listItemClassName,
  paramKey,
  onChange,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [checkedList, setCheckedList] = useState<FilterItem[]>([]);

  const isDesktop = useMediaQuery('(min-width: 768px)');

  const caption =
    checkedList.length > 0
      ? checkedList.length > 1
        ? `${checkedList[0].caption} 외 ${checkedList.length - 1}개`
        : checkedList[0].caption
      : '전체';
  const isAllSelected =
    checkedList.length === 0 || checkedList.length === list.length;

  const updateParams = useCallback(
    (params: URLSearchParams) => {
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router],
  );

  const handleClickItem = (item: FilterItem) => {
    if (onChange) onChange();
    /* 쿼리 스트링으로 선택된 아이템 추가 */
    const params = new URLSearchParams(searchParams.toString());
    const alreadyIncluded = checkedList.some(
      (ele: FilterItem) => ele.value === item.value,
    );

    if (alreadyIncluded) {
      const filtered = checkedList.filter((ele) => ele.value !== item.value);
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
    updateParams(params);
  };

  const handleAllClick = useCallback(() => {
    if (onChange) onChange();
    // 선택을 모두 해제하거나 필터를 모두 선택하면
    if (isAllSelected) return;

    // '전체'를 선택하면
    const params = new URLSearchParams(searchParams.toString());
    params.delete(paramKey);
    updateParams(params);
  }, [isAllSelected, updateParams, searchParams, onChange, paramKey]);

  /* 쿼리 파라미터로 필터 설정 */
  useEffect(() => {
    const findItem = (value: string | undefined): FilterItem | undefined => {
      if (value === undefined) return undefined;

      return list.find((item) => item.value === value) as
        | FilterItem
        | undefined;
    };

    const paramValue = searchParams.get(paramKey);
    setCheckedList(
      paramValue
        ? (paramValue.toUpperCase().split(',').map(findItem) as FilterItem[])
        : [],
    );
  }, [searchParams, list, paramKey]);

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
          <span className="font-semibold text-primary">{caption}</span>
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
                <FilterListItem
                  key="all"
                  className={listItemClassName}
                  item={{
                    caption: '전체',
                    value: 'all',
                  }}
                  isLastItem={false}
                  checked={isAllSelected}
                  selected={isAllSelected}
                  onClick={handleAllClick}
                />

                {list.map((item, index) => (
                  <FilterListItem
                    key={item.value}
                    className={listItemClassName}
                    item={item}
                    isLastItem={index === list.length - 1}
                    checked={checkedList.some(
                      (ele) => ele.value === item.value,
                    )}
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
              'absolute top-12 z-10 w-full rounded-xxs bg-white px-3 py-2 shadow-[0_0_20px_0_rgba(164,168,179,0.25)]',
              dropdownClassName,
            )}
          >
            <FilterListItem
              key="all"
              className={twMerge('py-2', listItemClassName)}
              item={{
                caption: '전체',
                value: 'all',
              }}
              isLastItem={false}
              checked={isAllSelected}
              selected={isAllSelected}
              onClick={handleAllClick}
            />

            {list.map((item, index) => (
              <FilterListItem
                key={item.value}
                className={twMerge('py-2', listItemClassName)}
                item={item}
                isLastItem={index === list.length - 1}
                checked={checkedList.some((ele) => ele.value === item.value)}
                onClick={() => handleClickItem(item)}
              />
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default memo(BlogFilter);

const FilterListItem = ({
  item,
  isLastItem,
  checked = false,
  onClick,
  className,
}: {
  item: FilterItem;
  isLastItem: boolean;
  checked?: boolean;
  selected?: boolean;
  onClick?: (item: FilterItem) => void;
  className?: string;
}) => {
  return (
    <li
      key={item.value}
      className={twMerge(
        'flex cursor-pointer items-center justify-between py-3',
        isLastItem ? '' : 'border-b border-neutral-90',
        className,
      )}
      value={item.value}
      onClick={() => onClick && onClick(item)}
    >
      <FilterCaption checked={checked}>{item.caption}</FilterCaption>
    </li>
  );
};

const FilterCaption = memo(function FilterCaption({
  checked = false,
  children,
}: {
  checked?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="text-xsmall14 font-medium text-neutral-10">
      <div className="flex items-center gap-2">
        {checked ? (
          <CheckboxActive className="h-6 w-6" />
        ) : (
          <CheckboxInActive className="h-6 w-6" />
        )}
        {children}
      </div>
    </div>
  );
});
