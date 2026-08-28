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

jest.mock('./hooks/useLiveMentoringEntry', () => ({
  useLiveMentoringEntry: () => ({
    isOpen: false,
    isPreparing: false,
    enter: jest.fn(),
    closeJitsi: jest.fn(),
    baseCandidates: [],
    registerBaseUrl: jest.fn(),
  }),
}));

jest.mock('./ui/LoginGate', () => ({
  __esModule: true,
  default: () => <div data-testid="login-gate" />,
}));
interface SessionModalProps {
  submissionUrl?: string;
}
const sessionModalMock = jest.fn((_props: SessionModalProps) => (
  <div data-testid="live-mentoring-session-modal" />
));
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

  // 첨부 주소는 멘티가 직접 적어 낸 값이라 href 로 그대로 나가면 javascript: 를
  // 실행시킬 수 있다. 모달로 넘기기 전에 걸러야 한다.
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
});
