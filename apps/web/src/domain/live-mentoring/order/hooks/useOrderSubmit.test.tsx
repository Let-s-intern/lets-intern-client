/**
 * @jest-environment jsdom
 */
import { act, renderHook, waitFor } from '@testing-library/react';

import { useCreateLiveMentoringApplicationMutation } from '@/api/live-mentoring/liveMentoring';
import { useOrderDraftStore, type LiveMentoringOrderDraft } from './useOrderDraft';
import { useOrderSubmit } from './useOrderSubmit';
import { EMPTY_QUESTION, type QuestionInput } from '../types';

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
  mentoringTypeIds: [1],
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
      question: overrides.question ?? EMPTY_QUESTION,
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
    서버가 공개 상세에 durationPriceId 를 아직 안 내려준다
    (`GetLiveMentoringPublicDetailResponseDto.java:30`). 없으면 신청 생성이
    @NotNull 위반으로 400 이라, 눌러 보고 실패하게 두지 않고 미리 막는다.
    서버가 필드를 추가하면 이 테스트가 그대로 통과한 채 화면만 풀린다.
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
      mentoringTypeIds: [1],
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
});

describe('useOrderSubmit — 실패 처리', () => {
  /*
    안 A 의 알려진 대가다. 폼을 쓰는 사이 다른 사람이 같은 슬롯을 가져갈 수 있다.
  */
  it('슬롯 경합이면 일정을 다시 고르도록 안내한다', async () => {
    mutate.mockImplementation((_body, options) =>
      options.onError({
        response: {
          data: {
            code: 'LIVE_MENTORING_SLOT_ALREADY_RESERVED',
            message: '이미 예약된 슬롯입니다.',
          },
        },
      }),
    );
    const { result } = setup();

    act(() => result.current.submit());

    await waitFor(() => expect(result.current.isSlotConflict).toBe(true));
    expect(result.current.errorMessage).toBe('이미 예약된 슬롯입니다.');
    expect(push).not.toHaveBeenCalled();

    act(() => result.current.goBackToSchedule());
    expect(push).toHaveBeenCalledWith('/live-mentoring/1');
  });

  it('그 밖의 실패는 서버 문구만 보여주고 일정 재선택을 권하지 않는다', async () => {
    mutate.mockImplementation((_body, options) =>
      options.onError({
        response: { data: { code: 'UNKNOWN', message: '서버 내부 오류입니다.' } },
      }),
    );
    const { result } = setup();

    act(() => result.current.submit());

    await waitFor(() =>
      expect(result.current.errorMessage).toBe('서버 내부 오류입니다.'),
    );
    expect(result.current.isSlotConflict).toBe(false);
  });

  it('응답에 문구가 없어도 빈 화면을 남기지 않는다', async () => {
    mutate.mockImplementation((_body, options) => options.onError(new Error('네트워크')));
    const { result } = setup();

    act(() => result.current.submit());

    await waitFor(() =>
      expect(result.current.errorMessage).toBe(
        '신청을 만들지 못했습니다. 잠시 후 다시 시도해 주세요.',
      ),
    );
  });
});
