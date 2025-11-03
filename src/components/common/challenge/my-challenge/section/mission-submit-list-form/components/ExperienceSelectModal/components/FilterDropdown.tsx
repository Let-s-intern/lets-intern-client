'use client';

import { Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  labelPrefix: string;
  options: FilterOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  width?: string;
}

export const FilterDropdown = ({
  labelPrefix,
  options,
  selectedValue,
  onSelect,
  width = 'w-48',
}: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getFilterLabel = () => {
    const selectedOption = options.find(
      (option) => option.value === selectedValue,
    );
    return selectedOption?.label || options[0].label;
  };

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
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
        onClick={toggleDropdown}
        className={`flex ${width} items-center justify-between gap-1.5 rounded-sm border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50`}
      >
        <span>{labelPrefix} </span>
        <span className="text-primary-dark">{getFilterLabel()}</span>

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
        <div
          className={`absolute z-20 mt-1 w-full rounded-sm border border-gray-300 bg-white shadow-lg`}
        >
          {options.map((option) => {
            const isSelected = option.value === selectedValue;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                {option.label}
                {isSelected && <Check size={20} className="text-primary-80" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
