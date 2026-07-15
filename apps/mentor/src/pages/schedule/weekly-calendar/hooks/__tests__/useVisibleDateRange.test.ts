import { describe, expect, it } from 'vitest';

import { computeVisibleRange } from '../useVisibleDateRange';

// 타임라인: 2026-06-01 시작, 28일. dayWidth = 2800/28 = 100px, 뷰포트 700px = 7일.
const BASE = {
  timelineStart: new Date('2026-06-01'),
  totalDays: 28,
  scrollWidth: 2800,
  clientWidth: 700,
};

function iso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

describe('computeVisibleRange', () => {
  it('스크롤 0이면 타임라인 시작부터 7일을 보여준다', () => {
    const range = computeVisibleRange({ ...BASE, scrollLeft: 0 });
    expect(range).not.toBeNull();
    expect(iso(range!.firstVisibleDate)).toBe('2026-06-01');
    expect(iso(range!.lastVisibleDate)).toBe('2026-06-07');
  });

  it('스크롤한 만큼 보이는 날짜 범위가 이동한다', () => {
    // scrollLeft 1000 → firstIdx = floor(1000/100) = 10일째
    const range = computeVisibleRange({ ...BASE, scrollLeft: 1000 });
    expect(iso(range!.firstVisibleDate)).toBe('2026-06-11');
    expect(iso(range!.lastVisibleDate)).toBe('2026-06-17');
  });

  it('마지막 끝까지 스크롤해도 totalDays 범위를 넘지 않는다', () => {
    const range = computeVisibleRange({ ...BASE, scrollLeft: 999999 });
    // lastIdx 는 totalDays-1(27) = 2026-06-28 로 클램프
    expect(iso(range!.lastVisibleDate)).toBe('2026-06-28');
  });

  it('레이아웃 전(scrollWidth=0)이면 null', () => {
    expect(
      computeVisibleRange({ ...BASE, scrollWidth: 0, scrollLeft: 0 }),
    ).toBeNull();
  });

  it('데이터 없음(totalDays=0)이면 null', () => {
    expect(
      computeVisibleRange({ ...BASE, totalDays: 0, scrollLeft: 0 }),
    ).toBeNull();
  });
});
