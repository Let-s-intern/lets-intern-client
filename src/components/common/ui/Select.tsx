import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import React, { Fragment, useState } from 'react';

const DEFAULT_OPTION = {
  value: '',
  caption: '관심 직무를 선택해주세요',
};

interface Option {
  value: string;
  caption: string;
}

interface Props {
  label?: string;
  options: Option[];
}

const Select = ({
  label,
  id,
  options,
  required,
}: Props & React.SelectHTMLAttributes<HTMLSelectElement>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Option>(DEFAULT_OPTION);

  return (
    <div className="relative">
      {label && (
        <label className={clsx({ 'required-star': required })} htmlFor={id}>
          {label}
        </label>
      )}
      <div
        className={clsx(
          'mt-1 flex w-full cursor-pointer items-center justify-between rounded-md bg-neutral-95 p-3 text-xsmall14 outline-none',
          { 'border border-primary': selected.value !== '' },
        )}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span
          className={
            selected.value === ''
              ? 'text-neutral-0/35'
              : 'font-medium text-neutral-10'
          }
        >
          {selected.caption}
        </span>
        <ChevronDown className="max-h-[204px] text-neutral-40" />
      </div>

      {isOpen && (
        <ul className="absolute mt-2 max-h-[204px] w-full overflow-y-auto rounded-md bg-white px-3 py-2">
          {options.map((opt, index) => (
            <Fragment key={opt.value}>
              <li
                className="flex cursor-pointer items-center justify-between py-2"
                onClick={() => {
                  setSelected(opt);
                  setIsOpen(false);
                }}
                value={opt.value}
              >
                <span className="font-medium text-neutral-10">
                  {opt.caption}
                </span>
                {opt.value === selected.value && (
                  <i>
                    <img
                      className="h-6 w-6"
                      src="/icons/check-box.svg"
                      alt=""
                    />
                  </i>
                )}
              </li>
              {/* 마지막 인덱스가 아니면 */}
              {index < options.length - 1 && <hr />}
            </Fragment>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Select;
