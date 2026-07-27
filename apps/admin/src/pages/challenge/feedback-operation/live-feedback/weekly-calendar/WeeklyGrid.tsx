import { useEffect, useState } from 'react';
import { twMerge } from '@/lib/twMerge';
import {
  formatDayHeader,
  formatNowLabel,
  getNowIndicator,
  getTimeLabels,
  getWeekDays,
  SLOTS_PER_DAY,
} from './weekUtils';

/** 그리드에 배치할 블록 1개. 좌표는 호출부에서 계산해 전달한다. */
export interface GridBlock {
  key: string;
  /** 0=월 ... 6=일 */
  dayIndex: number;
  /** 시작 슬롯(0-based) */
  slotIndex: number;
  /** 차지 슬롯 수 */
  slotSpan: number;
  /** 색상 클래스(bg/border/text 병합 문자열) */
  className: string;
  /** 블록 내부 표시 내용 */
  content: React.ReactNode;
  /** 클릭 시 동작(옵션). 지정되면 블록이 클릭 가능해진다. */
  onClick?: () => void;
  /** 마우스 오버 툴팁(옵션). 잘린 텍스트 전체를 보여줄 때 쓴다. */
  title?: string;
  /** 실제 진행(예약) 블록인지. 그 시간대 "진행 박스"·건수 표시에 쓴다. */
  isSession?: boolean;
}

interface LaidBlock extends GridBlock {
  /** 같은 시간대 겹침 시 세로 레인 인덱스(0=맨 위). */
  laneIndex: number;
}

/** 겹치는 블록들을 하나로 묶은 그룹(같은 시간대 = 하나의 "진행" 묶음). */
interface DayCluster {
  /** 묶음 시작 슬롯 */
  startSlot: number;
  /** 묶음 끝 슬롯(exclusive) */
  endSlot: number;
  /** 세로로 쌓인 레인 수(= 동시 진행 최대 개수) */
  laneCount: number;
  /** 예약(진행) 블록을 포함하는지 → 진행 박스 대상 */
  hasSession: boolean;
  blocks: LaidBlock[];
}

/**
 * 한 요일의 블록들을 겹침(같은 시간대) 기준으로 묶고, 각 블록에 세로 레인을 부여한다.
 * 겹치는 블록끼리 한 클러스터(= 한 시간대 진행 묶음)로 만든다.
 */
function layoutDayClusters(dayBlocks: GridBlock[]): DayCluster[] {
  const sorted = [...dayBlocks].sort(
    (a, b) => a.slotIndex - b.slotIndex || a.slotSpan - b.slotSpan,
  );
  const clusters: DayCluster[] = [];
  let cur: LaidBlock[] = [];
  let curStart = -1;
  let curEnd = -1;

  const flush = () => {
    if (cur.length === 0) return;
    const laneCount = cur.reduce((m, b) => Math.max(m, b.laneIndex + 1), 0);
    clusters.push({
      startSlot: curStart,
      endSlot: curEnd,
      laneCount,
      hasSession: cur.some((b) => b.isSession),
      blocks: cur,
    });
    cur = [];
    curStart = -1;
    curEnd = -1;
  };

  for (const block of sorted) {
    const start = block.slotIndex;
    const end = block.slotIndex + block.slotSpan;
    if (cur.length > 0 && start >= curEnd) flush();
    const used = new Set(
      cur
        .filter((b) => b.slotIndex + b.slotSpan > start)
        .map((b) => b.laneIndex),
    );
    let lane = 0;
    while (used.has(lane)) lane += 1;
    cur.push({ ...block, laneIndex: lane });
    if (curStart === -1) curStart = start;
    curEnd = Math.max(curEnd, end);
  }
  flush();
  return clusters;
}

interface WeeklyGridProps {
  /** 표시 주의 월요일(ISO 자정) */
  weekStart: string;
  blocks: GridBlock[];
}

