import ArrowBoldLeft from '@/assets/icons/arrow-bold-left.svg?react';
import ArrowBoldRight from '@/assets/icons/arrow-bold-right.svg?react';
import { PassCalendarEvent } from '@/domain/all-in-one-pass/types';
import dayjs from '@/lib/dayjs';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import clsx from 'clsx';
import { IoClose } from 'react-icons/io5';
import WeekRow from './WeekRow';
import { useCalendarPreview } from './useCalendarPreview';

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const arrowClass = (enabled: boolean) =>
  clsx(
    enabled
      ? 'text-neutral-0 cursor-pointer'
      : 'text-neutral-70 cursor-not-allowed',
  );

interface Props {
  open: boolean;
  onClose: () => void;
  events: PassCalendarEvent[];
  purchaseStartDate?: string | null;
  purchaseEndDate?: string | null;
  passDays?: number | null;
}

/** 1.3 캘린더 미리보기: 실제 노출될 2주 달력 (챌린지 막대 + 세미나/마일스톤) */
export default function CalendarPreviewModal({
  open,
  onClose,
  events,
  purchaseStartDate,
  purchaseEndDate,
  passDays,
}: Props) {
  const {
    windowStart,
    windowEnd,
    mainMonthKey,
    weeks,
    items,
    laneOf,
    canPrev,
    canNext,
    goPrev,
    goNext,
  } = useCalendarPreview({
    events,
    purchaseStartDate,
    purchaseEndDate,
    passDays,
    open,
  });
  const today = dayjs();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      slotProps={{
        paper: { sx: { width: 548, maxWidth: '95vw', maxHeight: '90vh' } },
      }}
    >
      <DialogContent>
        {/* 기간 네비게이션 (2주 단위) */}
        <div className="mb-6 flex items-center gap-4">
          <ArrowBoldLeft
            onClick={goPrev}
            aria-disabled={!canPrev}
            className={arrowClass(canPrev)}
          />
          <div className="flex items-center gap-2">
            <span className="text-medium24 text-neutral-0 w-[224px] font-bold">
              {windowStart.format('YYYY.MM.DD')} ~ {windowEnd.format('MM.DD')}
            </span>
            <img src="/icons/calendar.svg" />
          </div>
          <ArrowBoldRight
            onClick={goNext}
            aria-disabled={!canNext}
            className={arrowClass(canNext)}
          />
          <IconButton
            size="small"
            onClick={onClose}
            aria-label="닫기"
            className="!ml-auto"
          >
            <IoClose />
          </IconButton>
        </div>

        {/* 요일 헤더 */}
        <div className="border-neutral-80 grid grid-cols-7 gap-1 border-b pb-3">
          {WEEKDAYS.map((w) => (
            <div
              key={w}
              className="text-xsmall16 text-neutral-40 py-2 text-center font-medium"
            >
              {w}
            </div>
          ))}
        </div>

        {weeks.map((week, wi) => (
          <WeekRow
            key={wi}
            week={week}
            wi={wi}
            mainMonthKey={mainMonthKey}
            today={today}
            items={items}
            laneOf={laneOf}
          />
        ))}
      </DialogContent>
    </Dialog>
  );
}
