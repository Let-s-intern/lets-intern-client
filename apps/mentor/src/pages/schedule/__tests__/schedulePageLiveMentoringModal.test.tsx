/**
 * 일정 캘린더 → 1대1 제출물 모달 배선 검증.
 *
 * 캘린더의 1대1 카드를 누르면 `bar.liveMentoring.applicationId` 로 제출물 모달이
 * 열려야 한다. 표와 같은 예약을 눌렀을 때 같은 id 가 가야 두 화면이 같은 내용을 보여 준다.
 * 라이브 피드백 모달과 동시에 열리지 않는 것도 함께 고정한다.
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { PeriodBarData } from '../types';

// ─── 화면 밖 의존 모듈 ────────────────────────────────────────────────────────
vi.mock('../hooks/useLiveFeedbackData', () => ({
  useLiveFeedbackData: () => ({ bars: [], slotOpenWindow: null }),
}));

vi.mock('../hooks/useLiveMentoringData', () => ({
  useLiveMentoringData: () => ({ bars: [] }),
}));

vi.mock('../hooks/useScheduleData', () => ({
  useScheduleData: () => ({
    challenges: [],
    selectedFeedbackTags: new Set(),
    toggleFeedbackTag: vi.fn(),
    clearFeedbackTags: vi.fn(),
    allBarsUnfiltered: [],
    filteredBars: [],
    handleData: vi.fn(),
    findNearestDateForTag: () => null,
    findNextDateForTag: () => null,
  }),
}));

vi.mock('../ui/WelcomeMessage', () => ({ default: () => null }));
vi.mock('../ui/ChallengeDataFetcher', () => ({ default: () => null }));
vi.mock('@/pages/feedback/FeedbackModal', () => ({ default: () => null }));
vi.mock('@/pages/feedback/ui/MobileFeedbackPage', () => ({
  default: () => null,
}));
vi.mock('@/pages/feedback-live-availability/FeedbackAvailabilityModal', () => ({
  default: () => null,
}));

/** 캘린더는 클릭 콜백만 대신 쏘아 준다 — 렌더 자체는 캘린더 테스트가 본다. */
vi.mock('../weekly-calendar/WeeklyCalendar', () => ({
  default: (props: {
    onLiveMentoringClick?: (bar: PeriodBarData) => void;
    onLiveFeedbackTimeBlockClick?: (bar: PeriodBarData) => void;
  }) => (
    <div>
      <button
        type="button"
        onClick={() => props.onLiveMentoringClick?.(LIVE_MENTORING_BAR)}
      >
        1대1 카드
      </button>
      <button
        type="button"
        onClick={() =>
          props.onLiveFeedbackTimeBlockClick?.(LIVE_FEEDBACK_BAR as never)
        }
      >
        라이브 피드백 블록
      </button>
    </div>
  ),
}));

const liveModalProps: Array<Record<string, unknown>> = [];
vi.mock('../modal/LiveFeedbackReservationModal', () => ({
  default: (props: Record<string, unknown>) => {
    liveModalProps.push(props);
    return null;
  },
}));

const submissionModalProps: Array<{
  applicationId: number | null;
  onClose: () => void;
}> = [];
vi.mock(
  '@/pages/live-mentoring/reservation-detail/LiveMentoringSubmissionModal',
  () => ({
    default: (props: { applicationId: number | null; onClose: () => void }) => {
      submissionModalProps.push(props);
      return props.applicationId === null ? null : (
        <button type="button" onClick={props.onClose}>
          제출물 모달 닫기
        </button>
      );
    },
  }),
);

import SchedulePage from '../SchedulePage';

// ─── 바 픽스처 ───────────────────────────────────────────────────────────────
const LIVE_MENTORING_BAR = {
  barType: 'live-mentoring',
  challengeId: -1,
  missionId: -4091004,
  challengeTitle: '1대1 라이브 멘토링',
  th: 1,
  startDate: '2026-05-04',
  endDate: '2026-05-04',
  feedbackStartDate: '2026-05-04',
  feedbackDeadline: '2026-05-04',
  submittedCount: 0,
  notSubmittedCount: 0,
  waitingCount: 0,
  inProgressCount: 0,
  completedCount: 0,
  liveMentoring: {
    applicationId: 91004,
    menteeName: '김일대',
    productName: '자소서 실전 첨삭 멘토링',
    startTime: '14:00',
    endTime: '15:00',
    durationMinutes: 60,
    questionWritten: true,
    attachmentSubmitted: true,
  },
} as unknown as PeriodBarData;

const LIVE_FEEDBACK_BAR = {
  barType: 'live-feedback',
  challengeId: 1,
  missionId: 501,
  challengeTitle: '자소서 챌린지 7기',
  th: 3,
  startDate: '2026-05-04',
  endDate: '2026-05-04',
};

/** 마지막으로 제출물 모달에 넘어간 applicationId. */
const lastApplicationId = () =>
  submissionModalProps[submissionModalProps.length - 1]?.applicationId ?? null;

/** 마지막으로 라이브 피드백 모달에 넘어간 열림 여부. */
const liveModalIsOpen = () =>
  liveModalProps[liveModalProps.length - 1]?.isOpen ?? false;

beforeEach(() => {
  liveModalProps.length = 0;
  submissionModalProps.length = 0;
});

describe('캘린더에서 1대1 제출물 모달 열기', () => {
  it('처음에는 applicationId 가 null 이라 모달이 조회하지 않는다', () => {
    render(<SchedulePage />);

    expect(lastApplicationId()).toBeNull();
  });

  it('1대1 카드를 누르면 그 바의 applicationId 로 열린다', async () => {
    render(<SchedulePage />);

    await userEvent.click(screen.getByRole('button', { name: '1대1 카드' }));

    expect(lastApplicationId()).toBe(91004);
  });

  it('닫으면 applicationId 가 다시 null 이 된다', async () => {
    render(<SchedulePage />);

    await userEvent.click(screen.getByRole('button', { name: '1대1 카드' }));
    await userEvent.click(
      screen.getByRole('button', { name: '제출물 모달 닫기' }),
    );

    expect(lastApplicationId()).toBeNull();
  });
});

describe('라이브 피드백 모달과 배타', () => {
  it('1대1 모달을 열면 라이브 피드백 모달은 닫혀 있다', async () => {
    render(<SchedulePage />);

    await userEvent.click(
      screen.getByRole('button', { name: '라이브 피드백 블록' }),
    );
    expect(liveModalIsOpen()).toBe(true);

    await userEvent.click(screen.getByRole('button', { name: '1대1 카드' }));

    expect(lastApplicationId()).toBe(91004);
    expect(liveModalIsOpen()).toBe(false);
  });

  it('라이브 피드백 모달을 열면 1대1 모달이 닫힌다', async () => {
    render(<SchedulePage />);

    await userEvent.click(screen.getByRole('button', { name: '1대1 카드' }));
    await userEvent.click(
      screen.getByRole('button', { name: '라이브 피드백 블록' }),
    );

    expect(lastApplicationId()).toBeNull();
    expect(liveModalIsOpen()).toBe(true);
  });
});
