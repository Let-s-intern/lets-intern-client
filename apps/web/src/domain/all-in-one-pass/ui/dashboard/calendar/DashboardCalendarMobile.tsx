'use client';

import { FULL_NAVBAR_HEIGHT_OFFSET } from '@/common/layout/header/NavBar';
import { twMerge } from '@/lib/twMerge';
import clsx from 'clsx';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { PassCalendarEvent } from '../../../types';
import DayProgramList from './DayProgramList';
import MobileMonthGrid from './MobileMonthGrid';
import MobileWeekRibbon from './MobileWeekRibbon';
import PassDatePickerSheet from './PassDatePickerSheet';
import { FILTER_LABEL } from './calendarUtils';
import { CalendarView, useMobileCalendar } from './useMobileCalendar';

interface Props {
  events: PassCalendarEvent[];
  /** 패스 기간 — 월 이동 경계 및 날짜 피커 노출 범위 */
  periodStart?: string;
  periodEnd?: string;
}

/**
 * U-1 일정 캘린더 (모바일) — 주간/월간 토글 + 날짜 피커 + 선택일 목록.
 *
 * 스크롤 동작: 헤더(년월+토글)와 달력은 전역 NavBar(항상 84px) 바로 아래에 sticky,
 * 그 사이의 필터는 non-sticky 라 스크롤하면 헤더 뒤로 사라진다. 아래 목록만 스크롤.
 */
export default function DashboardCalendarMobile({
  events,
  periodStart,
  periodEnd,
}: Props) {
  const cal = useMobileCalendar({ events, periodStart, periodEnd });
  const [pickerOpen, setPickerOpen] = useState(false);
  const headerMonth = cal.view === 'month' ? cal.monthAnchor : cal.selected;

  return (
    <section className="flex flex-col gap-3">
      {/* 헤더 (sticky) — 년월 + 📅 피커 + (월간 화살표) + 주간·월간 토글 */}
      <div
        className={twMerge(
          'sticky z-20 -mx-5 flex h-[52px] items-center justify-between bg-white px-5',
          FULL_NAVBAR_HEIGHT_OFFSET,
        )}
      >
        <div className="flex items-center gap-1">
          {cal.view === 'month' && (
            <button
              type="button"
              aria-label="이전 달"
              disabled={!cal.canPrevMonth}
              onClick={cal.goPrevMonth}
            >
              <ChevronLeft
                size={20}
                className={
                  cal.canPrevMonth ? 'text-neutral-40' : 'text-neutral-80'
                }
              />
            </button>
          )}
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="flex items-center gap-1.5"
          >
            <span className="text-xsmall16 text-neutral-0 min-w-[69px] font-bold">
              {headerMonth.format('YYYY.MM.')}
            </span>
            <Calendar size={16} className="text-neutral-40" />
          </button>
          {cal.view === 'month' && (
            <button
              type="button"
              aria-label="다음 달"
              disabled={!cal.canNextMonth}
              onClick={cal.goNextMonth}
            >
              <ChevronRight
                size={20}
                className={
                  cal.canNextMonth ? 'text-neutral-40' : 'text-neutral-80'
                }
              />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          {(['week', 'month'] as const).map((v: CalendarView) => (
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

      {/* 참여상태 필터 (non-sticky — 스크롤 시 헤더 뒤로 사라짐) */}
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

      {/* 달력 (sticky — 헤더 바로 아래: 84px + 헤더 높이 52px) */}
      <div className="sticky top-[136px] z-20 -mx-5 bg-white px-5 pb-3">
        {cal.view === 'month' ? (
          <MobileMonthGrid cal={cal} />
        ) : (
          <MobileWeekRibbon cal={cal} />
        )}
      </div>

      <DayProgramList date={cal.selected} events={cal.selectedEvents} />

      <PassDatePickerSheet
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        initial={cal.selected}
        periodStart={periodStart}
        periodEnd={periodEnd}
        onConfirm={cal.jumpTo}
      />
    </section>
  );
}
