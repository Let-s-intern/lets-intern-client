/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

interface AuthState {
  isInitialized: boolean;
  isLoggedIn: boolean;
}
let authState: AuthState = { isInitialized: true, isLoggedIn: true };
jest.mock('@letscareer/store', () => ({
  useAuthStore: (selector: (s: AuthState) => unknown) => selector(authState),
}));

let queryState: { data: unknown; isLoading: boolean } = {
  data: null,
  isLoading: false,
};
jest.mock('@/api/feedback/feedback', () => ({
  useLiveFeedbackEntryQuery: () => queryState,
  usePatchFeedbackMeetingUrl: () => ({ mutateAsync: jest.fn() }),
  usePatchMentorFeedbackStatus: () => ({
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
  }),
  // 종료 후 정리 모달(LiveFeedbackReviewModal)이 함께 렌더되므로 저장 훅도 필요하다.
  usePatchFeedbackReview: () => ({ mutate: jest.fn(), isPending: false }),
}));

// 입장 준비(헬스체크·회의실 등록)를 즉시 성공으로 고정 — 네트워크 의존 제거.
jest.mock('@letscareer/live-session/JitsiEmbed/jitsiHealthCheck', () => ({
  __esModule: true,
  ensureLiveMeetingUrl: jest.fn().mockResolvedValue({ ok: true }),
}));

jest.mock('./ui/LoginGate', () => ({
  __esModule: true,
  default: () => <div data-testid="login-gate" />,
}));
jest.mock('./ui/LiveFeedbackModal', () => ({
  __esModule: true,
  // 열려 있을 때만 참가/종료 버튼을 노출한다 — 닫힌 상태의 버튼 개수를 세는
  // 기존 테스트(getByRole('button'))를 깨지 않기 위한 조건이다.
  default: ({
    isOpen,
    onClose,
    onJoined,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onJoined?: () => void;
  }) =>
    isOpen ? (
      <div data-testid="live-feedback-modal">
        <button type="button" onClick={() => onJoined?.()}>
          회의참가
        </button>
        <button type="button" onClick={onClose}>
          회의종료
        </button>
      </div>
    ) : null,
}));

import LiveFeedbackEntryPage from './LiveFeedbackEntryPage';

describe('LiveFeedbackEntryPage', () => {
  it('초기화 전에는 아무것도 렌더하지 않는다', () => {
    authState = { isInitialized: false, isLoggedIn: false };
    const { container } = render(
      <LiveFeedbackEntryPage feedbackId={1} role="MENTOR" />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('비로그인이면 LoginGate를 렌더한다', () => {
    authState = { isInitialized: true, isLoggedIn: false };
    render(<LiveFeedbackEntryPage feedbackId={1} role="MENTOR" />);
    expect(screen.getByTestId('login-gate')).toBeInTheDocument();
  });

  it('로그인이면 일정 요약과 입장 버튼을 렌더한다', () => {
    authState = { isInitialized: true, isLoggedIn: true };
    queryState = {
      data: {
        feedbackInfo: {
          feedbackId: 1,
          startDate: '2026-06-13T10:00:00+09:00',
          endDate: '2026-06-13T11:00:00+09:00',
          meetingUrl: null,
          status: 'RESERVED',
          mentorStatus: 'PENDING',
          menteeStatus: 'PENDING',
          score: null,
          review: null,
        },
      },
      isLoading: false,
    };
    render(<LiveFeedbackEntryPage feedbackId={1} role="MENTOR" />);
    expect(screen.getByText('곧 피드백이 시작돼요')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.queryByTestId('login-gate')).not.toBeInTheDocument();
  });

  /**
   * 알림톡 딥링크 경로의 정리 모달 — 작성 권한이 멘티 본인에게만 있으므로
   * 멘토 역할로 들어온 화면에서는 띄우지 않는다.
   */
  describe('종료 후 정리 모달', () => {
    beforeAll(() => {
      if (!document.getElementById('modal')) {
        const root = document.createElement('div');
        root.id = 'modal';
        document.body.appendChild(root);
      }
    });

    const enterSession = async (
      role: 'MENTOR' | 'MENTEE',
      overrides?: { score?: number | null; review?: string | null },
    ) => {
      authState = { isInitialized: true, isLoggedIn: true };
      queryState = {
        data: {
          feedbackInfo: {
            feedbackId: 1,
            // 입장 게이트가 열려 있도록 시작 +5분 / 종료 +35분.
            startDate: new Date(Date.now() + 5 * 60_000).toISOString(),
            endDate: new Date(Date.now() + 35 * 60_000).toISOString(),
            meetingUrl: 'https://meet.jit.si/letscareer-room',
            status: 'RESERVED',
            mentorStatus: 'PENDING',
            menteeStatus: 'PENDING',
            score: overrides?.score ?? null,
            review: overrides?.review ?? null,
            mentorName: '김멘토',
          },
        },
        isLoading: false,
      };

      const user = userEvent.setup();
      render(<LiveFeedbackEntryPage feedbackId={1} role={role} />);
      await user.click(screen.getByRole('button'));
      return user;
    };

    const reviewTitle = () =>
      screen.queryByText('오늘 멘토링, 무엇을 얻으셨나요?');

    it('멘티가 참가 후 종료하면 정리 모달이 열린다', async () => {
      const user = await enterSession('MENTEE');

      await user.click(screen.getByRole('button', { name: '회의참가' }));
      await user.click(screen.getByRole('button', { name: '회의종료' }));

      expect(reviewTitle()).toBeVisible();
    });

    it('멘토에게는 정리 모달을 띄우지 않는다', async () => {
      const user = await enterSession('MENTOR');

      await user.click(screen.getByRole('button', { name: '회의참가' }));
      await user.click(screen.getByRole('button', { name: '회의종료' }));

      expect(reviewTitle()).not.toBeInTheDocument();
    });

    it('멘티라도 참가하지 못한 채 닫으면 열리지 않는다', async () => {
      const user = await enterSession('MENTEE');

      await user.click(screen.getByRole('button', { name: '회의종료' }));

      expect(reviewTitle()).not.toBeInTheDocument();
    });
  });
});
