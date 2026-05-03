/**
 * Integration test for useScheduleData × filterMentorSchedule × 피드백 태그 필터.
 *
 * (PRD-0503 #2) useScheduleData 가 반환하는 `filteredBars` 가 멘토 화이트리스트만 노출하는지,
 * `allBarsUnfiltered` 는 모달 의존성을 위해 그대로 유지되는지 검증한다.
 *
 * (PRD-0503 #4) 챌린지 단위 필터를 피드백 종류(태그) 단위 필터로 교체.
 *  - selectedFeedbackTags 가 빈 집합이면 "전체" 모드 (화이트리스트만 적용)
 *  - 태그가 선택되면 화이트리스트 ∩ 태그 매칭만 통과
 */

import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { useScheduleData } from '../hooks/useScheduleData';
import type { PeriodBarData } from '../types';
import { MENTOR_VISIBLE_BAR_TYPES } from '../utils/filterMentorSchedule';

// ── 테스트 헬퍼 ────────────────────────────────────────────────────────

const makeBar = (
  barType: PeriodBarData['barType'],
  challengeId: number,
  missionId: number,
  overrides: Partial<PeriodBarData> = {},
): PeriodBarData => ({
  barType,
  challengeId,
  missionId,
  challengeTitle: `Challenge ${challengeId}`,
  th: 1,
  startDate: '2026-05-04',
  endDate: '2026-05-10',
  feedbackStartDate: '2026-05-04',
  feedbackDeadline: '2026-05-10',
  submittedCount: 0,
  notSubmittedCount: 0,
  waitingCount: 0,
  inProgressCount: 0,
  completedCount: 0,
  ...overrides,
});

const wrapper = ({ children }: { children: ReactNode }) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

// ── 테스트 ────────────────────────────────────────────────────────────

describe('useScheduleData × 멘토 화이트리스트 + 피드백 태그 필터', () => {
  it('filteredBars 는 표시 허용 4종 (written-feedback, live-feedback-period, live-feedback-mentor-open, live-feedback) 만 포함한다 (전체 모드)', () => {
    const extraBars: PeriodBarData[] = [
      makeBar('written-mission-submit', 1, 10),
      makeBar('written-review', 1, 11),
      makeBar('written-feedback', 1, 12),
      makeBar('live-feedback-mentor-open', 2, 20),
      makeBar('live-feedback-mentee-open', 2, 21),
      makeBar('live-feedback-period', 2, 22),
      makeBar('live-feedback', 2, 23, {
        liveFeedback: {
          id: 1,
          menteeName: '홍길동',
          startTime: '10:00',
          endTime: '11:00',
        },
      }),
    ];

    const { result } = renderHook(() => useScheduleData({ extraBars }), {
      wrapper,
    });

    const visibleTypes = result.current.filteredBars.map((b) => b.barType);
    // 화이트리스트 외 타입은 모두 제거되어야 한다
    for (const type of visibleTypes) {
      expect(MENTOR_VISIBLE_BAR_TYPES).toContain(type);
    }
    expect(result.current.filteredBars).toHaveLength(4);
  });

  it('allBarsUnfiltered 는 화이트리스트 외 항목도 그대로 보존한다 (모달 의존성)', () => {
    const extraBars: PeriodBarData[] = [
      makeBar('written-mission-submit', 1, 10),
      makeBar('written-review', 1, 11),
      makeBar('written-feedback', 1, 12),
      makeBar('live-feedback-mentee-open', 2, 21),
      makeBar('live-feedback-period', 2, 22),
    ];

    const { result } = renderHook(() => useScheduleData({ extraBars }), {
      wrapper,
    });

    expect(result.current.allBarsUnfiltered).toHaveLength(5);
    expect(
      result.current.allBarsUnfiltered.some(
        (b) => b.barType === 'written-mission-submit',
      ),
    ).toBe(true);
    expect(
      result.current.allBarsUnfiltered.some(
        (b) => b.barType === 'live-feedback-mentee-open',
      ),
    ).toBe(true);
  });

  it('블랙리스트 항목만 들어오면 filteredBars 는 빈 배열', () => {
    const extraBars: PeriodBarData[] = [
      makeBar('written-mission-submit', 1, 10),
      makeBar('written-review', 1, 11),
      makeBar('live-feedback-mentee-open', 2, 21),
    ];

    const { result } = renderHook(() => useScheduleData({ extraBars }), {
      wrapper,
    });

    expect(result.current.filteredBars).toHaveLength(0);
    expect(result.current.allBarsUnfiltered).toHaveLength(3);
  });

  it('피드백 태그 적용 시 화이트리스트 ∩ 태그 매칭 바만 남는다', () => {
    const extraBars: PeriodBarData[] = [
      makeBar('written-feedback', 1, 12), // 화이트리스트 + written
      makeBar('written-feedback', 2, 22), // 화이트리스트 + written
      makeBar('written-mission-submit', 1, 10), // 비화이트리스트
      makeBar('live-feedback-period', 2, 24), // 화이트리스트 + live
    ];

    const { result } = renderHook(() => useScheduleData({ extraBars }), {
      wrapper,
    });

    // 초기: 빈 태그 집합 → 화이트리스트 3종 (written-feedback x2 + live-feedback-period)
    expect(result.current.filteredBars).toHaveLength(3);

    // written 태그 선택 → 서면 피드백 2개만
    act(() => {
      result.current.toggleFeedbackTag('written');
    });

    expect(result.current.filteredBars).toHaveLength(2);
    expect(
      result.current.filteredBars.every((b) => b.barType === 'written-feedback'),
    ).toBe(true);

    // live 태그 추가 선택 → 서면 + 라이브 기간 = 3개
    act(() => {
      result.current.toggleFeedbackTag('live');
    });

    expect(result.current.filteredBars).toHaveLength(3);

    // 전체 초기화
    act(() => {
      result.current.clearFeedbackTags();
    });

    expect(result.current.selectedFeedbackTags.size).toBe(0);
    expect(result.current.filteredBars).toHaveLength(3);
  });
});
