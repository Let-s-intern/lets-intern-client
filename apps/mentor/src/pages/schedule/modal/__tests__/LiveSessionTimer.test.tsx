import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import LiveSessionTimer from '../LiveSessionTimer';

// 기준 시각(고정) — 이 시각 기준으로 start/end 상대값을 만든다.
const BASE = new Date('2026-05-04T18:42:07+09:00');

function isoFrom(offsetMin: number): string {
  return new Date(BASE.getTime() + offsetMin * 60_000).toISOString();
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(BASE);
});

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe('LiveSessionTimer', () => {
  it('현재 시각을 HH:mm:ss 로 표시하고 1초 뒤 갱신한다', () => {
    // 세션 진행 중(시작 10분 전 ~ 종료 20분 후)
    render(<LiveSessionTimer startDate={isoFrom(-10)} endDate={isoFrom(20)} />);

    expect(screen.getByText('18:42:07')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText('18:42:08')).toBeInTheDocument();
  });

  it('남은 시간이 12분 30초면 "12:30"을 표시한다', () => {
    const end = new Date(BASE.getTime() + 12 * 60_000 + 30_000).toISOString();
    render(<LiveSessionTimer startDate={isoFrom(-5)} endDate={end} />);
    expect(screen.getByText('12:30')).toBeInTheDocument();
  });

  it('종료 시각이 지나면 "종료" 라벨을 렌더한다', () => {
    // 시작/종료 모두 과거 → after
    render(
      <LiveSessionTimer startDate={isoFrom(-60)} endDate={isoFrom(-30)} />,
    );
    expect(screen.getByText('종료')).toBeInTheDocument();
  });

  it('진행 중에 시간이 흐르면 "종료"로 전환된다', () => {
    // 종료까지 2초 남음
    const end = new Date(BASE.getTime() + 2000).toISOString();
    render(<LiveSessionTimer startDate={isoFrom(-1)} endDate={end} />);

    expect(screen.queryByText('종료')).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByText('종료')).toBeInTheDocument();
  });
});
