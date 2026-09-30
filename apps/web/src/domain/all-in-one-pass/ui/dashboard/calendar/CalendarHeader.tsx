import clsx from 'clsx';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import type { PassParticipationStatus } from '../../../types';
import { Day, FILTER_LABEL } from './calendarUtils';

interface Props {
  windowStart: Day;
  windowEnd: Day;
  filters: Record<PassParticipationStatus, boolean>;
  onPrev: () => void;
  onNext: () => void;
  onToggle: (k: PassParticipationStatus) => void;
}

/** 캘린더 헤더 — 조회 범위 + 주 이동 + 참여상태 필터 */
export default function CalendarHeader({
  windowStart,
  windowEnd,
  filters,
  onPrev,
  onNext,
  onToggle,
}: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-neutral-0 flex items-center gap-3">
        <button type="button" aria-label="이전 주" onClick={onPrev}>
          <ChevronLeft size={20} className="text-neutral-40" />
        </button>
        <span className="text-small20 min-w-[190.3px] font-bold">
          {windowStart.format('YYYY.MM.DD')} ~ {windowEnd.format('MM.DD')}
        </span>
        <Calendar size={18} className="text-neutral-40" />
        <button type="button" aria-label="다음 주" onClick={onNext}>
          <ChevronRight size={20} className="text-neutral-40" />
        </button>
      </div>
      <div className="flex items-center justify-end gap-4">
        {(['BEFORE', 'IN_PROGRESS', 'DONE'] as const).map((k) => (
          <label key={k} className="flex cursor-pointer items-center gap-1">
            <input
              type="checkbox"
              checked={filters[k]}
              onChange={() => onToggle(k)}
              className="sr-only"
            />
            <img
              src={
                filters[k]
                  ? '/icons/checkbox-fill.svg'
                  : '/icons/checkbox-unchecked-box2.svg'
              }
              alt=""
              className="h-5 w-5"
            />
            <span
              className={clsx(
                'text-xsmall14',
                filters[k] ? 'text-primary' : 'text-neutral-40',
              )}
            >
              {FILTER_LABEL[k]}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
