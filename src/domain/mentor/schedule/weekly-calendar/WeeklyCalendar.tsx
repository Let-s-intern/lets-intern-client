'use client';

import { differenceInCalendarDays, format, getMonth, isSameDay } from 'date-fns';
import { useEffect, useMemo, useRef, useState } from 'react';

import ChallengePeriodBar from '../calendar-bar/ui/ChallengePeriodBar';
import { CompactFeedbackCard } from '../calendar-bar/ui/FeedbackCard';
import { LiveFeedbackTimeBlock } from '../calendar-bar/ui/LiveFeedbackCard';
import LiveFeedbackOpenBar from '../calendar-bar/ui/LiveFeedbackOpenBar';
import LiveFeedbackPeriodBar from '../calendar-bar/ui/LiveFeedbackPeriodBar';
import type { PeriodBarData } from '../types';
import ColumnDividers from './ui/ColumnDividers';
import DayHeaderCell from './ui/DayHeaderCell';
import TodayButton from './ui/TodayButton';
import { useTimelineScroll } from './hooks/useInfiniteWeekScroll';

// ─── 시간 그리드 상수 ────────────────────────────────────────────────────────
const TIME_LABEL_W = 48; // 시간 레이블 열 너비 (px)
const HOUR_H = 160;      // 한 시간당 높이 (px)

/** liveBars에서 표시할 시간 범위를 동적으로 계산한다. */
function calcTimeRange(liveBars: PeriodBarData[]): { tStart: number; tEnd: number } {
  if (liveBars.length === 0) return { tStart: 8, tEnd: 18 };

  let minMin = Infinity;
  let maxMin = -Infinity;
  for (const bar of liveBars) {
    const [sh, sm] = bar.liveFeedback!.startTime.split(':').map(Number);
    const [eh, em] = bar.liveFeedback!.endTime.split(':').map(Number);
    const s = sh * 60 + sm;
    const e = eh * 60 + em;
    if (s < minMin) minMin = s;
    if (e > maxMin) maxMin = e;
  }
  return {
    tStart: Math.floor(minMin / 60),
    tEnd: Math.ceil(maxMin / 60),
  };
}

function hourLabel(h: number): string {
  if (h < 12) return `오전 ${h}시`;
  if (h === 12) return '오후 12시';
  return `오후 ${h - 12}시`;
}

// ─── 타입 ────────────────────────────────────────────────────────────────────
interface WeeklyCalendarProps {
  bars: PeriodBarData[];
  allBars: PeriodBarData[];
  onBarClick: (challengeId: number, missionId: number) => void;
  onMentorOpenPeriodClick?: () => void;
  targetScrollDate?: Date | null;
}

