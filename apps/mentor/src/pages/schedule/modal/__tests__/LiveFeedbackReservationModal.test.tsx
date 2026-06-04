import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { PeriodBarData } from '../../types';
import LiveFeedbackReservationModal from '../LiveFeedbackReservationModal';

// --- 외부 의존성 목 ---

// 헬스체크: 기본은 성공(ok). 테스트별로 mockResolvedValueOnce 로 덮어쓴다.
const ensureLiveMeetingUrlMock = vi.fn();
vi.mock('@letscareer/ui/JitsiEmbed/jitsiHealthCheck', () => ({
  ensureLiveMeetingUrl: (...args: unknown[]) =>
    ensureLiveMeetingUrlMock(...args),
}));

// Jitsi 모달: 열림 여부만 노출 (실제 SDK 로드 차단).
vi.mock('../JitsiEmbedModal', () => ({
  default: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="jitsi-modal" /> : null,
}));

// 멘티 참여 확인 모달: 입장 플로우와 무관하므로 비활성 스텁.
vi.mock('@/pages/feedback/ui/MenteeAttendanceCheckModal', () => ({
  default: () => null,
}));

// API 훅 목 — 모듈 단위로 제어.
const feedbackDetailMock = vi.fn();
const updateFeedbackByMentorMock = vi.fn();
const updateMeetingUrlMock = vi.fn();

vi.mock('@/api/feedback/feedback', () => ({
  useFeedbackMentorDetailQuery: () => ({ data: feedbackDetailMock() }),
  useFeedbackMentorListQuery: () => ({ data: [] }),
  useUpdateFeedbackByMentorMutation: () => ({
    mutate: updateFeedbackByMentorMock,
    isPending: false,
  }),
  useUpdateFeedbackMeetingUrlMutation: () => ({
    mutateAsync: updateMeetingUrlMock,
  }),
}));

const FEEDBACK_ID = 7;

// 입장 게이트('during')를 위해 현재 시각을 감싸는 시간 창을 만든다.
function makeWindow() {
  const now = Date.now();
  const startDate = new Date(now - 5 * 60 * 1000).toISOString();
  const endDate = new Date(now + 25 * 60 * 1000).toISOString();
  return { startDate, endDate };
}

function makeBar(): PeriodBarData {
  const { startDate } = makeWindow();
  const dateOnly = startDate.slice(0, 10);
  return {
    barType: 'live-feedback',
    challengeId: 1,
    missionId: 1,
    challengeTitle: '자소서 챌린지 7기',
    th: 1,
    startDate: dateOnly,
    endDate: dateOnly,
    feedbackStartDate: dateOnly,
    feedbackDeadline: dateOnly,
    submittedCount: 0,
    notSubmittedCount: 0,
    waitingCount: 0,
    inProgressCount: 0,
    completedCount: 0,
    liveFeedback: {
      id: FEEDBACK_ID,
      menteeName: '이지수',
      startTime: '10:00',
      endTime: '10:30',
    },
  };
}

function makeDetail(overrides: Record<string, unknown> = {}) {
  const { startDate, endDate } = makeWindow();
  return {
    feedbackId: FEEDBACK_ID,
    startDate,
    endDate,
    meetingUrl: null,
    status: 'RESERVED',
    programTitle: '자소서 챌린지 7기',
    attendanceUrl: '',
    attendanceStatus: 'PRESENT',
    menteeName: '이지수',
    menteeWishField: null,
    menteeWishIndustry: null,
    menteeWishCompany: null,
    preQuestion: null,
    mentorStatus: 'PENDING',
    menteeStatus: 'PENDING',
    ...overrides,
  };
}

function renderModal() {
  const bar = makeBar();
  return render(
    <LiveFeedbackReservationModal
      isOpen
      onClose={() => {}}
      bar={bar}
      liveFeedbackBars={[bar]}
      onSelectBar={() => {}}
    />,
  );
}

beforeEach(() => {
  ensureLiveMeetingUrlMock.mockReset();
  updateFeedbackByMentorMock.mockReset();
  updateMeetingUrlMock.mockReset();
  feedbackDetailMock.mockReset();
  // 기본: 헬스체크 성공.
  ensureLiveMeetingUrlMock.mockResolvedValue({ ok: true });
  updateMeetingUrlMock.mockResolvedValue(undefined);
  feedbackDetailMock.mockReturnValue(makeDetail());
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.clearAllMocks();
});

async function clickEnterLive() {
  const enterButton = await screen.findByRole('button', {
    name: '라이브 입장하기',
  });
  fireEvent.click(enterButton);
}

describe('LiveFeedbackReservationModal — 멘토 라이브 입장 자동 출석', () => {
  it('① 입장 성공 시 mentorStatus=PRESENT PATCH 가 발생한다', async () => {
    renderModal();
    await clickEnterLive();

    await waitFor(() =>
      expect(updateFeedbackByMentorMock).toHaveBeenCalledWith(
        { feedbackId: FEEDBACK_ID, mentorStatus: 'PRESENT' },
        expect.any(Object),
      ),
    );
    // Jitsi 모달이 열려야 한다.
    expect(screen.getByTestId('jitsi-modal')).toBeInTheDocument();
  });

  it('② 상세 모달만 열고 입장하지 않으면 PATCH 가 발생하지 않는다', async () => {
    renderModal();
    // 입장 버튼을 누르지 않는다.
    await screen.findByRole('button', { name: '라이브 입장하기' });

    expect(updateFeedbackByMentorMock).not.toHaveBeenCalled();
    expect(screen.queryByTestId('jitsi-modal')).not.toBeInTheDocument();
  });

  it('③ 이미 PRESENT 상태면 재입장 시 PATCH 를 생략한다', async () => {
    feedbackDetailMock.mockReturnValue(makeDetail({ mentorStatus: 'PRESENT' }));
    renderModal();
    await clickEnterLive();

    // 입장(Jitsi 오픈)은 되지만 출석 PATCH 는 생략.
    await waitFor(() =>
      expect(screen.getByTestId('jitsi-modal')).toBeInTheDocument(),
    );
    expect(updateFeedbackByMentorMock).not.toHaveBeenCalled();
  });

  it('④ PATCH 가 실패해도 Jitsi 모달은 열려 있고 로깅만 한다', async () => {
    // mutate 가 onError 콜백을 호출하도록 시뮬레이션.
    updateFeedbackByMentorMock.mockImplementation((_vars, options) => {
      options?.onError?.(new Error('network'));
    });
    renderModal();
    await clickEnterLive();

    await waitFor(() =>
      expect(screen.getByTestId('jitsi-modal')).toBeInTheDocument(),
    );
    expect(updateFeedbackByMentorMock).toHaveBeenCalledWith(
      { feedbackId: FEEDBACK_ID, mentorStatus: 'PRESENT' },
      expect.any(Object),
    );
    expect(console.error).toHaveBeenCalled();
  });
});
