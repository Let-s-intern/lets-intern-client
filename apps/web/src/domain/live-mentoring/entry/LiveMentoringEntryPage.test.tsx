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
// 멘토가 열람할 때 이 훅을 타면 안 된다 — 질문 조회 API 는 신청자 본인만 통과시킨다.
const questionQuery = jest.fn(() => ({ data: undefined, isLoading: false }));

jest.mock('@/api/live-mentoring/liveMentoring', () => ({
  useLiveMentoringEntryQuery: () => queryState,
  useLiveMentoringQuestionQuery: () => questionQuery(),
  useUpdateLiveMentoringQuestionMutation: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
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
// 제출물 모달이 파일 업로드를 끌어오고, 그 경로가 import.meta 를 쓰는 패키지를 탄다.
// Jest 가 파싱하지 못하므로 QuestionModal.test 와 같은 방식으로 막는다.
jest.mock('@/api/file', () => ({
  __esModule: true,
  uploadFileForId: jest.fn(),
}));

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
// 열려 있을 때만 참가/종료 버튼을 노출한다 — 닫힌 상태에서 버튼을 이름으로 집는
// 테스트가 세션 모달 버튼까지 잡지 않게 하려는 조건이다.
/** 입장 버튼만 집는다. 화면에 제출물 버튼이 함께 있어 role 만으로는 모호하다. */
const enterButton = () =>
  screen.getByRole('button', { name: /라이브 입장하기|종료된 세션|입장까지/ });

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
  questionEditable: true,
  questionEditDeadline: '2026-06-12T10:00:00+09:00',
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
    // 입장 버튼과 제출물 버튼이 함께 있다. 이름으로 집어 서로 섞이지 않게 한다.
    expect(enterButton()).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /제출물|제출 기간/ }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('login-gate')).not.toBeInTheDocument();
  });

  // 알림톡은 세션 며칠 전에도 이 화면으로 보낸다. 그때 눌러야 하는 것은 제출물
  // 버튼이므로 "입장까지 119시간" 같은 문구로 화면을 채우지 않는다.
  it('세션이 한참 남았으면 입장 버튼을 렌더하지 않는다', () => {
    authState = { isInitialized: true, isLoggedIn: true };
    queryState = {
      data: {
        ...entry,
        reservationStartAt: new Date(Date.now() + 5 * 86_400_000).toISOString(),
        reservationEndAt: new Date(
          Date.now() + 5 * 86_400_000 + 1_800_000,
        ).toISOString(),
      },
      isLoading: false,
    };
    render(<LiveMentoringEntryPage applicationId={1} role="MENTEE" />);
    expect(
      screen.queryByRole('button', { name: /입장까지|라이브 입장하기/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '제출물 제출하기' }),
    ).toBeInTheDocument();
  });

  // 마감이 지나면 버튼을 감춘다. 사유는 요약 카드의 "수정 기간 종료" 행이 알려준다.
  it('제출 마감이 지난 멘티에게는 제출물 버튼을 렌더하지 않는다', () => {
    authState = { isInitialized: true, isLoggedIn: true };
    queryState = {
      data: { ...entry, questionEditable: false },
      isLoading: false,
    };
    render(<LiveMentoringEntryPage applicationId={1} role="MENTEE" />);
    expect(
      screen.queryByRole('button', { name: /제출물/ }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('수정 기간 종료')).toBeInTheDocument();
  });

  // 멘토는 수정 주체가 아니므로 마감과 무관하게 열람할 수 있어야 한다.
  it('마감이 지나도 멘토에게는 열람 버튼과 멘티 기준 라벨을 보여준다', () => {
    authState = { isInitialized: true, isLoggedIn: true };
    queryState = {
      data: { ...entry, myRole: 'MENTOR', questionEditable: false },
      isLoading: false,
    };
    render(<LiveMentoringEntryPage applicationId={1} role="MENTOR" />);
    expect(
      screen.getByRole('button', { name: '멘티 제출물 보기' }),
    ).toBeInTheDocument();
    expect(screen.getByText('멘티 제출 기간')).toBeInTheDocument();
  });

  describe('멘토 열람 모달', () => {
    const openAsMentor = async (
      overrides: Record<string, unknown> = {},
    ): Promise<ReturnType<typeof userEvent.setup>> => {
      authState = { isInitialized: true, isLoggedIn: true };
      queryState = {
        data: { ...entry, myRole: 'MENTOR', ...overrides },
        isLoading: false,
      };
      const user = userEvent.setup();
      render(<LiveMentoringEntryPage applicationId={1} role="MENTOR" />);
      await user.click(
        screen.getByRole('button', { name: '멘티 제출물 보기' }),
      );
      return user;
    };

    /*
      멘티용 모달을 읽기 전용으로 돌려쓰면 질문 조회에서 401 이 난다. 화면에는
      "불러오는 중…" 만 남아 원인이 드러나지 않으므로, 훅을 타지 않는 것까지 고정한다.
    */
    it('질문 조회 API 를 부르지 않고 입장 응답만으로 그린다', async () => {
      questionQuery.mockClear();
      await openAsMentor({
        questionContent: '포트폴리오 피드백 부탁드립니다.',
      });

      expect(questionQuery).not.toHaveBeenCalled();
      expect(screen.getByText('박멘티 님의 제출물')).toBeInTheDocument();
      expect(
        screen.getByText('포트폴리오 피드백 부탁드립니다.'),
      ).toBeInTheDocument();
    });

    it('제출물이 없으면 없다고 적는다', async () => {
      await openAsMentor({ questionContent: null, attachmentType: 'NONE' });

      expect(screen.getByText('작성된 질문이 없습니다.')).toBeInTheDocument();
      expect(screen.getByText('첨부한 파일이 없습니다.')).toBeInTheDocument();
    });

    /*
      첨부 주소는 멘티가 적어 낸 값이고 서버는 길이만 본다. 스킴을 거르지 않으면
      `javascript:` 가 클릭 시 이 페이지 origin 에서 실행된다.
    */
    it('javascript: 스킴 첨부는 링크로 내보내지 않는다', async () => {
      await openAsMentor({
        attachmentType: 'URL',
        attachmentUrl: 'javascript:alert(1)',
      });

      expect(screen.queryByRole('link')).not.toBeInTheDocument();
      expect(
        screen.getByText(
          '첨부 주소를 열 수 없습니다. 멘티에게 다시 요청해 주세요.',
        ),
      ).toBeInTheDocument();
    });

    it('http(s) 첨부는 새 탭 링크로 내보낸다', async () => {
      await openAsMentor({
        attachmentType: 'URL',
        attachmentUrl: 'https://letscareer.notion.site/mentee',
      });

      const link = screen.getByRole('link', { name: '첨부 링크 열기' });
      expect(link).toHaveAttribute(
        'href',
        'https://letscareer.notion.site/mentee',
      );
      expect(link).toHaveAttribute('rel', 'noreferrer');
    });

    /*
      첨부가 있는데 url 이 없는 것은 멘티가 공유에 동의하지 않아 서버가 가린 경우다.
      "없음"으로 적으면 내지 않은 것으로 읽혀 멘토가 멘티에게 잘못 문의하게 된다.
    */
    it('공유 미동의로 url 이 가려지면 사유를 구분해 적는다', async () => {
      await openAsMentor({ attachmentType: 'FILE', attachmentUrl: null });

      expect(
        screen.getByText(
          '멘티가 자료 공유에 동의하지 않아 열람할 수 없습니다.',
        ),
      ).toBeInTheDocument();
      expect(
        screen.queryByText('첨부한 파일이 없습니다.'),
      ).not.toBeInTheDocument();
    });
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
      await user.click(enterButton());
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
      await user.click(enterButton());
      await user.click(screen.getByRole('button', { name: '회의참가' }));
      await user.click(screen.getByRole('button', { name: '회의종료' }));

      expect(reviewTitle()).toBeVisible();
    });
  });
});
