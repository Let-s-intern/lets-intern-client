/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';

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
}));

jest.mock('./ui/LoginGate', () => ({
  __esModule: true,
  default: () => <div data-testid="login-gate" />,
}));
jest.mock('./ui/LiveFeedbackModal', () => ({
  __esModule: true,
  default: () => <div data-testid="live-feedback-modal" />,
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
});
