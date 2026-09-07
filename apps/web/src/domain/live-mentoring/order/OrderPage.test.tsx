import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

import OrderPage from './OrderPage';
import {
  useOrderDraftStore,
  type LiveMentoringOrderDraft,
} from './hooks/useOrderDraft';

const replace = jest.fn();
const back = jest.fn();
const push = jest.fn();

interface AuthState {
  isInitialized: boolean;
  isLoggedIn: boolean;
}
let authState: AuthState = { isInitialized: true, isLoggedIn: true };
jest.mock('@letscareer/store', () => ({
  useAuthStore: (selector: (s: AuthState) => unknown) => selector(authState),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace, back, push }),
}));

/*
  `useUserQuery` 는 axios 를 거쳐 `packages/api/src/env.ts` 의 `import.meta` 를
  끌어와 jest 가 파싱하지 못한다. 이 테스트가 보는 것은 진입 가드라 사용자 조회는
  목으로 막는다 — 폼 동작 자체는 `ApplicantFormSection.test.tsx` 가 본다.
*/
/* 신청 생성 훅도 axios 를 거친다. 이 테스트는 진입 가드만 본다. */
jest.mock('@/api/live-mentoring/liveMentoring', () => ({
  __esModule: true,
  useCreateLiveMentoringApplicationMutation: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
}));

/* 질문 블록의 파일 업로드도 같은 이유(axios → import.meta)로 막는다. */
jest.mock('@/api/file', () => ({
  __esModule: true,
  uploadFileForId: jest.fn(),
}));

jest.mock('@/api/user/user', () => ({
  useUserQuery: () => ({
    data: {
      name: '김렛츠',
      phoneNum: '010-2020-2020',
      email: 'local-admin@letscareer.test',
    },
  }),
}));

const DRAFT: LiveMentoringOrderDraft = {
  mentorId: 1,
  openingId: 6,
  productName: '어드민 1대1 라이브 멘토링',
  thumbnail: null,
  duration: 60,
  durationPriceId: 5,
  price: 60000,
  slots: [
    {
      slotId: 158,
      date: '2026-09-19',
      time: '12:00',
      startDate: '2026-09-19T12:00:00',
      endDate: '2026-09-19T12:30:00',
    },
    {
      slotId: 159,
      date: '2026-09-19',
      time: '12:30',
      startDate: '2026-09-19T12:30:00',
      endDate: '2026-09-19T13:00:00',
    },
  ],
  mentoringCategory: 'PERSONAL_STATEMENT',
  reservationChangeAgreed: true,
};

beforeEach(() => {
  replace.mockClear();
  back.mockClear();
  push.mockClear();
  useOrderDraftStore.getState().clearDraft();
});

