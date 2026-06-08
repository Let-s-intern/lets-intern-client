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
  // 상단 period bar(서면 기간 + 라이브 일정 오픈) vs 하단 시간 블록(라이브 개별 세션) 분리.
  // 라이브 피드백 "기간" 바(live-feedback-period)는 상단에 노출하지 않는다 — 라이브는 하단 개별 일정만 표시.
  const writtenBars = useMemo(
    () =>
      bars.filter(
        (b) =>
          b.barType !== 'live-feedback' && b.barType !== 'live-feedback-period',
      ),
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
      const groupBars = writtenBars.filter(
        (b) => b.challengeId === challengeId,
      );
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

  // 날짜별 라이브 피드백 그룹 (YYYY-MM-DD → bar[]) — 각 날짜 안에서 시작시각 오름차순.
  // 시간 그리드 절대배치 대신 위에서부터 시간순으로 차곡차곡 쌓기 위해 정렬해 둔다.
  const liveBarsPerDay = useMemo(() => {
    const map = new Map<string, PeriodBarData[]>();
    for (const bar of liveBars) {
      const key = bar.startDate.slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(bar);
    }
    for (const dayBars of map.values()) {
      dayBars.sort((a, b) =>
        (a.liveFeedback?.startTime ?? '').localeCompare(
          b.liveFeedback?.startTime ?? '',
        ),
      );
    }
    return map;
  }, [liveBars]);

  const bodyMinHeight = useMemo(() => {
    // minHeight는 바닥값만 정하고 그리드는 내용에 맞게 늘어난다(잘림 없음).
    // 바가 적을 때 하단 빈 공간을 줄이기 위해 행 높이/최소 행/여백을 축소.
    const ROW_H = 56;
    const MIN_ROWS = 1;
    const maxRow = barLayouts.reduce((max, l) => Math.max(max, l.gridRow), 0);
    return Math.max(maxRow, MIN_ROWS) * ROW_H + 8;
  }, [barLayouts]);

  const innerWidthPercent = (totalDays / 7) * 100;
  // minmax(0, 1fr) — 자식 콘텐츠가 1fr 컬럼을 강제 확장하지 못하게 막아
  // 헤더/디바이더/바 그리드의 컬럼 폭이 항상 동일하게 유지된다.
  const gridCols = `repeat(${totalDays}, minmax(0, 1fr))`;
  const isEmpty = barLayouts.length === 0 && liveBars.length === 0;

  return (
    <div className="border-neutral-80 relative overflow-hidden rounded-2xl border">
      {/* ── 수평 스크롤 컨테이너 ───────────────────────────────────────────── */}
      <div ref={containerRef} className="overflow-x-auto">
        <div
          style={{
            width: `${innerWidthPercent}%`,
            minWidth: `${totalDays * 140}px`,
          }}
        >
          {/* ── 날짜 헤더 행 ─────────────────────────────────────────────── */}
          <div className="border-neutral-80 flex border-b">
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
              <div className="border-neutral-80 bg-neutral-95 flex items-center gap-2 border-t px-3 py-0.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                <span className="text-xxsmall12 text-neutral-40 font-medium">
                  시간별 일정
                </span>
              </div>

              {/* 시간순 스택 — 날짜별 열에 그날 세션을 시작시각 오름차순으로 쌓는다 */}
              <div className="border-neutral-80 flex border-t">
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
                        className={`flex flex-col gap-1 px-1 py-1 ${
                          isToday ? 'bg-[#fbf9fe]' : ''
                        } ${
                          isMonthStart
                            ? 'border-primary-20 border-l-2'
                            : i > 0
                              ? 'border-neutral-90 border-l'
                              : ''
                        }`}
                      >
                        {/* 라이브 피드백 세션 블록 — 시간순으로 위에서부터 공백 없이 적재 */}
                        {dayLiveBars.map((bar) => (
                          <button
                            key={bar.missionId}
                            type="button"
                            onClick={() => onLiveFeedbackTimeBlockClick?.(bar)}
                            className={`w-full text-left ${
                              onLiveFeedbackTimeBlockClick
                                ? 'cursor-pointer'
                                : ''
                            }`}
                          >
                            <LiveFeedbackTimeBlock bar={bar} />
                          </button>
                        ))}
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
          <div className="border-neutral-80 pointer-events-auto rounded-xl border bg-white px-8 py-6 shadow-lg">
            <p className="text-xsmall16 text-neutral-30 text-center font-medium">
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
