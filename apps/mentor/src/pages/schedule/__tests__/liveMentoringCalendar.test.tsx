/**
 * 캘린더의 1대1 라이브 멘토링 예약 표시 검증 (Push 7-A).
 *
 *  - 서버가 내린 확정 건이 캘린더 하단 "시간별 일정"에 그려진다
 *  - 같은 시간대에 라이브 피드백과 겹쳐도 둘 다 보인다
 *  - 1대1 카드는 클릭되지 않는다 (열 수 있는 상세 화면이 없다)
 *  - 다른 주의 건은 그 주의 열에만 들어간다
 *
 * useTimelineScroll(rAF/IntersectionObserver/scrollTo 의존)은 mock 으로 고정한다.
 */
import { render, screen, within } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import type { LiveMentoringReservation } from '@/api/live-mentoring/liveMentoringSchema';

import {
  LIVE_MENTORING_TITLE,
  deriveLiveMentoringBars,
} from '../hooks/useLiveMentoringData';
import type { PeriodBarData } from '../types';
import { filterMentorSchedule } from '../utils/filterMentorSchedule';
import WeeklyCalendar from '../weekly-calendar/WeeklyCalendar';

/** 2일 윈도우 — 이 범위 밖 날짜는 열이 없어 그려지지 않는다. */
const DAYS = [new Date('2026-05-04'), new Date('2026-05-05')];

