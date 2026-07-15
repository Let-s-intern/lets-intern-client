/**
 * WeeklyCalendar 구조 정렬 검증 (Push 2 디자인 — 이미지 #1).
 *
 * 상단=기간 바 영역 / 하단=시간별 LIVE 카드 영역 2단 구성과
 * 요일 헤더(일요일 빨강·오늘 파란 원형)·구분선 구조를 검증한다.
 * useTimelineScroll 은 mock 으로 고정해 렌더 구조에만 집중한다.
 */
import { render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import type { PeriodBarData } from '../../types';
import WeeklyCalendar from '../WeeklyCalendar';

const DAYS = [new Date('2026-05-04'), new Date('2026-05-05')];

vi.mock('../hooks/useInfiniteWeekScroll', () => ({
  useTimelineScroll: () => ({
    containerRef: { current: null },
    timelineStart: DAYS[0],
    totalDays: DAYS.length,
    days: DAYS,
    scrollToDate: vi.fn(),
    scrollToToday: vi.fn(),
  }),
}));

beforeAll(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      disconnect() {}
      unobserve() {}
    },
  );
});

function makeLiveBar(): PeriodBarData {
  return {
    barType: 'live-feedback',
    challengeId: 1,
    challengeTitle: '자소서 챌린지 7기',
    th: 1,
    missionId: 1,
    startDate: '2026-05-04',
    endDate: '2026-05-04',
    feedbackStartDate: '2026-05-04',
    feedbackDeadline: '2026-05-04',
    submittedCount: 0,
    notSubmittedCount: 0,
    waitingCount: 0,
    inProgressCount: 0,
    completedCount: 0,
    liveFeedback: {
      id: 1,
      menteeName: '이지수',
      startTime: '09:00',
      endTime: '09:30',
    },
  };
}

describe('WeeklyCalendar — 구조 정렬', () => {
  it('요일 헤더(월~일 라벨)를 렌더한다', () => {
    render(<WeeklyCalendar bars={[]} allBars={[]} onBarClick={vi.fn()} />);
    // 2026-05-04 = 월, 2026-05-05 = 화
    expect(screen.getByText('월')).toBeInTheDocument();
    expect(screen.getByText('화')).toBeInTheDocument();
  });

  it('라이브 세션이 있으면 하단 "시간별 일정" 섹션을 노출한다', () => {
    render(
      <WeeklyCalendar
        bars={[makeLiveBar()]}
        allBars={[makeLiveBar()]}
        onBarClick={vi.fn()}
      />,
    );
    expect(screen.getByText('시간별 일정')).toBeInTheDocument();
  });

  it('라이브 세션이 없으면 "시간별 일정" 섹션을 노출하지 않는다', () => {
    render(<WeeklyCalendar bars={[]} allBars={[]} onBarClick={vi.fn()} />);
    expect(screen.queryByText('시간별 일정')).not.toBeInTheDocument();
  });

  it('외곽 컨테이너에 rounded-2xl 테두리가 적용된다', () => {
    const { container } = render(
      <WeeklyCalendar bars={[]} allBars={[]} onBarClick={vi.fn()} />,
    );
    expect(container.querySelector('.rounded-2xl')).not.toBeNull();
  });
});
