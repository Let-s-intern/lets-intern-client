'use client';

import { useEffect, useRef, useState } from 'react';

import DownIcon from '@/assets/icons/down-gray.svg?react';
import { twMerge } from '@/lib/twMerge';

interface DropdownOption<Value extends string> {
  value: Value;
  label: string;
}

interface DropdownProps<Value extends string> {
  options: readonly DropdownOption<Value>[];
  value: Value;
  onChange: (value: Value) => void;
  size?: 'small' | 'medium' | 'large';
  type?: 'solid' | 'ghost';
  icon?: boolean;
  width?: number;
  className?: string;
}

const SIZE_PADDING_Y: Record<'small' | 'medium' | 'large', string> = {
  small: 'py-[5px]',
  medium: 'py-[7px]',
  large: 'py-[9px]',
};

const TYPE_STYLE: Record<'solid' | 'ghost', string> = {
  solid: 'border border-neutral-80 bg-static-100',
  ghost: 'bg-static-100',
};

interface MenuProps<Value extends string> {
  options: readonly DropdownOption<Value>[];
  value: Value;
  onSelect: (value: Value) => void;
}

const Menu = <Value extends string>({
  options,
  value,
  onSelect,
}: MenuProps<Value>) => (
  <ul className="absolute right-0 top-full z-10 mt-1 min-w-full divide-y divide-neutral-95 rounded-xs bg-static-100 px-1 py-1.5 shadow-07">
    {options.map((option) => (
      <li
        key={option.value}
        onClick={() => onSelect(option.value)}
        className={twMerge(
          'cursor-pointer whitespace-nowrap rounded-xs px-3 py-2 text-xsmall14 text-neutral-0 hover:bg-neutral-95',
          option.value === value ? 'font-medium text-primary' : '',
        )}
      >
        {option.label}
      </li>
    ))}
  </ul>
);

const Dropdown = <Value extends string>({
  options,
  value,
  onChange,
  size = 'medium',
  type = 'solid',
  icon = true,
  width,
  className,
}: DropdownProps<Value>) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const selected = options.find((option) => option.value === value);

  return (
    <div ref={rootRef} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        style={width ? { width } : undefined}
        className={twMerge(
          'flex items-center justify-between gap-1.5 rounded-xs px-3 text-xsmall14 text-neutral-0',
          SIZE_PADDING_Y[size],
          TYPE_STYLE[type],
          className,
        )}
      >
        <span className="min-w-0 truncate">{selected?.label}</span>
        {icon && (
          <DownIcon
            className={twMerge(
              'shrink-0 text-neutral-50 transition-transform',
              isOpen && 'rotate-180',
            )}
          />
        )}
      </button>

      {isOpen && (
        <Menu
          options={options}
          value={value}
          onSelect={(selectedValue) => {
            onChange(selectedValue);
            setIsOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Dropdown;
