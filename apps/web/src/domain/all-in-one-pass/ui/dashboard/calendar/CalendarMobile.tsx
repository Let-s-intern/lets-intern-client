'use client';

// U-1 모바일 캘린더 루트 — 주간/월간 토글 + sticky + 날짜 피커
import { FULL_NAVBAR_HEIGHT_OFFSET } from '@/common/layout/header/NavBar';
import { twMerge } from '@/lib/twMerge';
import clsx from 'clsx';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { PassCalendarEvent } from '../../../types';
import { CalendarProvider, type CalendarRenderModel } from './CalendarContext';
import CalendarDatePicker from './CalendarDatePicker';
import CalendarDayList from './CalendarDayList';
import CalendarMobileMonth from './CalendarMobileMonth';
import CalendarMobileWeek from './CalendarMobileWeek';
import { FILTER_LABEL } from './calendarUtils';
import { CalendarView, useMobileCalendar } from './useMobileCalendar';

const MONTH_MIN_HEIGHT = 820;
interface Props {
  events: PassCalendarEvent[];
  periodStart?: string;
  periodEnd?: string;
}

export default function CalendarMobile({
  events,
  periodStart,
  periodEnd,
}: Props) {
  const cal = useMobileCalendar({ events, periodStart, periodEnd });
  const [pickerOpen, setPickerOpen] = useState(false);

  const calRef = useRef<HTMLDivElement>(null);
  const [calH, setCalH] = useState(0);
  useEffect(() => {
    const el = calRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setCalH(el.offsetHeight));
    ro.observe(el);
    setCalH(el.offsetHeight);
    return () => ro.disconnect();
  }, []);
  const listHeaderTop = 136 + calH;

  const [viewportH, setViewportH] = useState<number | null>(null);
  useEffect(() => {
    const update = () => setViewportH(window.innerHeight);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  const monthAllowed = viewportH == null || viewportH >= MONTH_MIN_HEIGHT;
  useEffect(() => {
    if (!monthAllowed && cal.view === 'month') cal.setView('week');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthAllowed, cal.view]);

  // 헤더 월·이동은 뷰별로 (월간=기준 달 / 주간=보이는 주)
  const isMonth = cal.view === 'month';
  const headerDay = isMonth
    ? cal.monthAnchor
    : (cal.weeks[cal.weekIndex]?.[3] ?? cal.selected);
  const goPrev = isMonth ? cal.goPrevMonth : cal.goPrevWeek;
  const goNext = isMonth ? cal.goNextMonth : cal.goNextWeek;
  const canPrev = isMonth ? cal.canPrevMonth : cal.canPrevWeek;
  const canNext = isMonth ? cal.canNextMonth : cal.canNextWeek;

  const model: CalendarRenderModel = useMemo(
    () => ({
      bars: cal.bars,
      barLaneOf: cal.barLaneOf,
      pointsByDate: cal.pointsByDate,
      badgeByDate: cal.badgeByDate,
      today: cal.today,
      selected: cal.selected,
      onSelect: cal.setSelected,
      mainMonthKey: cal.monthAnchor.format('YYYY-MM'),
      periodStart,
      periodEnd,
    }),
    [
      cal.bars,
      cal.barLaneOf,
      cal.pointsByDate,
      cal.badgeByDate,
      cal.today,
      cal.selected,
      cal.setSelected,
      cal.monthAnchor,
      periodStart,
      periodEnd,
    ],
  );

  return (
    <CalendarProvider value={model}>
      <section className="flex flex-col gap-3">
        <div
          className={twMerge(
            'sticky z-20 -mx-5 flex h-[52px] items-center justify-between bg-white px-5',
            FULL_NAVBAR_HEIGHT_OFFSET,
          )}
        >
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label={isMonth ? '이전 달' : '이전 주'}
              disabled={!canPrev}
              onClick={goPrev}
            >
              <ChevronLeft
                size={20}
                className={canPrev ? 'text-neutral-40' : 'text-neutral-80'}
              />
            </button>
            <button type="button" onClick={() => setPickerOpen(true)}>
              <span className="text-xsmall16 text-neutral-0 min-w-[69px] font-bold">
                {headerDay.format('YYYY.MM.')}
              </span>
            </button>
            <button
              type="button"
              aria-label="오늘로 가기"
              onClick={cal.goToday}
              className="px-0.5"
            >
              <Calendar size={16} className="text-neutral-40" />
            </button>
            <button
              type="button"
              aria-label={isMonth ? '다음 달' : '다음 주'}
              disabled={!canNext}
              onClick={goNext}
            >
              <ChevronRight
                size={20}
                className={canNext ? 'text-neutral-40' : 'text-neutral-80'}
              />
            </button>
          </div>

          <div className="flex items-center gap-1">
            {(['week', 'month'] as const)
              .filter((v) => v !== 'month' || monthAllowed) // 낮은 화면: 월간 숨김
              .map((v: CalendarView) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => cal.setView(v)}
                  className={clsx(
                    'text-xsmall14 rounded-xxs px-2 py-1',
                    cal.view === v
                      ? 'bg-neutral-90 text-neutral-20'
                      : 'text-neutral-40',
                  )}
                >
                  {v === 'week' ? '주간' : '월간'}
                </button>
              ))}
          </div>
        </div>
        <div className="flex items-center justify-end gap-4">
          {(['BEFORE', 'IN_PROGRESS', 'DONE'] as const).map((k) => (
            <label key={k} className="flex cursor-pointer items-center gap-1">
              <input
                type="checkbox"
                checked={cal.filters[k]}
                onChange={() => cal.toggleFilter(k)}
                className="sr-only"
              />
              <img
                src={
                  cal.filters[k]
                    ? '/icons/checkbox-fill.svg'
                    : '/icons/checkbox-unchecked-box2.svg'
                }
                alt=""
                className="h-4 w-4"
              />
              <span
                className={clsx(
                  'text-xsmall14',
                  cal.filters[k] ? 'text-primary' : 'text-neutral-40',
                )}
              >
                {FILTER_LABEL[k]}
              </span>
            </label>
          ))}
        </div>
        <div
          ref={calRef}
          className="sticky top-[136px] z-20 -mx-5 bg-white px-5 pb-3"
        >
          {cal.view === 'month' ? (
            <CalendarMobileMonth cal={cal} />
          ) : (
            <CalendarMobileWeek cal={cal} />
          )}
        </div>

        <CalendarDayList
          date={cal.selected}
          events={cal.selectedEvents}
          stickyTop={listHeaderTop}
        />

        <CalendarDatePicker
          isOpen={pickerOpen}
          onClose={() => setPickerOpen(false)}
          initial={cal.selected}
          periodStart={periodStart}
          periodEnd={periodEnd}
          onConfirm={cal.jumpTo}
        />
      </section>
    </CalendarProvider>
  );
}
