'use client';

import 'swiper/css';
import 'swiper/css/free-mode';

import { Fragment } from 'react';
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
  const renderChip = (option: FilterChipOption<Value>) => {
    const isActive = option.value === selected;
    const isAllOption = option.value === 'all';

    const textColor = isActive
      ? 'text-neutral-100'
      : isAllOption
        ? 'text-primary-dark'
        : 'text-neutral-0';

    return (
      <button
        type="button"
        onClick={() => onChange(option.value)}
        className={twMerge(
          'text-xxsmall12 md:text-xsmall14 rounded-full border px-3.5 py-1.5 transition-colors md:px-4 md:py-2',
          textColor,
          isActive
            ? 'border-[#152B65] bg-[#152B65] font-medium'
            : 'border-neutral-80 font-regular hover:border-neutral-70',
        )}
      >
        {option.label}
      </button>
    );
  };

  return (
    <>
      {/*
        모바일은 가로로 넘긴다. 필터 바가 화면 위에 붙어 따라오므로(sticky) 줄을 바꾸면
        태그가 많을 때 아래 목록을 가린다.
      */}
      <Swiper
        modules={[FreeMode]}
        slidesPerView="auto"
        spaceBetween={16}
        freeMode={true}
        grabCursor={true}
        threshold={10}
        className="!mx-0 !w-full md:!hidden"
      >
        {options.map((option) => (
          <SwiperSlide key={option.value} className="!w-auto">
            {renderChip(option)}
          </SwiperSlide>
        ))}
      </Swiper>

      {/*
        데스크톱은 줄을 바꾼다. 필터 칸이 세로 배치라 폭이 내용 길이를 따라가는데, Swiper 는
        그 폭만큼 늘어나 태그가 많으면 화면 밖으로 밀려났다.
      */}
      <div className="hidden flex-wrap gap-x-4 gap-y-3 md:flex">
        {options.map((option) => (
          <Fragment key={option.value}>{renderChip(option)}</Fragment>
        ))}
      </div>
    </>
  );
};

export default FilterChips;
