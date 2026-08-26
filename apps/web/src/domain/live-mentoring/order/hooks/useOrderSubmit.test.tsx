/**
 * @jest-environment jsdom
 */
import { act, renderHook, waitFor } from '@testing-library/react';

import { useCreateLiveMentoringApplicationMutation } from '@/api/live-mentoring/liveMentoring';
import {
  useOrderDraftStore,
  type LiveMentoringOrderDraft,
} from './useOrderDraft';
import { useOrderSubmit } from './useOrderSubmit';
import { EMPTY_QUESTION, type QuestionInput } from '../types';

/*
  서버가 `deferred: false` 인데 본문이 비면 LIVE_MENTORING_INVALID_QUESTION 을 준다.
  기본값(`EMPTY_QUESTION`)이 바로 그 상태라, 제출이 되는 케이스는 나중에 작성하기로 둔다.
*/
const DEFERRED_QUESTION: QuestionInput = { ...EMPTY_QUESTION, deferred: true };

const push = jest.fn();
jest.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

const mutate = jest.fn();
jest.mock('@/api/live-mentoring/liveMentoring', () => ({
  __esModule: true,
  useCreateLiveMentoringApplicationMutation: jest.fn(),
}));

const useCreateMock = useCreateLiveMentoringApplicationMutation as jest.Mock;

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

const CREATED = {
  applicationId: 15,
  product: {
    durationPriceId: 5,
    name: '어드민 1대1 라이브 멘토링',
    durationMinutes: 60,
  },
  reservation: {
    slotIds: [158, 159],
    startAt: '2026-09-19T12:00:00',
    endAt: '2026-09-19T13:00:00',
    applicationStatus: 'PAYMENT_PENDING' as const,
    expiresAt: '2026-08-21T16:23:16.283507',
  },
  mentoringTypes: [{ mentoringTypeId: 1, name: '자기소개서' }],
  payment: {
    originalPrice: 60000,
    productDiscount: 0,
    couponDiscount: 10000,
    finalAmount: 50000,
    orderId: 'gKEMQwWav2Lh',
    currency: 'KRW',
  },
};

function setup(
  overrides: {
    draft?: Partial<LiveMentoringOrderDraft>;
    contactEmail?: string;
    question?: QuestionInput;
    couponCode?: string | null;
  } = {},
) {
  return renderHook(() =>
    useOrderSubmit({
      draft: { ...DRAFT, ...overrides.draft },
      contactEmail: overrides.contactEmail ?? 'local-admin@letscareer.test',
      question: overrides.question ?? DEFERRED_QUESTION,
      couponCode: overrides.couponCode ?? null,
      customerName: '로컬어드민',
      customerMobilePhone: '010-0000-0000',
    }),
  );
}

beforeEach(() => {
  push.mockClear();
  mutate.mockReset();
  useOrderDraftStore.getState().clearDraft();
  useCreateMock.mockReturnValue({ mutate, isPending: false });
});

describe('useOrderSubmit — 제출 가능 조건', () => {
  it('필수가 다 차면 제출할 수 있다', () => {
    const { result } = setup();
    expect(result.current.canSubmit).toBe(true);
  });

  it('이메일 형식이 아니면 제출을 막는다', () => {
    const { result } = setup({ contactEmail: 'not-an-email' });
    expect(result.current.isEmailValid).toBe(false);
    expect(result.current.canSubmit).toBe(false);

    act(() => result.current.submit());
    expect(mutate).not.toHaveBeenCalled();
  });

  /*
    서버 `validateQuestion` 이 `deferred: false` + 빈 본문을 거절한다. 여기서 못
    막으면 결제하기를 누른 뒤 LIVE_MENTORING_INVALID_QUESTION 400 만 돌아온다.
  */
  it('작성하기로 두고 질문이 비면 제출을 막는다', () => {
    const { result } = setup({ question: EMPTY_QUESTION });

    expect(result.current.questionError).toMatch(/작성하거나/);
    expect(result.current.canSubmit).toBe(false);

    act(() => result.current.submit());
    expect(mutate).not.toHaveBeenCalled();
  });

  it('첨부를 골랐는데 전달 동의가 없으면 제출을 막는다', () => {
    const { result } = setup({
      question: {
        deferred: false,
        content: '질문',
        attachmentType: 'FILE',
        fileId: 9001,
        url: '',
        mentorShareAgreed: false,
      },
    });

    expect(result.current.questionError).toMatch(/동의/);
    expect(result.current.canSubmit).toBe(false);
  });

  /*
    durationPriceId 는 서버가 `ebb03a66` 으로 공개 상세에 추가했다. 이 값을 아직
    안 주는 서버에 붙었을 때 눌러 보고 400 을 받게 두지 않는다.
  */
  it('durationPriceId 를 못 받았으면 제출을 막는다', () => {
    const { result } = setup({ draft: { durationPriceId: null } });

    expect(result.current.isContractReady).toBe(false);
    expect(result.current.canSubmit).toBe(false);

    act(() => result.current.submit());
    expect(mutate).not.toHaveBeenCalled();
  });
});

