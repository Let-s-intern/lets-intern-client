/**
 * WeeklyCalendar 하단 라이브 섹션 — 시간순 스택 렌더 검증 (Task A).
 *
 * 기존 시간 그리드(좌측 09:00/09:30… 시간 레이블 + 30분 슬롯 절대배치)를
 * 시간순 스택(좌측 시간 레이블 제거 + 세션을 시작시각 오름차순으로 적재)으로
 * 바꾼 동작을 검증한다.
 *
 * useTimelineScroll(rAF/IntersectionObserver/scrollTo 의존)은 mock 으로 고정해
 * 스택 렌더 자체에 집중한다.
 */
import { render, screen, within } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import type { PeriodBarData } from '../../types';
import WeeklyCalendar from '../WeeklyCalendar';

// 2일 윈도우(2026-05-04, 2026-05-05) 고정 — 세션 날짜를 모두 포함.
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
  // jsdom 미지원 API stub
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      disconnect() {}
      unobserve() {}
    },
  );
});

function makeLiveBar(overrides: {
  missionId: number;
  startTime: string;
  endTime: string;
  menteeName: string;
  startDate?: string;
}): PeriodBarData {
  return {
    barType: 'live-feedback',
    challengeId: 1,
    challengeTitle: '자소서 챌린지 7기',
    th: 1,
    missionId: overrides.missionId,
    startDate: overrides.startDate ?? '2026-05-04',
    endDate: overrides.startDate ?? '2026-05-04',
    feedbackStartDate: overrides.startDate ?? '2026-05-04',
    feedbackDeadline: overrides.startDate ?? '2026-05-04',
    submittedCount: 0,
    notSubmittedCount: 0,
    waitingCount: 0,
    inProgressCount: 0,
    completedCount: 0,
    liveFeedback: {
      id: overrides.missionId,
      menteeName: overrides.menteeName,
      startTime: overrides.startTime,
      endTime: overrides.endTime,
    },
  };
}

function renderCalendar(bars: PeriodBarData[]) {
  return render(
    <WeeklyCalendar bars={bars} allBars={bars} onBarClick={vi.fn()} />,
  );
}

describe('WeeklyCalendar — 라이브 시간순 스택', () => {
  it('좌측 시간축 레이블(09:00/09:30 …)을 더 이상 렌더하지 않는다', () => {
    // 09:00 시작 세션 1건만 둔다. 구 레이아웃이면 슬롯마다 09:00, 09:30 … 레이블이
    // 좌측 축에 별도로 찍혔다. 신 레이아웃에선 카드 안 시작시각 1회만 존재한다.
    const bars = [
      makeLiveBar({
        missionId: 1,
        startTime: '09:00',
        endTime: '09:30',
        menteeName: '이지수',
      }),
    ];
    renderCalendar(bars);

    // 좌측 축 슬롯 레이블이었던 '09:30' 은 어디에도 없어야 한다 (세션은 09:00 시작).
    expect(screen.queryByText('09:30')).not.toBeInTheDocument();
    // 시작시각 '09:00' 은 카드 안에서만(=정확히 1회) 노출된다.
    expect(screen.getAllByText('09:00')).toHaveLength(1);
  });

  it('한 날짜의 세션을 시작시각 오름차순으로 위에서부터 쌓는다', () => {
    // 입력 순서를 일부러 뒤섞어도 시간순으로 정렬되어야 한다.
    const bars = [
      makeLiveBar({
        missionId: 2,
        startTime: '14:00',
        endTime: '14:30',
        menteeName: '박서연',
      }),
      makeLiveBar({
        missionId: 1,
        startTime: '09:00',
        endTime: '09:30',
        menteeName: '이지수',
      }),
      makeLiveBar({
        missionId: 3,
        startTime: '11:00',
        endTime: '11:30',
        menteeName: '김민준',
      }),
    ];
    renderCalendar(bars);

    const menteeNodes = screen.getAllByText(/멘티$/);
    const order = menteeNodes.map((n) => n.textContent);
    expect(order).toEqual(['이지수 멘티', '김민준 멘티', '박서연 멘티']);
  });

  it('세션은 해당 날짜 열에 분리 렌더된다', () => {
    const bars = [
      makeLiveBar({
        missionId: 1,
        startTime: '09:00',
        endTime: '09:30',
        menteeName: '이지수',
        startDate: '2026-05-04',
      }),
      makeLiveBar({
        missionId: 2,
        startTime: '10:00',
        endTime: '10:30',
        menteeName: '바다',
        startDate: '2026-05-05',
      }),
    ];
    renderCalendar(bars);

    expect(screen.getByText('이지수 멘티')).toBeInTheDocument();
    expect(screen.getByText('바다 멘티')).toBeInTheDocument();
  });

  it('라이브 세션 클릭 시 onLiveFeedbackTimeBlockClick 핸들러가 호출된다', async () => {
    const { default: userEvent } = await import('@testing-library/user-event');
    const onClick = vi.fn();
    const bar = makeLiveBar({
      missionId: 1,
      startTime: '09:00',
      endTime: '09:30',
      menteeName: '이지수',
    });
    render(
      <WeeklyCalendar
        bars={[bar]}
        allBars={[bar]}
        onBarClick={vi.fn()}
        onLiveFeedbackTimeBlockClick={onClick}
      />,
    );

    await userEvent
      .setup()
      .click(
        within(screen.getByText('이지수 멘티').closest('button')!).getByText(
          '이지수 멘티',
        ),
      );
    expect(onClick).toHaveBeenCalledWith(bar);
  });
});
