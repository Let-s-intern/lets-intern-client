'use client';

import { WishJobModal } from '@/components/common/challenge/my-challenge/talent-pool/WishJobModal';
import { ComponentProps, useEffect, useRef, useState } from 'react';

const CURRENT_YEAR = new Date().getFullYear();
const START_YEAR = 1990; // 시작 연도 설정
const YEARS = Array.from(
  { length: CURRENT_YEAR - START_YEAR + 1 },
  (_, i) => CURRENT_YEAR - i,
);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

const PeriodSelectItem = ({
  isSelected,
  ...props
}: {
  isSelected: boolean;
} & ComponentProps<'button'>) => {
  return (
    <button
      {...props}
      type="button"
      className={`rounded-xxs px-3 py-1.5 text-left text-xsmall16 font-medium transition-colors ${
        isSelected
          ? 'bg-primary-5 text-primary'
          : 'text-neutral-20 hover:bg-neutral-95'
      }`}
    >
      {props.children}
    </button>
  );
};

interface PeriodSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (year: number, month: number) => void;
  initialYear: number | null;
  initialMonth: number | null;
}

export const PeriodSelectModal = ({
  isOpen,
  onClose,
  onSelect,
  initialYear,
  initialMonth,
}: PeriodSelectModalProps) => {
  const [selectedYear, setSelectedYear] = useState<number | null>(initialYear);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(
    initialMonth,
  );

  const yearListRef = useRef<HTMLDivElement>(null);
  const monthListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedYear(initialYear ?? null);
    setSelectedMonth(initialMonth ?? null);

    // 초기 선택값으로 스크롤
    setTimeout(() => {
      if (initialYear && yearListRef.current) {
        const yearIndex = YEARS.indexOf(initialYear);
        if (yearIndex !== -1) {
          const yearElement = yearListRef.current.children[
            yearIndex
          ] as HTMLElement;
          if (yearElement) {
            yearElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
          }
        }
      }

      if (initialMonth && monthListRef.current) {
        const monthElement = monthListRef.current.children[
          initialMonth - 1
        ] as HTMLElement;
        if (monthElement) {
          monthElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
      }
    }, 100);
  }, [isOpen, initialYear, initialMonth]);

  const handleSelectComplete = () => {
    if (selectedYear !== null && selectedMonth !== null) {
      onSelect(selectedYear, selectedMonth);
      onClose();
    }
  };

  const isCompleteDisabled = selectedYear === null || selectedMonth === null;

  if (!isOpen) return null;

  return (
    <WishJobModal
      title="기간 선택"
      onClose={onClose}
      footer={
        <button
          type="button"
          onClick={handleSelectComplete}
          disabled={isCompleteDisabled}
          className={`w-full rounded-xs px-4 py-3 text-xsmall16 font-medium transition-colors ${
            isCompleteDisabled
              ? 'bg-neutral-70 text-white'
              : 'bg-primary text-white hover:bg-primary-hover'
          }`}
        >
          선택 완료
        </button>
      }
    >
      {/* 연도/월 선택 */}
      <div className="flex flex-1 gap-2 overflow-hidden">
        {/* 연도 컬럼 */}
        <div
          ref={yearListRef}
          className="flex flex-1 flex-col gap-1.5 overflow-y-scroll"
        >
          {YEARS.map((year) => {
            const isSelected = selectedYear === year;
            return (
              <PeriodSelectItem
                key={year}
                isSelected={isSelected}
                onClick={() => setSelectedYear(year)}
              >
                {year}년
              </PeriodSelectItem>
            );
          })}
        </div>

        {/* 월 컬럼 */}
        <div
          ref={monthListRef}
          className="flex flex-1 flex-col gap-1.5 overflow-y-scroll"
        >
          {MONTHS.map((month) => {
            const isSelected = selectedMonth === month;
            return (
              <PeriodSelectItem
                key={month}
                isSelected={isSelected}
                onClick={() => setSelectedMonth(month)}
              >
                {month}월
              </PeriodSelectItem>
            );
          })}
        </div>
      </div>
    </WishJobModal>
  );
};
