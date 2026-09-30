import OutlinedButton from '@/common/button/OutlinedButton';
import SolidButton from '@/common/button/SolidButton';
import BaseBottomSheet from '@/common/sheet/BaseBottomSheet';
import dayjs from '@/lib/dayjs';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import type { Day } from './calendarUtils';

const ITEM_H = 40; // 휠 아이템 높이(px)

const range = (lo: number, hi: number) =>
  Array.from({ length: Math.max(0, hi - lo + 1) }, (_, i) => lo + i);

interface WheelProps {
  items: number[];
  value: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}

/** 세로 스냅 휠 한 칸 — 가운데 정렬된 값이 선택값 */
function WheelColumn({ items, value, onChange, format }: WheelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const didInit = useRef(false);

  // 값/목록 변경 시 가운데 정렬 (최초엔 즉시, 이후 클릭 등은 부드럽게)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const idx = items.indexOf(value);
    if (idx < 0 || Math.round(el.scrollTop / ITEM_H) === idx) return;
    el.scrollTo({ top: idx * ITEM_H, behavior: didInit.current ? 'smooth' : 'auto' });
    didInit.current = true;
  }, [value, items]);

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const idx = Math.min(
      items.length - 1,
      Math.max(0, Math.round(el.scrollTop / ITEM_H)),
    );
    const v = items[idx];
    if (v !== undefined && v !== value) onChange(v);
  };

  return (
    <div
      ref={ref}
      onScroll={onScroll}
      className="relative z-10 h-full flex-1 snap-y snap-mandatory overflow-y-auto [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: 'none' }}
    >
      <div style={{ height: ITEM_H * 2 }} />
      {items.map((it) => (
        <button
          key={it}
          type="button"
          onClick={() => onChange(it)}
          style={{ height: ITEM_H }}
          className={clsx(
            'flex w-full cursor-pointer snap-center items-center justify-center',
            it === value
              ? 'text-primary text-base font-semibold'
              : 'text-neutral-50 text-sm',
          )}
        >
          {format(it)}
        </button>
      ))}
      <div style={{ height: ITEM_H * 2 }} />
    </div>
  );
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initial: Day;
  periodStart?: string;
  periodEnd?: string;
  onConfirm: (d: Day) => void;
}

/** 날짜 선택 바텀시트 — 패스 기간에 해당하는 년/월/일만 노출 */
export default function PassDatePickerSheet({
  isOpen,
  onClose,
  initial,
  periodStart,
  periodEnd,
  onConfirm,
}: Props) {
  const min = periodStart ? dayjs(periodStart).startOf('day') : undefined;
  const max = periodEnd ? dayjs(periodEnd).startOf('day') : undefined;

  const [year, setYear] = useState(initial.year());
  const [month, setMonth] = useState(initial.month() + 1); // 1~12
  const [day, setDay] = useState(initial.date());

  // 열릴 때 선택일 기준으로 초기화
  useEffect(() => {
    if (!isOpen) return;
    setYear(initial.year());
    setMonth(initial.month() + 1);
    setDay(initial.date());
  }, [isOpen, initial]);

  const years = min && max ? range(min.year(), max.year()) : [year];
  const months = range(
    min && year === min.year() ? min.month() + 1 : 1,
    max && year === max.year() ? max.month() + 1 : 12,
  );
  const daysInMonth = dayjs(
    `${year}-${String(month).padStart(2, '0')}-01`,
  ).daysInMonth();
  const days = range(
    min && year === min.year() && month === min.month() + 1 ? min.date() : 1,
    max && year === max.year() && month === max.month() + 1
      ? max.date()
      : daysInMonth,
  );

  // 년/월 변경 시 월·일을 유효 범위로 보정
  useEffect(() => {
    if (!months.includes(month)) setMonth(months[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);
  useEffect(() => {
    if (!days.includes(day)) setDay(days[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  const handleConfirm = () => {
    onConfirm(
      dayjs(
        `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      ).startOf('day'),
    );
    onClose();
  };

  return (
    <BaseBottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="relative flex" style={{ height: ITEM_H * 5 }}>
        {/* 가운데 선택 밴드 */}
        <div
          className="bg-neutral-95 pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 rounded-lg"
          style={{ height: ITEM_H }}
        />
        <WheelColumn
          items={years}
          value={year}
          onChange={setYear}
          format={(v) => `${v}년`}
        />
        <WheelColumn
          items={months}
          value={month}
          onChange={setMonth}
          format={(v) => `${v}월`}
        />
        <WheelColumn
          items={days}
          value={day}
          onChange={setDay}
          format={(v) => `${v}일`}
        />
      </div>

      <div className="mt-4 flex gap-3">
        <OutlinedButton
          onClick={onClose}
          className="text-xsmall16 flex-1 py-3 font-medium"
        >
          취소
        </OutlinedButton>
        <SolidButton
          onClick={handleConfirm}
          className="text-xsmall16 flex-1 py-3"
        >
          확인
        </SolidButton>
      </div>
    </BaseBottomSheet>
  );
}
