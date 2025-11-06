'use client';


import BottomSheet from '@components/common/ui/BottomSheeet';
import Button from '@components/common/ui/button/Button';
import CheckBox from '@components/common/ui/CheckBox';

import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface FilterOption {
  value: string;
  label: string;
}

interface MultiFilterDropdownProps {
  labelPrefix: string;
  options: FilterOption[];
  selectedValues: string[];
  onSelect: (value: string) => void;
  onReset?: () => void;
  width?: string;
}

export const MultiFilterDropdown = ({
  labelPrefix,
  options,
  selectedValues,
  onSelect,
  onReset,
  width = 'w-48',
}: MultiFilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState({});

  // 필터 버튼에 맞게 드롭다운 위치와 너비 설정
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        zIndex: 50,
        top: `${rect.bottom + 4}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
      });
    }
  }, [isOpen, selectedValues]);

  const getFilterLabel = () => {
    if (selectedValues.length === 0) {
      return '전체';
    }

    // selectedValues 중 options 배열에서 가장 앞에 있는 항목 찾기
    const selectedOption = options.find((option) =>
      selectedValues.includes(option.value),
    );

    if (selectedValues.length === 1) {
      return selectedOption?.label;
    }
    return `${selectedOption?.label} 외 N`;
  };

  const handleSelect = (value: string) => {
    onSelect(value);
  };

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        ref={buttonRef}
        onClick={toggleDropdown}
        className={`flex ${width} items-center justify-between gap-1.5 rounded-xs border border-neutral-80 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50`}
      >
        <span className="whitespace-nowrap">{labelPrefix} </span>
        <span className="whitespace-nowrap text-primary-dark">
          {getFilterLabel()}
        </span>

        <svg
          className={`h-4 w-4 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <>
          <div
            className={`shadow-07 hidden max-h-[28.125rem] w-full divide-y divide-neutral-95 overflow-auto rounded-xs bg-white px-1 py-1.5 scrollbar-hide md:block`}
            style={dropdownStyle}
          >
            {options.map((option) => {
              const isSelected =
                selectedValues.includes(option.value) ||
                (selectedValues.length === 0 && option.value === 'ALL');

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className="flex w-full items-center gap-1 px-2 py-1.5 text-left text-sm text-neutral-20 hover:bg-gray-100"
                >
                  <CheckBox checked={isSelected} width="w-6" />

                  {option.label}
                </button>
              );
            })}
          </div>

          <BottomSheet className="md:hidden">
            <div className="flex max-h-[62vh] w-full flex-col">
              <header className="flex items-center justify-between pb-4">
                <span className="text-lg font-semibold text-neutral-0">
                  {labelPrefix}
                </span>

                <X
                  onClick={toggleDropdown}
                  className="cursor-pointer self-end text-neutral-0"
                />
              </header>

              <div className="flex flex-col gap-1.5 overflow-y-auto pb-20 scrollbar-hide">
                {options.map((option) => {
                  const isSelected =
                    selectedValues.includes(option.value) ||
                    (selectedValues.length === 0 && option.value === 'ALL');

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className="flex w-full items-center gap-1 py-2 text-left font-normal text-neutral-20"
                    >
                      <CheckBox checked={isSelected} width="w-6" />

                      {option.label}
                    </button>
                  );
                })}
              </div>

              <footer className="fixed bottom-0 left-0 flex w-full gap-2 border-t border-neutral-85 bg-white px-5 py-4">
                <Button
                  color="white"
                  onClick={onReset}
                  className="w-1/4 rounded-xs"
                >
                  초기화
                </Button>
                <Button
                  onClick={() => {
                    setIsOpen(false);
                  }}
                  className="w-3/4 rounded-xs"
                >
                  선택 완료
                </Button>
              </footer>
            </div>
          </BottomSheet>
        </>
      )}
    </div>
  );
};
