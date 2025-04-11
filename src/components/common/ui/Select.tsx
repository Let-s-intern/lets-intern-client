'use client';

import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import React, { Fragment, useState } from 'react';

// value: caption
type Options = Record<string, string>;

interface Props {
  label?: string;
  options: Options;
  placeholder?: string;
}

const Select = ({
  label,
  id,
  options,
  required,
  placeholder = '선택해주세요',
}: Props & React.SelectHTMLAttributes<HTMLSelectElement>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  return (
    <>
      {/* 필터 바깥 클릭 시 필터 닫기 */}
      {isOpen && (
        <div className="fixed inset-0" onClick={() => setIsOpen(false)} />
      )}

      <div className="relative">
        {/* label */}
        {label && (
          <label className={clsx({ 'required-star': required })} htmlFor={id}>
            {label}
          </label>
        )}

        {/* select */}
        <div
          className={clsx(
            'mt-1 flex w-full cursor-pointer items-center justify-between rounded-md bg-neutral-95 p-3 text-xsmall14 outline-none',
            { 'border border-primary': selectedValues.length > 0 },
          )}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span
            className={
              selectedValues.length === 0
                ? 'text-neutral-0/35'
                : 'font-medium text-neutral-10'
            }
          >
            {selectedValues.length === 0
              ? placeholder
              : selectedValues.map((v) => options[v]).join(', ')}
          </span>
          <ChevronDown className="max-h-[204px] text-neutral-40" />
        </div>

        {/* option 리스트 */}
        {isOpen && (
          <ul className="absolute mt-2 max-h-[204px] w-full overflow-y-auto rounded-md bg-white px-3 py-2">
            {Object.entries(options).map(([key, value], index) => (
              <Fragment key={key}>
                <li
                  className="flex cursor-pointer items-center justify-between py-2"
                  onClick={() => {
                    if (selectedValues.includes(key)) {
                      // 아이템 삭제
                      setSelectedValues(
                        selectedValues.filter((v) => v !== key),
                      );
                    } else {
                      // 아이템 추가
                      setSelectedValues([...selectedValues, key]);
                    }
                  }}
                  value={key}
                >
                  <span className="font-medium text-neutral-10">{value}</span>
                  {selectedValues.includes(key) && (
                    <i>
                      <img
                        className="h-6 w-6"
                        src="/icons/check-box.svg"
                        alt=""
                      />
                    </i>
                  )}
                </li>
                {/* 마지막 아이템이 아니면 <hr> 추가 */}
                {index < Object.keys(options).length - 1 && <hr />}
              </Fragment>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Select;