describe('useOrderSubmit — 신청 생성', () => {
  it('선택값과 질문·쿠폰을 서버 계약대로 실어 보낸다', () => {
    const { result } = setup({
      couponCode: 'LETS-1234',
      question: {
        deferred: false,
        content: '이력서 피드백 부탁드립니다',
        attachmentType: 'URL',
        fileId: null,
        url: 'https://example.test/resume',
        mentorShareAgreed: true,
      },
    });

    act(() => result.current.submit());

    expect(mutate.mock.calls[0][0]).toEqual({
      durationPriceId: 5,
      slotIds: [158, 159],
      mentoringCategory: 'PERSONAL_STATEMENT',
      reservationChangeAgreed: true,
      contactEmail: 'local-admin@letscareer.test',
      question: {
        deferred: false,
        content: '이력서 피드백 부탁드립니다',
        attachmentType: 'URL',
        fileId: null,
        url: 'https://example.test/resume',
        mentorShareAgreed: true,
      },
      couponCode: 'LETS-1234',
    });
  });

  /* 첨부가 URL 이면 fileId 를, 파일이면 url 을 보내지 않는다. */
  it('고르지 않은 첨부 값은 실어 보내지 않는다', () => {
    const { result } = setup({
      question: {
        deferred: false,
        content: '질문',
        attachmentType: 'FILE',
        fileId: 9001,
        url: 'https://leftover.test',
        mentorShareAgreed: true,
      },
    });

    act(() => result.current.submit());

    const question = mutate.mock.calls[0][0].question;
    expect(question.fileId).toBe(9001);
    expect(question.url).toBeNull();
  });

  it('성공하면 서버가 계산한 금액으로 결제 위젯에 넘긴다', async () => {
    mutate.mockImplementation((_body, options) => options.onSuccess(CREATED));
    const { result } = setup();

    act(() => result.current.submit());

    await waitFor(() =>
      expect(push).toHaveBeenCalledWith('/live-mentoring/order/payment'),
    );

    const application = useOrderDraftStore.getState().application;
    // 쿠폰까지 계산한 서버 금액을 그대로 쓴다. 화면에서 다시 계산하면 결제창 금액과
    // 서버 승인 금액이 어긋나 승인이 실패한다.
    expect(application).toMatchObject({
      applicationId: 15,
      orderId: 'gKEMQwWav2Lh',
      finalAmount: 50000,
      customerMobilePhone: '01000000000',
      expiresAt: '2026-08-21T16:23:16.283507',
    });
  });

  /*
    100% 쿠폰이면 결제할 것이 없다. 서버도 `finalAmount > 0` 일 때만 Toss 를 부르므로
    위젯을 띄우면 0원 결제 요청이 되어 실패한다.
  */
  it('0원이면 결제 위젯을 건너뛰고 승인으로 바로 보낸다', async () => {
    mutate.mockImplementation((_body, options) =>
      options.onSuccess({
        ...CREATED,
        payment: { ...CREATED.payment, finalAmount: 0 },
      }),
    );
    const { result } = setup();

    act(() => result.current.submit());

    await waitFor(() =>
      expect(push).toHaveBeenCalledWith(
        '/live-mentoring/order/result?orderId=gKEMQwWav2Lh&amount=0',
      ),
    );
    expect(push).not.toHaveBeenCalledWith('/live-mentoring/order/payment');
  });
});

describe('useOrderSubmit — 실패 처리', () => {
  /*
    안 A 의 알려진 대가다. 폼을 쓰는 사이 다른 사람이 같은 슬롯을 가져갈 수 있다.
  */
  it('슬롯 경합이면 일정을 다시 고르도록 안내한다', async () => {
    mutate.mockImplementation((_body, options) =>
      /*
        axios 인터셉터가 ApiError 로 바꿔서 던진다. `response` 가 없고 code·
        serverMessage 가 최상위에 있다 — 목도 실제 형태를 따라야 분기를 검증한다.
      */
      options.onError(
        Object.assign(
          new Error('선택한 라이브 멘토링 슬롯을 예약할 수 없습니다.'),
          {
            code: 'LIVE_MENTORING_SLOT_UNAVAILABLE',
            status: 409,
            serverMessage: '선택한 라이브 멘토링 슬롯을 예약할 수 없습니다.',
          },
        ),
      ),
    );
    const { result } = setup();

    act(() => result.current.submit());

    await waitFor(() => expect(result.current.isSlotConflict).toBe(true));
    expect(result.current.errorMessage).toBe(
      '선택한 라이브 멘토링 슬롯을 예약할 수 없습니다.',
    );
    expect(push).not.toHaveBeenCalled();

    /*
      일정을 다시 고르면 에러만 지운다. 예전에는 상세 페이지로 돌려보냈는데,
      바뀐 것은 일정 하나뿐인데 이메일·질문·쿠폰까지 다시 쓰게 됐다.
    */
    act(() => result.current.clearError());
    expect(result.current.isSlotConflict).toBe(false);
    expect(result.current.errorMessage).toBeNull();
    expect(push).not.toHaveBeenCalled();
  });

  it('그 밖의 실패는 서버 문구만 보여주고 일정 재선택을 권하지 않는다', async () => {
    mutate.mockImplementation((_body, options) =>
      options.onError(
        Object.assign(new Error('서버 내부 오류입니다.'), {
          code: 'UNKNOWN',
          status: 500,
          serverMessage: '서버 내부 오류입니다.',
        }),
      ),
    );
    const { result } = setup();

    act(() => result.current.submit());

    await waitFor(() =>
      expect(result.current.errorMessage).toBe('서버 내부 오류입니다.'),
    );
    expect(result.current.isSlotConflict).toBe(false);
  });

  it('응답에 문구가 없어도 빈 화면을 남기지 않는다', async () => {
    // 인터셉터를 타지 못한 네트워크 오류. 서버 문구가 없다.
    mutate.mockImplementation((_body, options) =>
      options.onError(
        Object.assign(new Error('서버 오류가 발생했습니다.'), {
          code: 'API_ERROR',
        }),
      ),
    );
    const { result } = setup();

    act(() => result.current.submit());

    await waitFor(() =>
      expect(result.current.errorMessage).toBe(
        '신청을 만들지 못했습니다. 잠시 후 다시 시도해 주세요.',
      ),
    );
  });
});
