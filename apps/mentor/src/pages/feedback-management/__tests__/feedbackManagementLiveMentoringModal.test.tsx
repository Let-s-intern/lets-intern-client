/**
 * 피드백 내역 표 → 1대1 제출물 모달 배선 검증.
 *
 * 표에서 1대1 행의 `보기` 를 누르면 그 예약의 `applicationId` 로 제출물 모달이 열려야
 * 한다. 다른 행의 id 가 넘어가면 멘토가 남의 제출물을 보게 되므로 값까지 고정한다.
 * 라이브·서면 행이 기존 모달로 가는 경로와, 두 모달이 동시에 열리지 않는 것도 함께 본다.
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { FeedbackRow } from '../types';

// ─── 화면 밖 의존 모듈 ────────────────────────────────────────────────────────
const openWrittenFeedbackModal = vi.fn();

vi.mock('../hooks/useFeedbackManagement', () => ({
  useFeedbackManagement: () => ({
    challengeList: [],
    isLoading: false,
    feedbackModal: { isOpen: false, challengeId: 0, missionId: 0 },
    openWrittenFeedbackModal,
    handleCloseModal: vi.fn(),
  }),
}));

vi.mock('../hooks/useLiveFeedbackList', () => ({
  useLiveFeedbackList: () => ({ challenges: [], allSessionBars: [] }),
}));

let rows: FeedbackRow[] = [];
vi.mock('../hooks/useMergedFeedbackRows', () => ({
  useMergedFeedbackRows: () => rows,
  useWrittenMissionRangeMap: () => new Map(),
}));

vi.mock('@/api/live-mentoring/liveMentoring', () => ({
  useLiveMentoringReservationsQuery: () => ({ data: undefined }),
}));

vi.mock('../ui/WrittenMenteeAttendanceFetcher', () => ({
  default: () => null,
}));
vi.mock('@/pages/feedback/FeedbackModal', () => ({ default: () => null }));
vi.mock('@/pages/feedback/ui/MobileFeedbackPage', () => ({
  default: () => null,
}));

// 두 모달은 prop 만 확인한다 — 내용은 각 모달의 테스트가 본다.
const liveModalProps: Array<Record<string, unknown>> = [];
vi.mock('@/pages/schedule/modal/LiveFeedbackReservationModal', () => ({
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

import FeedbackManagementPage from '../FeedbackManagementPage';

// ─── 행 픽스처 ───────────────────────────────────────────────────────────────
const liveMentoringRow = (
  applicationId: number,
  name: string,
): FeedbackRow => ({
  id: `live-mentoring-${applicationId}`,
  type: 'live-mentoring',
  startDate: '2026-05-04',
  startTime: '14:00',
  endTime: '15:00',
  statusLabel: '진행 예정',
  statusTone: 'liveWaiting',
  reservationLabel: '예약 완료',
  submissionLabel: '일부 제출',
  menteeParticipation: null,
  mentorParticipation: null,
  challengeTitle: '1대1 라이브 멘토링',
  thLabel: '해당 없음',
  scheduleLabel: '2026.05.04 14:00 ~ 15:00',
  menteeNameLabel: name,
  canOpenDetail: true,
  detailDisabledReason: null,
  source: {
    type: 'live-mentoring',
    reservation: { applicationId } as never,
  },
});

const writtenRow: FeedbackRow = {
  id: 'written-1-1001-11',
  type: 'written',
  startDate: '2026-05-03',
  startTime: null,
  endTime: null,
  statusLabel: '진행 중',
  statusTone: 'inProgress',
  reservationLabel: null,
  submissionLabel: '제출',
  menteeParticipation: null,
  mentorParticipation: null,
  challengeTitle: '경험정리 챌린지 21기',
  thLabel: '1회차',
  scheduleLabel: '2026.05.03 ~ 2026.05.06',
  menteeNameLabel: '이지수',
  canOpenDetail: true,
  detailDisabledReason: null,
  source: {
    type: 'written',
    challengeId: 1,
    missionId: 1001,
    missionTh: 1,
    challengeTitle: '경험정리 챌린지 21기',
    attendanceId: 11,
  },
};

const renderPage = () =>
  render(
    <MemoryRouter>
      <FeedbackManagementPage />
    </MemoryRouter>,
  );

/** 마지막으로 제출물 모달에 넘어간 applicationId. */
const lastApplicationId = () =>
  submissionModalProps[submissionModalProps.length - 1]?.applicationId ?? null;

beforeEach(() => {
  rows = [];
  liveModalProps.length = 0;
  submissionModalProps.length = 0;
  openWrittenFeedbackModal.mockReset();
});

describe('표에서 1대1 제출물 모달 열기', () => {
  it('처음에는 applicationId 가 null 이라 모달이 조회하지 않는다', () => {
    rows = [liveMentoringRow(91001, '김일대')];
    renderPage();

    expect(lastApplicationId()).toBeNull();
  });

  it('1대1 행의 보기를 누르면 그 행의 applicationId 로 열린다', async () => {
    rows = [
      liveMentoringRow(91001, '김일대'),
      liveMentoringRow(91004, '박멘티'),
    ];
    renderPage();

    const buttons = screen.getAllByRole('button', { name: '보기' });
    await userEvent.click(buttons[1]);

    expect(lastApplicationId()).toBe(91004);
  });

  it('닫으면 applicationId 가 다시 null 이 된다', async () => {
    rows = [liveMentoringRow(91001, '김일대')];
    renderPage();

    await userEvent.click(screen.getByRole('button', { name: '보기' }));
    expect(lastApplicationId()).toBe(91001);

    await userEvent.click(
      screen.getByRole('button', { name: '제출물 모달 닫기' }),
    );
    expect(lastApplicationId()).toBeNull();
  });
});

describe('다른 행은 기존 경로 그대로', () => {
  it('서면 행은 서면 모달을 열고 제출물 모달을 건드리지 않는다', async () => {
    rows = [writtenRow];
    renderPage();

    await userEvent.click(screen.getByRole('button', { name: '보기' }));

    expect(openWrittenFeedbackModal).toHaveBeenCalledTimes(1);
    expect(lastApplicationId()).toBeNull();
  });

  it('1대1 모달이 열려도 라이브 모달은 닫힌 채다', async () => {
    rows = [liveMentoringRow(91001, '김일대')];
    renderPage();

    await userEvent.click(screen.getByRole('button', { name: '보기' }));

    expect(lastApplicationId()).toBe(91001);
    expect(liveModalProps[liveModalProps.length - 1].isOpen).toBe(false);
  });
});
