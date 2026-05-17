import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// mockNow를 null로 강제해서 setInterval이 동작하게 한다.
// (production 모드 시뮬레이션)
vi.mock('../../../schedule/constants/mockNow', () => ({
  MOCK_NOW: null,
  currentNow: () => new Date(),
}));

import { useFeedbackCountdown } from '../useFeedbackCountdown';

describe('useFeedbackCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // 고정된 "현재 시각": 2026-05-20 10:00:00 KST
    vi.setSystemTime(new Date('2026-05-20T10:00:00+09:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('시작 전 1시간 이내면 "N분 N초 후 시작" 라벨을 반환한다', () => {
    // 10:03:30 시작 → 3분 30초 후
    const { result } = renderHook(() =>
      useFeedbackCountdown(
        '2026-05-20T10:03:30+09:00',
        '2026-05-20T10:33:30+09:00',
      ),
    );

    expect(result.current.status).toBe('before');
    expect(result.current.label).toBe('3분 30초 후 시작');
  });

  it('시작 전 1시간 초과면 "N시간 N분 후 시작" 라벨을 반환한다', () => {
    // 12:30 시작 → 2시간 30분 후
    const { result } = renderHook(() =>
      useFeedbackCountdown(
        '2026-05-20T12:30:00+09:00',
        '2026-05-20T13:00:00+09:00',
      ),
    );

    expect(result.current.status).toBe('before');
    expect(result.current.label).toBe('2시간 30분 후 시작');
  });

  it('시작~종료 사이면 status="during", label="진행 중"', () => {
    // 시작 09:55 → 현재 10:00 → 종료 10:30 (진행 중)
    const { result } = renderHook(() =>
      useFeedbackCountdown(
        '2026-05-20T09:55:00+09:00',
        '2026-05-20T10:30:00+09:00',
      ),
    );

    expect(result.current.status).toBe('during');
    expect(result.current.label).toBe('진행 중');
    expect(result.current.remainingMs).toBeGreaterThan(0);
  });

  it('종료 후면 status="after", label="종료됨"', () => {
    // 종료 09:30 → 현재 10:00 (종료됨)
    const { result } = renderHook(() =>
      useFeedbackCountdown(
        '2026-05-20T09:00:00+09:00',
        '2026-05-20T09:30:00+09:00',
      ),
    );

    expect(result.current.status).toBe('after');
    expect(result.current.label).toBe('종료됨');
    expect(result.current.remainingMs).toBe(0);
  });

  it('1초마다 tick이 발생해 라벨이 갱신된다', () => {
    const { result } = renderHook(() =>
      useFeedbackCountdown(
        '2026-05-20T10:00:05+09:00', // 5초 후 시작
        '2026-05-20T10:30:05+09:00',
      ),
    );

    expect(result.current.label).toBe('0분 5초 후 시작');

    // 2초 진행
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.label).toBe('0분 3초 후 시작');
  });

  it('unmount 시 setInterval 이 cleanup 된다 (clearInterval 호출 확인)', () => {
    const clearSpy = vi.spyOn(globalThis, 'clearInterval');

    const { unmount } = renderHook(() =>
      useFeedbackCountdown(
        '2026-05-20T11:00:00+09:00',
        '2026-05-20T11:30:00+09:00',
      ),
    );

    unmount();

    expect(clearSpy).toHaveBeenCalled();
  });

  it('startDate/endDate가 비어 있으면 status="before", label=""', () => {
    const { result } = renderHook(() => useFeedbackCountdown(null, null));
    expect(result.current.status).toBe('before');
    expect(result.current.label).toBe('');
  });

  it('잘못된 ISO 문자열이면 status="before", label=""', () => {
    const { result } = renderHook(() =>
      useFeedbackCountdown('not-a-date', 'not-a-date'),
    );
    expect(result.current.status).toBe('before');
    expect(result.current.label).toBe('');
  });
});