const TIME_COL_WIDTH = 64;
/** 이벤트(일정) 박스 1개의 고정 높이(px). 겹쳐도 이 크기를 유지한다. */
const EVENT_HEIGHT = 42;
/** 겹쳐 쌓인 이벤트 사이 간격(px). */
const LANE_GAP = 4;
/** 진행 박스와 이벤트 사이 안쪽 여백(px). */
const BOX_PAD = 5;
/** 진행 박스와 슬롯 경계선 사이 여백(px). 박스가 시간 칸을 넘지 않게 한다. */
const CELL_PAD = 4;
/** 한 시간대(슬롯)에 세로로 쌓을 이벤트 최대 개수 상한. */
const MAX_LANES = 5;
/** 현재 시각 라인 갱신 주기(ms). */
const NOW_TICK_MS = 30_000;

/**
 * 공용 주간 시간대 그리드.
 * 같은 시간대 겹침은 이벤트 박스 크기를 유지한 채 세로로 쌓고,
 * 슬롯(시간 칸) 높이를 최대 겹침 수에 맞춰 키운다. 진행이 있는 시간대는 박스로 묶는다.
 */
export default function WeeklyGrid({ weekStart, blocks }: WeeklyGridProps) {
  const days = getWeekDays(weekStart);
  const timeLabels = getTimeLabels();

  // 현재 시각(라인·라벨용). 30초마다 갱신해 라인이 움직이도록 한다.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), NOW_TICK_MS);
    return () => clearInterval(id);
  }, []);
  const nowIndicator = getNowIndicator(weekStart, now);

  // 주 범위(월~일) 밖 블록은 표시하지 않는다.
  const visibleBlocks = blocks.filter(
    (b) =>
      b.dayIndex >= 0 &&
      b.dayIndex <= 6 &&
      b.slotIndex >= 0 &&
      b.slotIndex < SLOTS_PER_DAY,
  );

  // 요일별 클러스터.
  const dayClustersList = days.map((_, di) =>
    layoutDayClusters(visibleBlocks.filter((b) => b.dayIndex === di)),
  );

  // 슬롯 높이 = 그 주의 최대 동시 진행 개수만큼 이벤트가 들어가도록 키운다.
  // 박스 여백(BOX_PAD)·셀 여백(CELL_PAD)까지 포함해, 진행 박스가 칸을 넘지 않게 한다.
  const maxLanes = Math.min(
    MAX_LANES,
    Math.max(1, ...dayClustersList.flat().map((c) => c.laneCount)),
  );
  const slotHeight =
    2 * CELL_PAD +
    2 * BOX_PAD +
    maxLanes * EVENT_HEIGHT +
    (maxLanes - 1) * LANE_GAP;
  const gridHeight = SLOTS_PER_DAY * slotHeight;

  // 이벤트(레인) 실제 top 좌표. 박스·이벤트가 이 값을 공유해 여백이 어긋나지 않는다.
  const eventTop = (b: LaidBlock) =>
    b.slotIndex * slotHeight +
    CELL_PAD +
    BOX_PAD +
    b.laneIndex * (EVENT_HEIGHT + LANE_GAP);

  const sessionCounts = dayClustersList.map((clusters) =>
    clusters.reduce(
      (n, c) => n + c.blocks.filter((b) => b.isSession).length,
      0,
    ),
  );
  const weekTotal = sessionCounts.reduce((a, b) => a + b, 0);

  return (
    <div className="border-neutral-90 overflow-x-auto rounded-lg border">
      <div className="min-w-[920px]">
        {/* 현재 날짜·시각 + 이번 주 총 진행 건수 */}
        <div className="border-neutral-90 flex items-center justify-between gap-2 border-b bg-white px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-xxsmall12 text-neutral-40">현재</span>
            <span className="text-xsmall14 text-neutral-0 font-semibold">
              {formatNowLabel(now)}
            </span>
          </div>
          <span className="text-xsmall14 text-neutral-40">
            이번 주 진행{' '}
            <span className="font-semibold text-indigo-600">{weekTotal}</span>건
          </span>
        </div>

        {/* 요일 헤더 */}
        <div
          className="border-neutral-85 bg-neutral-95 grid border-b"
          style={{ gridTemplateColumns: `${TIME_COL_WIDTH}px repeat(7, 1fr)` }}
        >
          <div />
          {days.map((day, dayIndex) => (
            <div
              key={day}
              className={twMerge(
                'text-xsmall14 py-2 text-center font-semibold',
                dayIndex === 5
                  ? 'text-blue-600'
                  : dayIndex === 6
                    ? 'text-red-500'
                    : 'text-neutral-0',
              )}
            >
              <div>{formatDayHeader(day)}</div>
              {sessionCounts[dayIndex] > 0 && (
                <div className="text-xxsmall12 mt-0.5 font-medium text-indigo-600">
                  진행 {sessionCounts[dayIndex]}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 본문: 시간축 + 7개 요일 컬럼 */}
        <div
          className="grid"
          style={{ gridTemplateColumns: `${TIME_COL_WIDTH}px repeat(7, 1fr)` }}
        >
          {/* 시간축 — 정시 라벨만 표시해 시야를 정리한다. */}
          <div className="relative" style={{ height: gridHeight }}>
            {timeLabels.map((label, i) =>
              i % 2 === 0 ? (
                <div
                  key={label}
                  className="text-xxsmall12 text-neutral-40 absolute right-2 -translate-y-1/2 font-medium"
                  style={{ top: i * slotHeight }}
                >
                  {label}
                </div>
              ) : null,
            )}
          </div>

          {/* 요일별 컬럼 */}
          {days.map((day, dayIndex) => {
            const clusters = dayClustersList[dayIndex];
            const isWeekend = dayIndex === 5 || dayIndex === 6;
            return (
              <div
                key={day}
                className={twMerge(
                  'border-neutral-90 relative border-l',
                  isWeekend && 'bg-neutral-95',
                )}
                style={{ height: gridHeight }}
              >
                {/* 슬롯 가이드 라인: 정시는 진하게, 30분은 옅게 */}
                {timeLabels.map((label, i) => (
                  <div
                    key={label}
                    className={twMerge(
                      'absolute inset-x-0 border-t',
                      i % 2 === 0 ? 'border-neutral-85' : 'border-neutral-95',
                    )}
                    style={{ top: i * slotHeight }}
                  />
                ))}

                {/* 진행 박스 — 같은 시간대 묶음을 한 번 더 상자로 감싸 진행임을 표시.
                    이벤트 실제 위치 기준으로 상하좌우 동일 여백을 준다. */}
                {clusters
                  .filter((c) => c.hasSession)
                  .map((c) => {
                    const tops = c.blocks.map(eventTop);
                    const boxTop = Math.min(...tops) - BOX_PAD;
                    const boxBottom =
                      Math.max(...tops) + EVENT_HEIGHT + BOX_PAD;
                    return (
                      <div
                        key={`box-${c.startSlot}`}
                        className="pointer-events-none absolute inset-x-1 z-0 rounded-lg border-2 border-indigo-300 bg-indigo-50/50"
                        style={{ top: boxTop, height: boxBottom - boxTop }}
                      />
                    );
                  })}

                {/* 이벤트 박스 — 고정 크기로 세로로 쌓는다 */}
                {clusters.flatMap((c) =>
                  c.blocks.map((b) => (
                    <div
                      key={b.key}
                      onClick={b.onClick}
                      title={b.title}
                      className={twMerge(
                        'absolute inset-x-2 z-10 flex flex-col justify-center overflow-hidden rounded-md border-2 px-2 py-0.5',
                        'text-xxsmall12 leading-tight',
                        b.onClick &&
                          'cursor-pointer transition hover:opacity-80',
                        b.className,
                      )}
                      style={{ top: eventTop(b), height: EVENT_HEIGHT }}
                    >
                      {b.content}
                    </div>
                  )),
                )}

                {/* 현재 시각 라인(오늘 컬럼에만) */}
                {nowIndicator && nowIndicator.dayIndex === dayIndex && (
                  <div
                    className="pointer-events-none absolute inset-x-0 z-20 flex items-center"
                    style={{ top: nowIndicator.slotOffset * slotHeight }}
                  >
                    <span className="h-2 w-2 -translate-x-1/2 rounded-full bg-red-500" />
                    <span className="flex-1 border-t-2 border-red-500" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
