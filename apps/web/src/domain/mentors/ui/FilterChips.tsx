'use client';

import 'swiper/css';
import 'swiper/css/free-mode';

import { FreeMode } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { twMerge } from '@/lib/twMerge';

interface FilterChipOption<Value extends string> {
  value: Value;
  label: string;
}

interface FilterChipsProps<Value extends string> {
  options: readonly FilterChipOption<Value>[];
  selected: Value;
  onChange: (value: Value) => void;
}

const FilterChips = <Value extends string>({
  options,
  selected,
  onChange,
}: FilterChipsProps<Value>) => {
  return (
    <Swiper
      modules={[FreeMode]}
      slidesPerView="auto"
      spaceBetween={16}
      freeMode={true}
      grabCursor={true}
      threshold={10}
      className="!mx-0 !w-full"
    >
      {options.map((option) => {
        const isActive = option.value === selected;
        const isAllOption = option.value === 'all';

        const textColor = isActive
          ? 'text-neutral-100'
          : isAllOption
            ? 'text-primary-dark'
            : 'text-neutral-0';

        return (
          <SwiperSlide key={option.value} className="!w-auto">
            <button
              type="button"
              onClick={() => onChange(option.value)}
              className={twMerge(
                'text-xsmall14 rounded-full border px-4 py-2 transition-colors',
                textColor,
                isActive
                  ? 'border-[#152B65] bg-[#152B65] font-medium'
                  : 'border-neutral-80 font-regular hover:border-neutral-70',
              )}
            >
              {option.label}
            </button>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default FilterChips;
