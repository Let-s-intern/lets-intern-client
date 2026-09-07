'use client';

import { twMerge } from '@/lib/twMerge';
import { useEffect, useRef, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

/** 라벨 + 필수(*) + 헬퍼/에러 텍스트 래퍼 */
export function FormField({
  label,
  required,
  helper,
  hideHelperOnMobile,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  helper?: string;
  /** 모바일에서 helper 숨김 (웹에서만 노출) */
  hideHelperOnMobile?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xsmall16 text-neutral-20 font-medium">
        {label}
        {required && <span className="text-primary-90 ml-1">*</span>}
      </label>
      {children}
      {error ? (
        <p className="text-xxsmall12 text-requirement font-normal">{error}</p>
      ) : helper ? (
        <p
          className={twMerge(
            'text-xxsmall12 text-neutral-40 font-normal',
            hideHelperOnMobile && 'hidden md:block',
          )}
        >
          {helper}
        </p>
      ) : null}
    </div>
  );
}

export const inputClassName =
  'w-full rounded-xxs border border-neutral-80 bg-static-100 px-3 py-[9px] text-xsmall14 md:text-xsmall16 font-normal text-neutral-0 placeholder:text-neutral-50 outline-none transition-colors focus:border-primary';

/** 에러 상태 테두리 (텍스트·셀렉트 공용) */
const errorBorderClass = 'border-requirement focus:border-requirement';

/** 텍스트 인풋 (에러 시 테두리 빨강) */
export function TextInput({
  error,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      className={twMerge(inputClassName, error && errorBorderClass, className)}
      {...props}
    />
  );
}

export interface SelectOption {
  value: string;
  label: string;
}

/** 셀렉트 필드 */
export function SelectField({
  value,
  onChange,
  options,
  placeholder,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={twMerge(
          inputClassName,
          'flex items-center justify-between gap-2 text-left',
          open && 'border-primary',
          error && errorBorderClass,
        )}
      >
        <span className={twMerge('truncate', !selected && 'text-neutral-50')}>
          {selected ? selected.label : placeholder}
        </span>
        <FiChevronDown
          className={twMerge(
            'text-neutral-40 h-5 w-5 shrink-0 transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <ul className="shadow-07 border-neutral-80 bg-static-100 rounded-xxs absolute left-0 top-full z-10 mt-1 max-h-60 w-full overflow-auto border py-1">
          {options.map((o) => (
            <li key={o.value}>
              <button
                type="button"
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={twMerge(
                  'text-xsmall16 hover:bg-neutral-95 text-neutral-0 block w-full cursor-pointer px-3 py-2 text-left transition-colors',
                  o.value === value && 'text-primary font-medium',
                )}
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** 칩 하나 */
export function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={twMerge(
        'text-xsmall14 rounded-full border px-4 py-2 transition-colors',
        selected
          ? 'border-primary bg-primary-10 text-primary font-semibold'
          : 'border-neutral-80 bg-static-100 text-neutral-20 hover:border-neutral-60',
      )}
    >
      {children}
    </button>
  );
}

/** 체크박스 + 라벨 (public/icons SVG 사용, native input 은 sr-only 로 접근성 유지) */
export function CheckboxRow({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-1 md:items-center md:gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <img
        src={`/icons/${checked ? 'checkbox-checked.svg' : 'checkbox-unchecked.svg'}`}
        alt=""
        className="mt-[1px] h-4 w-4 shrink-0 md:h-6 md:w-6"
      />
      <span className="text-xxsmall12 md:text-xsmall14 text-neutral-30">
        {children}
      </span>
    </label>
  );
}