describe('OrderPage 진입 가드', () => {
  /*
    선택값은 메모리에만 있다. 새로고침하면 사라지는데, 서버에 신청 상세 조회 API 가
    없어(PRD 7-5) 복구할 방법이 없다. 빈 화면에 결제 버튼만 남기면 눌렀을 때
    무슨 일이 날지 알 수 없으므로 되돌려보낸다.
  */
  /*
    상세의 신청 버튼이 이미 비회원을 막지만 그것만으로는 새는 곳이 남는다 —
    로그아웃해도 선택값은 남아 있어서, 그 상태로 이 주소에 닿으면 결제 화면까지
    들어온다.
  */
  describe('비회원', () => {
    afterEach(() => {
      authState = { isInitialized: true, isLoggedIn: true };
    });

    it('선택값이 남아 있어도 로그인으로 보낸다', async () => {
      authState = { isInitialized: true, isLoggedIn: false };
      useOrderDraftStore.getState().setDraft(DRAFT);
      render(<OrderPage mentorId="1" />);

      await waitFor(() => expect(replace).toHaveBeenCalledTimes(1));
      expect(replace.mock.calls[0][0]).toContain('/login?redirect=');
      // 결제 화면을 잠깐이라도 그리지 않는다.
      expect(screen.queryByRole('button', { name: /결제/ })).toBeNull();
    });

    it('스토어 초기화 전에는 아직 보내지 않는다', () => {
      authState = { isInitialized: false, isLoggedIn: false };
      useOrderDraftStore.getState().setDraft(DRAFT);
      render(<OrderPage mentorId="1" />);

      // 초기화 전 판정하면 로그인 사용자도 한 번 튕긴다.
      expect(replace).not.toHaveBeenCalled();
    });
  });

  it('선택값이 없으면 그 멘토의 상세로 되돌려보낸다', async () => {
    render(<OrderPage mentorId="1" />);

    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith('/live-mentoring/1'),
    );
  });

  /* 주소창에 직접 친 경우 — 어느 상세로 보낼지 알 수 없어 목록으로 보낸다. */
  it('멘토 id 도 없으면 목록으로 되돌려보낸다', async () => {
    render(<OrderPage mentorId={null} />);

    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith('/live-mentoring'),
    );
  });

  it('선택값이 있으면 되돌려보내지 않고 결제 화면을 그린다', async () => {
    useOrderDraftStore.getState().setDraft(DRAFT);
    render(<OrderPage mentorId="1" />);

    expect(
      await screen.findByRole('heading', { name: '결제하기' }),
    ).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  /*
    시안 `2-0` 상단의 "마감까지 3일 23시간 58분 58초" 배너는 그리지 않는다.
    개설에 모집 마감일 개념이 없고 10분 선점 만료는 자릿수가 맞지 않는다 (PRD 7-7).
    빠져 있는 것이 의도임을 못박는다.
  */
  it('근거 없는 마감 카운트다운 배너를 그리지 않는다', () => {
    useOrderDraftStore.getState().setDraft(DRAFT);
    render(<OrderPage mentorId="1" />);

    expect(screen.queryByText(/마감까지/)).not.toBeInTheDocument();
    expect(screen.queryByText(/남았어요/)).not.toBeInTheDocument();
  });
});

/*
  LC-3272 회귀 테스트.

  「나중에 작성하기」를 켜 둔 채 이 화면에서 일정을 48시간 안으로 바꾸면, 체크박스는
  잠기지만 선택은 켜진 채로 남아 질문 작성 폼이 열리지 않았다. 지금 써야 한다는 안내만
  뜨고 정작 쓸 칸이 없는 상태다.
*/
describe('OrderPage — 일정을 48시간 안으로 바꿨을 때', () => {
  /** 지금부터 `hours` 뒤에 시작하는 슬롯 하나짜리 선택값. */
  const draftStartingIn = (hours: number): LiveMentoringOrderDraft => {
    const start = new Date(Date.now() + hours * 60 * 60 * 1000);
    const iso = start.toISOString().slice(0, 19);
    return {
      ...DRAFT,
      slots: [
        {
          slotId: 900,
          date: iso.slice(0, 10),
          time: iso.slice(11, 16),
          startDate: iso,
          endDate: iso,
        },
      ],
    };
  };

  const laterCheckbox = () =>
    screen.getByRole('checkbox', { name: '나중에 작성하기' });

  it('나중에 작성하기 선택이 풀리고 질문 작성 폼이 열린다', async () => {
    // 열흘 뒤 — 나중에 낼 수 있다.
    useOrderDraftStore.getState().setDraft(draftStartingIn(240));
    render(<OrderPage mentorId="1" />);

    await screen.findByRole('heading', { name: '결제하기' });
    fireEvent.click(laterCheckbox());
    expect(laterCheckbox()).toBeChecked();
    expect(screen.queryByLabelText('멘토링 질문 작성')).toBeNull();

    // 결제 페이지에서 일정을 3시간 뒤로 바꾼다.
    act(() => {
      useOrderDraftStore.getState().setDraft(draftStartingIn(3));
    });

    expect(screen.getByText(/48시간이 남지 않아/)).toBeInTheDocument();
    expect(laterCheckbox()).not.toBeChecked();
    expect(screen.getByLabelText('멘토링 질문 작성')).toBeInTheDocument();
  });

  it('48시간 밖으로 되돌리면 다시 나중에 낼 수 있다', async () => {
    useOrderDraftStore.getState().setDraft(draftStartingIn(3));
    render(<OrderPage mentorId="1" />);

    await screen.findByRole('heading', { name: '결제하기' });
    expect(laterCheckbox()).toBeDisabled();

    act(() => {
      useOrderDraftStore.getState().setDraft(draftStartingIn(240));
    });

    expect(laterCheckbox()).toBeEnabled();
    expect(screen.queryByText(/48시간이 남지 않아/)).toBeNull();
  });
});
