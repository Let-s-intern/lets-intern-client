

import {
  differenceInCalendarDays,
  format,
  getMonth,
  isSameDay,
} from 'date-fns';
import { useEffect, useMemo, useRef, useState } from 'react';

import { LiveFeedbackTimeBlock } from '../calendar-bar/ui/LiveFeedbackCard';
import LiveFeedbackOpenBar from '../calendar-bar/ui/LiveFeedbackOpenBar';
import LiveFeedbackPeriodBar from '../calendar-bar/ui/LiveFeedbackPeriodBar';
import WrittenFeedbackBar from '../calendar-bar/ui/WrittenFeedbackBar';
import type { PeriodBarData } from '../types';
import { useTimelineScroll } from './hooks/useInfiniteWeekScroll';
import ColumnDividers from './ui/ColumnDividers';
import DayHeaderCell from './ui/DayHeaderCell';
import TodayButton from './ui/TodayButton';

// ─── 시간 그리드 상수 ────────────────────────────────────────────────────────
const TIME_LABEL_W = 48; // 시간 레이블 열 너비 (px)
const SLOT_MINUTES = 30;
const SLOT_H = 120; // 30분당 높이 (px)

/** liveBars에서 표시할 시간 범위를 동적으로 계산한다. */
function calcTimeRange(liveBars: PeriodBarData[]): {
  startMinutes: number;
  endMinutes: number;
} {
  if (liveBars.length === 0)
    return { startMinutes: 8 * 60, endMinutes: 18 * 60 };

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
    startMinutes: Math.floor(minMin / SLOT_MINUTES) * SLOT_MINUTES,
    endMinutes: Math.ceil(maxMin / SLOT_MINUTES) * SLOT_MINUTES,
  };
}

function formatTimeLabel(totalMinutes: number): string {
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  const hourText = String(hour).padStart(2, '0');
  const minuteText = String(minute).padStart(2, '0');
  return `${hourText}:${minuteText}`;
}

// ─── 타입 ────────────────────────────────────────────────────────────────────
interface WeeklyCalendarProps {
  bars: PeriodBarData[];
  allBars: PeriodBarData[];
  onBarClick: (challengeId: number, missionId: number) => void;
  /** 부모가 지정한 스크롤 타겟 날짜 — 변경될 때마다 그 날짜를 화면 중앙으로 부드럽게 이동 */
  targetScrollDate?: Date | null;
  onMentorOpenPeriodClick?: () => void;
  onLiveFeedbackTimeBlockClick?: (bar: PeriodBarData) => void;
  onLiveFeedbackPeriodClick?: (bar: PeriodBarData) => void;
  onMentorOpenPeriodBarClick?: (bar: PeriodBarData) => void;
}

