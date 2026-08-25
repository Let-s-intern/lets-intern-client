import { render, screen, waitFor } from '@testing-library/react';

import OrderPage from './OrderPage';
import {
  useOrderDraftStore,
  type LiveMentoringOrderDraft,
} from './hooks/useOrderDraft';

const replace = jest.fn();
const back = jest.fn();
const push = jest.fn();

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
  mentoringTypeIds: [1],
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