// ─── 컴포넌트 ─────────────────────────────────────────────────────────────────
const WeeklyCalendar = ({
  bars,
  allBars,
  onBarClick,
  onMentorOpenPeriodClick,
  targetScrollDate,
}: WeeklyCalendarProps) => {
  // 상단 period bar(서면 + 라이브 기간) vs 하단 시간 블록(라이브 개별 세션) 분리
  const writtenBars = useMemo(
    () => bars.filter((b) => b.barType !== 'live-feedback'),
    [bars],
  );
  const liveBars = useMemo(
    () => bars.filter((b) => b.barType === 'live-feedback'),
    [bars],
  );

  const {
    containerRef,
    timelineStart,
    totalDays,
    days,
    scrollToDate,
    scrollToToday,
  } = useTimelineScroll({ allBars });

  const today = useMemo(() => new Date(), []);
  const todayColRef = useRef<HTMLDivElement>(null);
  const [isTodayVisible, setIsTodayVisible] = useState(true);

  useEffect(() => {
    const el = todayColRef.current;
    const root = containerRef.current;
    if (!el || !root) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsTodayVisible(entry.isIntersecting),
      { root, threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef, days]);

  useEffect(() => {
    if (targetScrollDate) scrollToDate(targetScrollDate);
  }, [targetScrollDate, scrollToDate]);

  // 라이브 피드백 시간 범위 (liveBars 기준 동적 계산)
  const { tStart, tEnd } = useMemo(
    () => calcTimeRange(liveBars),
    [liveBars],
  );
  const nHours = tEnd - tStart;

  // 서면 피드백 바 레이아웃 (grid 열 위치)
  const barLayouts = useMemo(
    () =>
      writtenBars
        .map((bar) => {
          const startCol =
            differenceInCalendarDays(new Date(bar.startDate), timelineStart) + 1;
          const endCol =
            differenceInCalendarDays(
              new Date(bar.feedbackDeadline),
              timelineStart,
            ) + 2;
          return { bar, startCol, endCol, colSpan: endCol - startCol };
        })
        .filter((l) => l.endCol >= 1 && l.startCol <= totalDays),
    [writtenBars, timelineStart, totalDays],
  );

  // 날짜별 라이브 피드백 그룹 (YYYY-MM-DD → bar[])
  const liveBarsPerDay = useMemo(() => {
    const map = new Map<string, PeriodBarData[]>();
    for (const bar of liveBars) {
      const key = bar.startDate.slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(bar);
    }
    return map;
  }, [liveBars]);

  const bodyMinHeight = useMemo(() => {
    const ROW_H = 70;
    const MIN_ROWS = 3;
    return Math.max(writtenBars.length, MIN_ROWS) * ROW_H + 24;
  }, [writtenBars.length]);

  const innerWidthPercent = (totalDays / 7) * 100;
  const gridCols = `repeat(${totalDays}, 1fr)`;
  const isEmpty = barLayouts.length === 0 && liveBars.length === 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-80">

      {/* ── 상단 태그: 일정 타입 범례 ─────────────────────────────────────── */}
      <div className="flex items-center gap-4 border-b border-neutral-80 bg-white px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-5 rounded-sm bg-primary opacity-40" />
          <span className="text-xxsmall12 font-medium text-neutral-40">
            서면 피드백
          </span>
        </div>
        {liveBars.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            <span className="text-xxsmall12 font-medium text-neutral-40">
              라이브 피드백
            </span>
          </div>
        )}
      </div>

      {/* ── 수평 스크롤 컨테이너 ───────────────────────────────────────────── */}
      <div ref={containerRef} className="overflow-x-auto">
        <div
          style={{
            width: `${innerWidthPercent}%`,
            minWidth: `${totalDays * 140}px`,
          }}
        >

          {/* ── 날짜 헤더 행 ─────────────────────────────────────────────── */}
          <div className="flex border-b border-neutral-80">
            {/* 시간 레이블 열과 정렬을 맞추는 sticky 스페이서 */}
            <div
              className="sticky left-0 z-20 shrink-0 border-r border-neutral-80 bg-white"
              style={{ width: TIME_LABEL_W }}
            />
            <div
              className="flex-1"
              style={{ display: 'grid', gridTemplateColumns: gridCols }}
            >
              {days.map((day, i) => (
                <DayHeaderCell
                  key={i}
                  ref={isSameDay(day, today) ? todayColRef : undefined}
                  day={day}
                  today={today}
                  isMonthStart={i > 0 && getMonth(day) !== getMonth(days[i - 1])}
                />
              ))}
            </div>
          </div>

          {/* ── 상단: 서면 피드백 period bar 영역 ────────────────────────── */}
          <div className="flex" style={{ minHeight: `${bodyMinHeight}px` }}>
            {/* sticky 스페이서 */}
            <div
              className="sticky left-0 z-10 shrink-0 border-r border-neutral-80 bg-white"
              style={{ width: TIME_LABEL_W }}
            />
            {/* 바 렌더링 영역 */}
            <div className="relative flex-1">
              <ColumnDividers days={days} gridCols={gridCols} />
              <div
                className="relative gap-y-1 py-3"
                style={{ display: 'grid', gridTemplateColumns: gridCols }}
              >
                {barLayouts.map(({ bar, startCol, endCol, colSpan }, idx) => (
                  <div
                    key={`${bar.challengeId}-${bar.missionId}-${idx}`}
                    className="px-px"
                    style={{ gridColumn: `${startCol} / ${endCol}` }}
                  >
                    {bar.barType === 'live-feedback-period' ? (
                      <LiveFeedbackPeriodBar bar={bar} />
                    ) : (bar.barType === 'live-feedback-mentor-open' ||
                        bar.barType === 'live-feedback-mentee-open') ? (
                      <LiveFeedbackOpenBar
                        bar={bar}
                        onMentorOpenClick={
                          bar.barType === 'live-feedback-mentor-open'
                            ? onMentorOpenPeriodClick
                            : undefined
                        }
                      />
                    ) : colSpan <= 1 ? (
                      <CompactFeedbackCard bar={bar} onBarClick={onBarClick} />
                    ) : (
                      <ChallengePeriodBar bar={bar} onBarClick={onBarClick} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── 하단: 시간별 일정 (라이브 피드백) ───────────────────────── */}
          {liveBars.length > 0 && (
            <>
              {/* 구분선 + 섹션 레이블 */}
              <div className="flex items-center gap-2 border-t border-neutral-80 bg-neutral-95 px-3 py-1.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                <span className="text-xxsmall12 font-medium text-neutral-40">
                  시간별 일정
                </span>
              </div>

              {/* 시간 그리드 — tStart~tEnd 범위만 표시 */}
              <div
                className="flex border-t border-neutral-80"
                style={{ height: `${nHours * HOUR_H}px` }}
              >
                {/* 시간 레이블 열 — sticky left */}
                <div
                  className="sticky left-0 z-10 shrink-0 border-r border-neutral-80 bg-white"
                  style={{ width: TIME_LABEL_W }}
                >
                  {Array.from({ length: nHours }, (_, i) => tStart + i).map(
                    (h) => (
                      <div
                        key={h}
                        className="flex items-start justify-center pt-2"
                        style={{ height: HOUR_H }}
                      >
                        <span className="text-[10px] leading-none text-neutral-40">
                          {hourLabel(h)}
                        </span>
                      </div>
                    ),
                  )}
                </div>

                {/* 날짜별 열 */}
                <div
                  className="relative flex-1"
                  style={{ display: 'grid', gridTemplateColumns: gridCols }}
                >
                  {days.map((day, i) => {
                    const dateKey = format(day, 'yyyy-MM-dd');
                    const dayLiveBars = liveBarsPerDay.get(dateKey) ?? [];
                    const isMonthStart =
                      i > 0 && getMonth(day) !== getMonth(days[i - 1]);
                    const isToday = isSameDay(day, today);

                    return (
                      <div
                        key={i}
                        className={`relative ${isToday ? 'bg-[#fbf9fe]' : ''} ${
                          isMonthStart
                            ? 'border-l-2 border-primary-20'
                            : i > 0
                              ? 'border-l border-neutral-90'
                              : ''
                        }`}
                      >
                        {/* 시간 구분선 */}
                        {Array.from({ length: nHours }, (_, j) => (
                          <div
                            key={j}
                            className="border-b border-neutral-95"
                            style={{ height: HOUR_H }}
                          />
                        ))}

                        {/* 라이브 피드백 세션 블록 */}
                        {dayLiveBars.map((bar) => {
                          const [sh, sm] = bar.liveFeedback!.startTime
                            .split(':')
                            .map(Number);
                          const [eh, em] = bar.liveFeedback!.endTime
                            .split(':')
                            .map(Number);
                          const topPx =
                            (((sh - tStart) * 60 + sm) / 60) * HOUR_H;
                          const heightPx =
                            (((eh - sh) * 60 + (em - sm)) / 60) * HOUR_H;

                          return (
                            <div
                              key={bar.missionId}
                              className="absolute left-1 right-1 z-10"
                              style={{ top: topPx, height: heightPx }}
                            >
                              <LiveFeedbackTimeBlock bar={bar} />
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

        </div>
      </div>

      {/* ── Empty state ──────────────────────────────────────────────────── */}
      {isEmpty && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white/60">
          <div className="pointer-events-auto rounded-xl border border-neutral-80 bg-white px-8 py-6 shadow-lg">
            <p className="text-center text-xsmall16 font-medium text-neutral-30">
              진행 예정인 피드백 일정이 없습니다.
            </p>
          </div>
        </div>
      )}

      <TodayButton isTodayVisible={isTodayVisible} onGoToToday={scrollToToday} />
    </div>
  );
};

export default WeeklyCalendar;