vi.mock('../weekly-calendar/hooks/useInfiniteWeekScroll', () => ({
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

function makeReservation(
  overrides: Partial<LiveMentoringReservation> = {},
): LiveMentoringReservation {
  return {
    applicationId: 1,
    menteeId: 100,
    menteeName: '김일대',
    productName: '자소서 실전 첨삭 멘토링',
    durationMinutes: 60,
    reservationStartAt: '2026-05-04T14:00:00',
    reservationEndAt: '2026-05-04T15:00:00',
    status: 'CONFIRMED',
    questionWritten: true,
    attachmentSubmitted: true,
    createDate: '2026-05-01T09:00:00',
    ...overrides,
  };
}

function makeLiveFeedbackBar(startTime: string, menteeName: string) {
  return {
    barType: 'live-feedback' as const,
    challengeId: 1,
    missionId: 501,
    challengeTitle: '자소서 챌린지 7기',
    th: 3,
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
      id: 501,
      menteeName,
      startTime,
      endTime: '15:00',
    },
  };
}

function renderCalendar(bars: PeriodBarData[]) {
  return render(
    <WeeklyCalendar bars={bars} allBars={bars} onBarClick={vi.fn()} />,
  );
}

describe('deriveLiveMentoringBars', () => {
  it('예약 1건이 live-mentoring 바 1개가 된다', () => {
    const [bar] = deriveLiveMentoringBars([makeReservation()]);

    expect(bar.barType).toBe('live-mentoring');
    expect(bar.startDate).toBe('2026-05-04');
    expect(bar.challengeTitle).toBe(LIVE_MENTORING_TITLE);
    expect(bar.liveMentoring).toMatchObject({
      applicationId: 1,
      menteeName: '김일대',
      startTime: '14:00',
      endTime: '15:00',
      durationMinutes: 60,
    });
  });

  it('제출·피드백 집계는 전부 0이다 (1대1에는 없는 단위)', () => {
    const [bar] = deriveLiveMentoringBars([makeReservation()]);

    expect(bar.submittedCount).toBe(0);
    expect(bar.notSubmittedCount).toBe(0);
    expect(bar.waitingCount).toBe(0);
    expect(bar.inProgressCount).toBe(0);
    expect(bar.completedCount).toBe(0);
  });

  it('missionId 는 음수라 서면 미션과 겹치지 않는다', () => {
    const [bar] = deriveLiveMentoringBars([
      makeReservation({ applicationId: 77001 }),
    ]);

    expect(bar.missionId).toBeLessThan(0);
  });

  it('멘토 화이트리스트를 통과한다', () => {
    const bars = deriveLiveMentoringBars([makeReservation()]);

    expect(filterMentorSchedule(bars)).toHaveLength(1);
  });
});

describe('WeeklyCalendar — 1대1 라이브 멘토링 예약', () => {
  it('확정 건이 캘린더에 그려진다', () => {
    renderCalendar(deriveLiveMentoringBars([makeReservation()]));

    expect(screen.getByText('김일대 멘티')).toBeInTheDocument();
    expect(screen.getByText(LIVE_MENTORING_TITLE)).toBeInTheDocument();
    expect(screen.getByText('14:00')).toBeInTheDocument();
    expect(screen.getByText('60분')).toBeInTheDocument();
  });

  it('질문·전달 파일 제출 여부를 빈 칸 없이 적는다', () => {
    const { unmount } = renderCalendar(
      deriveLiveMentoringBars([
        makeReservation({ questionWritten: false, attachmentSubmitted: false }),
      ]),
    );
    expect(screen.getByText('미제출')).toBeInTheDocument();
    unmount();

    renderCalendar(
      deriveLiveMentoringBars([
        makeReservation({ questionWritten: true, attachmentSubmitted: false }),
      ]),
    );
    expect(screen.getByText('질문만 제출')).toBeInTheDocument();
  });

  it('같은 시간대에 라이브 피드백과 겹쳐도 둘 다 보인다', () => {
    renderCalendar([
      makeLiveFeedbackBar('14:00', '박라이브'),
      ...deriveLiveMentoringBars([makeReservation()]),
    ]);

    expect(screen.getByText('박라이브 멘티')).toBeInTheDocument();
    expect(screen.getByText('김일대 멘티')).toBeInTheDocument();
  });

  it('1대1 카드는 클릭되지 않는다 (버튼이 아니다)', () => {
    const onLiveFeedbackTimeBlockClick = vi.fn();
    render(
      <WeeklyCalendar
        bars={deriveLiveMentoringBars([makeReservation()])}
        allBars={deriveLiveMentoringBars([makeReservation()])}
        onBarClick={vi.fn()}
        onLiveFeedbackTimeBlockClick={onLiveFeedbackTimeBlockClick}
      />,
    );

    const card = screen.getByText('김일대 멘티').closest('div');
    expect(card?.closest('button')).toBeNull();
    expect(onLiveFeedbackTimeBlockClick).not.toHaveBeenCalled();
  });

  it('예약은 자기 날짜 열에만 들어간다 (주 이동 시 그 주의 건만 보인다)', () => {
    const { container } = renderCalendar(
      deriveLiveMentoringBars([
        makeReservation({ applicationId: 1, menteeName: '오늘멘티' }),
        makeReservation({
          applicationId: 2,
          menteeName: '내일멘티',
          reservationStartAt: '2026-05-05T10:00:00',
          reservationEndAt: '2026-05-05T11:00:00',
        }),
      ]),
    );

    // 하단 "시간별 일정" 그리드의 날짜 열 = DAYS 순서.
    const dayColumns = container.querySelectorAll(
      '.border-neutral-80.flex.border-t > div > div',
    );
    expect(dayColumns).toHaveLength(DAYS.length);
    expect(
      within(dayColumns[0] as HTMLElement).getByText('오늘멘티 멘티'),
    ).toBeInTheDocument();
    expect(
      within(dayColumns[1] as HTMLElement).getByText('내일멘티 멘티'),
    ).toBeInTheDocument();
  });

  it('윈도우 밖 날짜의 예약은 어느 열에도 그려지지 않는다', () => {
    renderCalendar(
      deriveLiveMentoringBars([
        makeReservation({
          menteeName: '다음주멘티',
          reservationStartAt: '2026-05-12T10:00:00',
          reservationEndAt: '2026-05-12T11:00:00',
        }),
      ]),
    );

    expect(screen.queryByText('다음주멘티 멘티')).not.toBeInTheDocument();
  });
});
