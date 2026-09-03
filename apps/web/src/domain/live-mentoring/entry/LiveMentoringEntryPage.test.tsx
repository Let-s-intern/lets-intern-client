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
jest.mock('@/api/live-mentoring/liveMentoring', () => ({
  useLiveMentoringEntryQuery: () => queryState,
  useUpdateLiveMentoringEntryAttendanceMutation: () => ({
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
  }),
  useCreateLiveMentoringEntryMeetingRoomMutation: () => ({
    mutateAsync: jest.fn(),
  }),
}));

// 후기 작성 저장 훅 — 정리 모달(LiveMentoringReviewModal)이 항상 함께 렌더되므로 필요하다.
const createReviewMutate = jest.fn();
jest.mock('@/api/review/review', () => ({
  useCreateLiveMentoringReviewMutation: () => ({
    mutate: createReviewMutate,
    isPending: false,
  }),
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

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoined?: () => void;
  submissionUrl?: string;
}
// 열려 있을 때만 참가/종료 버튼을 노출한다 — 닫힌 상태의 버튼 개수를 세는 기존
// 테스트(getByRole('button'))를 깨지 않기 위한 조건이다.
const sessionModalMock = jest.fn((props: SessionModalProps) =>
  props.isOpen ? (
    <div data-testid="live-mentoring-session-modal">
      <button type="button" onClick={() => props.onJoined?.()}>
        회의참가
      </button>
      <button type="button" onClick={props.onClose}>
        회의종료
      </button>
    </div>
  ) : null,
);
jest.mock('./ui/LiveMentoringSessionModal', () => ({
  __esModule: true,
  default: (props: SessionModalProps) => sessionModalMock(props),
}));

import LiveMentoringEntryPage from './LiveMentoringEntryPage';

const entry = {
  applicationId: 1,
  myRole: 'MENTEE',
  productName: '이력서 라이브 멘토링',
  durationMinutes: 30,
  reservationStartAt: '2026-06-13T10:00:00+09:00',
  reservationEndAt: '2026-06-13T10:30:00+09:00',
  mentorName: '김멘토',
  menteeName: '박멘티',
  questionDeferred: false,
  questionContent: null,
  attachmentType: 'NONE',
  attachmentUrl: null,
  mentorStatus: 'PENDING',
  menteeStatus: 'PENDING',
  meetingUrl: null,
  reviewId: null,
};

describe('LiveMentoringEntryPage', () => {
  it('초기화 전에는 아무것도 렌더하지 않는다', () => {
    authState = { isInitialized: false, isLoggedIn: false };
    const { container } = render(
      <LiveMentoringEntryPage applicationId={1} role="MENTOR" />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('비로그인이면 LoginGate를 렌더한다', () => {
    authState = { isInitialized: true, isLoggedIn: false };
    render(<LiveMentoringEntryPage applicationId={1} role="MENTOR" />);
    expect(screen.getByTestId('login-gate')).toBeInTheDocument();
  });

  it('로그인이면 일정 요약과 입장 버튼을 렌더한다', () => {
    authState = { isInitialized: true, isLoggedIn: true };
    queryState = { data: entry, isLoading: false };
    render(<LiveMentoringEntryPage applicationId={1} role="MENTOR" />);
    expect(screen.getByText('곧 멘토링이 시작돼요')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.queryByTestId('login-gate')).not.toBeInTheDocument();
  });

  // URL 의 role 세그먼트는 알림톡 링크가 준 값이라 사용자가 바꿀 수 있다.
  // 서버가 응답에 실어 준 myRole 이 실제 화면 분기를 결정해야 한다.
  it('URL role 이 mentor 여도 서버 myRole 이 MENTEE 면 멘티 시점으로 그린다', () => {
    authState = { isInitialized: true, isLoggedIn: true };
    queryState = { data: { ...entry, myRole: 'MENTEE' }, isLoading: false };
    render(<LiveMentoringEntryPage applicationId={1} role="MENTOR" />);

    // 멘티 시점이면 상대방 라벨이 "멘토" 이고 이름은 mentorName 이다.
    expect(screen.getByText('멘토')).toBeInTheDocument();
    expect(screen.getByText('김멘토')).toBeInTheDocument();
    expect(screen.queryByText('박멘티')).not.toBeInTheDocument();
  });

  it('서버 myRole 이 MENTOR 면 멘토 시점으로 그린다', () => {
    authState = { isInitialized: true, isLoggedIn: true };
    queryState = { data: { ...entry, myRole: 'MENTOR' }, isLoading: false };
    render(<LiveMentoringEntryPage applicationId={1} role="MENTEE" />);

    expect(screen.getByText('멘티')).toBeInTheDocument();
    expect(screen.getByText('박멘티')).toBeInTheDocument();
  });

  // 첨부는 URL 유형이고 http(s) 로 열 수 있을 때만 자료 패널에 실어 보낸다.
  // href 로 그대로 나가면 javascript: 를 실행시킬 수 있다.
  it('javascript: 스킴 첨부는 모달에 submissionUrl 로 넘기지 않는다', () => {
    authState = { isInitialized: true, isLoggedIn: true };
    queryState = {
      data: {
        ...entry,
        attachmentType: 'URL',
        attachmentUrl: 'javascript:alert(1)',
      },
      isLoading: false,
    };
    render(<LiveMentoringEntryPage applicationId={1} role="MENTOR" />);

    const lastCall =
      sessionModalMock.mock.calls[sessionModalMock.mock.calls.length - 1];
    expect(lastCall?.[0].submissionUrl).toBeUndefined();
  });

  it('https 첨부는 그대로 submissionUrl 로 넘긴다', () => {
    authState = { isInitialized: true, isLoggedIn: true };
    queryState = {
      data: {
        ...entry,
        attachmentType: 'URL',
        attachmentUrl: 'https://letscareer.notion.site/mentee',
      },
      isLoading: false,
    };
    render(<LiveMentoringEntryPage applicationId={1} role="MENTOR" />);

    const lastCall =
      sessionModalMock.mock.calls[sessionModalMock.mock.calls.length - 1];
    expect(lastCall?.[0].submissionUrl).toBe(
      'https://letscareer.notion.site/mentee',
    );
  });

  /**
   * 종료 시 후기 모달 트리거 — PRD §3.3.1~2.
   * 3조건(멘티 본인 · 실제 입장 · 미작성)을 모두 만족할 때만 연다.
   */
  describe('종료 후 후기 모달', () => {
    beforeAll(() => {
      if (!document.getElementById('modal')) {
        const root = document.createElement('div');
        root.id = 'modal';
        document.body.appendChild(root);
      }
    });

    beforeEach(() => {
      createReviewMutate.mockClear();
    });

    const enterSession = async (
      myRole: 'MENTOR' | 'MENTEE',
      overrides?: { reviewId?: number | null },
    ) => {
      authState = { isInitialized: true, isLoggedIn: true };
      queryState = {
        data: {
          ...entry,
          myRole,
          // 입장 게이트가 열려 있도록 시작 +5분 / 종료 +35분.
          reservationStartAt: new Date(Date.now() + 5 * 60_000).toISOString(),
          reservationEndAt: new Date(Date.now() + 35 * 60_000).toISOString(),
          meetingUrl: 'https://meet.jit.si/letscareer-room',
          reviewId: overrides?.reviewId ?? null,
        },
        isLoading: false,
      };

      const user = userEvent.setup();
      render(<LiveMentoringEntryPage applicationId={1} role={myRole} />);
      await user.click(screen.getByRole('button'));
      return user;
    };

    const reviewTitle = () =>
      screen.queryByText('이력서 라이브 멘토링 멘토링, 어떠셨나요?');

    it('멘티가 참가 후 종료하면 후기 모달이 열린다', async () => {
      const user = await enterSession('MENTEE');

      await user.click(screen.getByRole('button', { name: '회의참가' }));
      await user.click(screen.getByRole('button', { name: '회의종료' }));

      expect(reviewTitle()).toBeVisible();
    });

    it('멘토에게는 후기 모달을 띄우지 않는다', async () => {
      const user = await enterSession('MENTOR');

      await user.click(screen.getByRole('button', { name: '회의참가' }));
      await user.click(screen.getByRole('button', { name: '회의종료' }));

      expect(reviewTitle()).not.toBeInTheDocument();
    });

    it('멘티라도 참가하지 못한 채 나가면 열리지 않는다', async () => {
      const user = await enterSession('MENTEE');

      await user.click(screen.getByRole('button', { name: '회의종료' }));

      expect(reviewTitle()).not.toBeInTheDocument();
    });

    it('이미 후기를 썼으면(reviewId 있음) 열리지 않는다', async () => {
      const user = await enterSession('MENTEE', { reviewId: 501 });

      await user.click(screen.getByRole('button', { name: '회의참가' }));
      await user.click(screen.getByRole('button', { name: '회의종료' }));

      expect(reviewTitle()).not.toBeInTheDocument();
    });

    it('재입장 시에도 매번 재평가한다 — 후기를 안 썼다면 다시 뜬다', async () => {
      const user = await enterSession('MENTEE');

      await user.click(screen.getByRole('button', { name: '회의참가' }));
      await user.click(screen.getByRole('button', { name: '회의종료' }));
      expect(reviewTitle()).toBeVisible();

      // 저장하지 않고 닫는다 — 다시 들어갔다 나가도 여전히 미작성 상태.
      await user.click(screen.getByRole('button', { name: '나중에 쓸게요' }));
      expect(reviewTitle()).not.toBeInTheDocument();

      // 세션·정리 모달이 모두 닫힌 시점 — 남은 유일한 버튼은 재입장 버튼이다.
      await user.click(screen.getByRole('button'));
      await user.click(screen.getByRole('button', { name: '회의참가' }));
      await user.click(screen.getByRole('button', { name: '회의종료' }));

      expect(reviewTitle()).toBeVisible();
    });
  });
});