// ─── 컴포넌트 ─────────────────────────────────────────────────────────────────
const WeeklyCalendar = ({
  bars,
  allBars,
  onBarClick,
  targetScrollDate,
  onMentorOpenPeriodClick,
  onMentorOpenPeriodBarClick,
  onLiveFeedbackTimeBlockClick,
  onLiveFeedbackPeriodClick,
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

  // 부모가 지정한 타겟 날짜로 부드럽게 스크롤. ms 단위로 메모해 같은 날짜 재전송 시 noop.
  const targetMs = targetScrollDate?.getTime() ?? null;
  useEffect(() => {
    if (targetMs == null) return;
    // 한 번의 rAF로 layout 안정화 후 스크롤
    const raf = requestAnimationFrame(() => {
      scrollToDate(new Date(targetMs), 'smooth');
    });
    return () => cancelAnimationFrame(raf);
  }, [targetMs, scrollToDate]);

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

  // 라이브 피드백 시간 범위 (liveBars 기준 동적 계산)
  const { startMinutes, endMinutes } = useMemo(
    () => calcTimeRange(liveBars),
    [liveBars],
  );
  const slotCount = (endMinutes - startMinutes) / SLOT_MINUTES;

  // 서면 피드백 바 레이아웃 — 챌린지별 그룹 + 그룹 내 row 충돌 시 인접 row.
  //   1) 한 챌린지의 모든 바는 연속된 row 블록을 차지 → 시각적으로 묶여 보임
  //   2) 같은 챌린지 안에서 바가 겹치면 다음 row로 (위아래 인접)
  //   3) 다음 챌린지는 이전 챌린지가 사용한 마지막 row 다음부터 시작
  const barLayouts = useMemo(() => {
    type Layout = {
      bar: PeriodBarData;
      startCol: number;
      endCol: number;
      gridRow: number;
    };

    // (1) 챌린지 등장 순서를 보존 (Map은 insertion order 유지)
    const challengeOrder: number[] = [];
    const seen = new Set<number>();
    for (const bar of writtenBars) {
      if (!seen.has(bar.challengeId)) {
        seen.add(bar.challengeId);
        challengeOrder.push(bar.challengeId);
      }
    }

    const layouts: Layout[] = [];
    let nextStartRow = 1; // 다음 챌린지가 시작할 절대 row

    for (const challengeId of challengeOrder) {
      const groupBars = writtenBars.filter((b) => b.challengeId === challengeId);
      // 그룹 내부 점유 — index 0부터 차곡차곡, 그룹별로 독립
      const groupRowRanges: Array<Array<{ start: number; end: number }>> = [];

      for (const bar of groupBars) {
        const rawStart =
          differenceInCalendarDays(new Date(bar.startDate), timelineStart) + 1;
        const rawEnd =
          differenceInCalendarDays(
            new Date(bar.feedbackDeadline),
            timelineStart,
          ) + 2;

        if (rawEnd < 1 || rawStart > totalDays) continue;

        const startCol = Math.max(1, rawStart);
        const endCol = Math.min(totalDays + 1, rawEnd);
        if (endCol <= startCol) continue;

        // 그룹 안에서 충돌 없는 가장 낮은 local row 탐색
        let localRow = 0;
        while (true) {
          const occupied = groupRowRanges[localRow] ?? [];
          const hasConflict = occupied.some(
            (r) => startCol < r.end && endCol > r.start,
          );
          if (!hasConflict) break;
          localRow++;
        }

        if (!groupRowRanges[localRow]) groupRowRanges[localRow] = [];
        groupRowRanges[localRow].push({ start: startCol, end: endCol });

        layouts.push({
          bar,
          startCol,
          endCol,
          gridRow: nextStartRow + localRow,
        });
      }

      // 다음 챌린지는 현재 그룹이 실제로 사용한 row 수만큼 뒤로 밀린다.
      // (모든 바가 가시 범위 밖이면 0 → 그 챌린지는 시각적으로 자리 없음)
      nextStartRow += groupRowRanges.length;
    }

    return layouts;
  }, [writtenBars, timelineStart, totalDays]);

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
    const MIN_ROWS = 2; // 챌린지 1~2개 기준 최소 빈 공간만 확보
    const maxRow = barLayouts.reduce((max, l) => Math.max(max, l.gridRow), 0);
    return Math.max(maxRow, MIN_ROWS) * ROW_H + 24;
  }, [barLayouts]);

  const innerWidthPercent = (totalDays / 7) * 100;
  // minmax(0, 1fr) — 자식 콘텐츠가 1fr 컬럼을 강제 확장하지 못하게 막아
  // 헤더/디바이더/바 그리드의 컬럼 폭이 항상 동일하게 유지된다.
  const gridCols = `repeat(${totalDays}, minmax(0, 1fr))`;
  const isEmpty = barLayouts.length === 0 && liveBars.length === 0;

  return (
    <div className="rounded-2xl relative overflow-hidden border border-neutral-80">
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
                  isMonthStart={
                    i > 0 && getMonth(day) !== getMonth(days[i - 1])
                  }
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
                className="relative w-full gap-y-1 py-3"
                style={{ display: 'grid', gridTemplateColumns: gridCols }}
              >
                {barLayouts.map(({ bar, startCol, endCol, gridRow }, idx) => (
                  <div
                    key={`${bar.challengeId}-${bar.missionId}-${idx}`}
                    style={{
                      gridColumn: `${startCol} / ${endCol}`,
                      gridRow,
                    }}
                  >
                    {bar.barType === 'live-feedback-period' ? (
                      <LiveFeedbackPeriodBar
                        bar={bar}
                        onClick={onLiveFeedbackPeriodClick}
                      />
                    ) : bar.barType === 'live-feedback-mentor-open' ? (
                      <LiveFeedbackOpenBar
                        bar={bar}
                        onMentorOpenClick={
                          onMentorOpenPeriodBarClick
                            ? () => onMentorOpenPeriodBarClick(bar)
                            : onMentorOpenPeriodClick
                        }
                      />
                    ) : bar.barType === 'written-feedback' ? (
                      <WrittenFeedbackBar bar={bar} onBarClick={onBarClick} />
                    ) : null}
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
                style={{ height: `${slotCount * SLOT_H}px` }}
              >
                {/* 시간 레이블 열 — sticky left, z-20으로 라이브 블록(z-10)보다 위에 표시 */}
                <div
                  className="sticky left-0 z-20 shrink-0 border-r border-neutral-80 bg-white"
                  style={{ width: TIME_LABEL_W }}
                >
                  {Array.from(
                    { length: slotCount },
                    (_, i) => startMinutes + i * SLOT_MINUTES,
                  ).map((minutes) => (
                    <div
                      key={minutes}
                      className="flex items-start justify-center pt-2"
                      style={{ height: SLOT_H }}
                    >
                      <span className="text-[10px] leading-none text-neutral-40">
                        {formatTimeLabel(minutes)}
                      </span>
                    </div>
                  ))}
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
                        {Array.from({ length: slotCount }, (_, j) => (
                          <div
                            key={j}
                            className="border-b border-neutral-95"
                            style={{ height: SLOT_H }}
                          />
                        ))}

                        {/* 라이브 피드백 세션 블록 */}
                        {dayLiveBars.map((bar) => {
                          const [sh, sm] = bar
                            .liveFeedback!.startTime.split(':')
                            .map(Number);
                          const [eh, em] = bar
                            .liveFeedback!.endTime.split(':')
                            .map(Number);
                          const topPx =
                            ((sh * 60 + sm - startMinutes) / SLOT_MINUTES) *
                            SLOT_H;
                          const heightPx =
                            ((eh * 60 + em - (sh * 60 + sm)) / SLOT_MINUTES) *
                            SLOT_H;

                          return (
                            <button
                              key={bar.missionId}
                              type="button"
                              onClick={() =>
                                onLiveFeedbackTimeBlockClick?.(bar)
                              }
                              className={`absolute left-1 right-1 z-10 text-left ${
                                onLiveFeedbackTimeBlockClick
                                  ? 'cursor-pointer'
                                  : ''
                              }`}
                              style={{ top: topPx, height: heightPx }}
                            >
                              <LiveFeedbackTimeBlock bar={bar} />
                            </button>
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

      <TodayButton
        isTodayVisible={isTodayVisible}
        onGoToToday={scrollToToday}
      />
    </div>
  );
};

export default WeeklyCalendar;
