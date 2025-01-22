'use client';

import { useMediaQuery } from '@mui/material';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import { memo, useState } from 'react';

interface Props {
  label: string;
  defaultValue?: string;
  list: { caption: string; value: string }[];
  onSelect?: (value: string) => void;
}

function ReviewFilter({ label, defaultValue, list, onSelect }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(
    list.find((item) => item.value === defaultValue),
  );

  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <div className="flex flex-col relative w-fit">
      <div
        className={`cursor-pointer rounded-xxs md:text-xsmall16 text-xxsmall12 py-2 flex items-center gap-2 px-3 border  bg-[#FBFBFC] ${isOpen ? 'border-primary' : 'border-neutral-90'}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="font-medium text-neutral-20">{label}</span>
        <span className="font-bold text-primary">
          {selectedItem?.caption ?? ''}
        </span>
        <ChevronDown size={20} />
      </div>
      {isOpen && isDesktop && (
        <div className="bg-white absolute w-full top-12 shadow-[0_0_20px_0_rgba(164,168,179,0.25)] rounded-xxs py-2 px-3">
          {list.map((item, index) => (
            <option
              key={item.value}
              className={clsx('cursor-pointer py-2', {
                // 마지막 아이템은 border 없음
                'border-b border-neutral-90': index !== list.length - 1,
              })}
              value={item.value}
              onClick={() => {
                if (onSelect) onSelect(item.value);
                setSelectedItem(item);
                setIsOpen(false);
              }}
            >
              {item.caption}
            </option>
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(ReviewFilter);
