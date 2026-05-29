import { twMerge } from '@/lib/twMerge';
import {
  formatDayHeader,
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
}

interface WeeklyGridProps {
  /** 표시 주의 월요일(ISO 자정) */
  weekStart: string;
  blocks: GridBlock[];
}

/** 슬롯 1칸 높이(px). */
const SLOT_HEIGHT = 28;
const TIME_COL_WIDTH = 56;

/**
 * 공용 주간 시간대 그리드.
 * 7일 x 30분 슬롯 격자에 절대 위치로 블록을 배치한다.
 * 예약 캘린더(3.2)·멘토 스케줄(3.3)이 공유한다.
 */
export default function WeeklyGrid({ weekStart, blocks }: WeeklyGridProps) {
  const days = getWeekDays(weekStart);
  const timeLabels = getTimeLabels();
  const gridHeight = SLOTS_PER_DAY * SLOT_HEIGHT;

  // 주 범위(월~일) 밖 블록은 표시하지 않는다.
  const visibleBlocks = blocks.filter(
    (b) =>
      b.dayIndex >= 0 &&
      b.dayIndex <= 6 &&
      b.slotIndex >= 0 &&
      b.slotIndex < SLOTS_PER_DAY,
  );

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[720px]">
        {/* 요일 헤더 */}
        <div
          className="border-neutral-80 grid border-b"
          style={{
            gridTemplateColumns: `${TIME_COL_WIDTH}px repeat(7, 1fr)`,
          }}
        >
          <div />
          {days.map((day) => (
            <div
              key={day}
              className="text-xxsmall12 text-neutral-0 py-2 text-center font-semibold"
            >
              {formatDayHeader(day)}
            </div>
          ))}
        </div>

        {/* 본문: 시간축 + 7개 요일 컬럼 */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: `${TIME_COL_WIDTH}px repeat(7, 1fr)`,
          }}
        >
          {/* 시간축 */}
          <div className="relative" style={{ height: gridHeight }}>
            {timeLabels.map((label, i) => (
              <div
                key={label}
                className="text-xxsmall12 text-neutral-40 absolute right-1 -translate-y-1/2"
                style={{ top: i * SLOT_HEIGHT }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* 요일별 컬럼 */}
          {days.map((day, dayIndex) => (
            <div
              key={day}
              className="border-neutral-90 relative border-l"
              style={{ height: gridHeight }}
            >
              {/* 슬롯 가이드 라인 */}
              {timeLabels.map((label, i) => (
                <div
                  key={label}
                  className="border-neutral-95 absolute inset-x-0 border-t"
                  style={{ top: i * SLOT_HEIGHT }}
                />
              ))}

              {/* 블록 */}
              {visibleBlocks
                .filter((b) => b.dayIndex === dayIndex)
                .map((b) => (
                  <div
                    key={b.key}
                    className={twMerge(
                      'absolute inset-x-0.5 overflow-hidden rounded border px-1 py-0.5',
                      'text-xxsmall12 leading-tight',
                      b.className,
                    )}
                    style={{
                      top: b.slotIndex * SLOT_HEIGHT,
                      height: b.slotSpan * SLOT_HEIGHT - 2,
                    }}
                  >
                    {b.content}
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
