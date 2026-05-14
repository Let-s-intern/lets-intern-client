import { differenceInCalendarDays } from 'date-fns';
import { describe, expect, it } from 'vitest';

/**
 * barLayouts 계산 로직 단위 테스트.
 * WeeklyCalendar 내부 로직을 함수로 추출해 검증한다.
 */

const TIMELINE_START = new Date('2025-05-01');
const TOTAL_DAYS = 14; // 2주

function calcBarLayout(
  startDate: string,
  feedbackDeadline: string,
): { startCol: number; endCol: number } | null {
  const rawStart =
    differenceInCalendarDays(new Date(startDate), TIMELINE_START) + 1;
  const rawEnd =
    differenceInCalendarDays(new Date(feedbackDeadline), TIMELINE_START) + 2;

  if (rawEnd < 1 || rawStart > TOTAL_DAYS) return null;

  return {
    startCol: Math.max(1, rawStart),
    endCol: Math.min(TOTAL_DAYS + 1, rawEnd),
  };
}

function assignRows(
  bars: Array<{ startDate: string; feedbackDeadline: string }>,
): Array<number | null> {
  const rowRanges: Array<Array<{ start: number; end: number }>> = [];
  return bars.map((bar) => {
    const layout = calcBarLayout(bar.startDate, bar.feedbackDeadline);
    if (!layout) return null;

    let gridRow = 1;
    while (true) {
      const occupied = rowRanges[gridRow - 1] ?? [];
      const hasConflict = occupied.some(
        (r) => layout.startCol < r.end && layout.endCol > r.start,
      );
      if (!hasConflict) break;
      gridRow++;
    }

    if (!rowRanges[gridRow - 1]) rowRanges[gridRow - 1] = [];
    rowRanges[gridRow - 1].push({ start: layout.startCol, end: layout.endCol });
    return gridRow;
  });
}

describe('barLayout — 기간바 영역 클램핑', () => {
  it('타임라인 내 정상 bar는 그대로 반환', () => {
    const result = calcBarLayout('2025-05-03', '2025-05-08');
    expect(result).not.toBeNull();
    expect(result!.startCol).toBe(3);
    expect(result!.endCol).toBe(9);
  });

  it('시작이 타임라인 이전 → startCol이 1로 클램핑', () => {
    const result = calcBarLayout('2025-04-25', '2025-05-05');
    expect(result).not.toBeNull();
    expect(result!.startCol).toBe(1);
  });

  it('종료가 타임라인 이후 → endCol이 totalDays+1로 클램핑', () => {
    const result = calcBarLayout('2025-05-10', '2025-05-25');
    expect(result).not.toBeNull();
    expect(result!.endCol).toBe(TOTAL_DAYS + 1);
  });

  it('완전히 범위 밖(이전) → null', () => {
    expect(calcBarLayout('2025-04-01', '2025-04-28')).toBeNull();
  });

  it('완전히 범위 밖(이후) → null', () => {
    expect(calcBarLayout('2025-05-20', '2025-05-25')).toBeNull();
  });
});

describe('barLayout — 동일 챌린지 기간바 중첩 방지', () => {
  it('겹치지 않는 bar들은 모두 row 1에 배치', () => {
    const rows = assignRows([
      { startDate: '2025-05-01', feedbackDeadline: '2025-05-05' },
      { startDate: '2025-05-06', feedbackDeadline: '2025-05-10' },
    ]);
    expect(rows).toEqual([1, 1]);
  });

  it('겹치는 bar는 다른 row로 분리', () => {
    const rows = assignRows([
      { startDate: '2025-05-01', feedbackDeadline: '2025-05-08' },
      { startDate: '2025-05-04', feedbackDeadline: '2025-05-12' },
    ]);
    expect(rows[0]).toBe(1);
    expect(rows[1]).toBe(2);
  });

  it('비겹침 → 겹침 → 비겹침 시나리오: row 재활용', () => {
    // [1~5], [3~8 겹침], [6~10 비겹침] → row 1, 2, 1
    const rows = assignRows([
      { startDate: '2025-05-01', feedbackDeadline: '2025-05-05' },
      { startDate: '2025-05-03', feedbackDeadline: '2025-05-08' },
      { startDate: '2025-05-06', feedbackDeadline: '2025-05-10' },
    ]);
    expect(rows[0]).toBe(1);
    expect(rows[1]).toBe(2);
    expect(rows[2]).toBe(1);
  });
});
