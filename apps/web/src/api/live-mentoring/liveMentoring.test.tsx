import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import axios from '@/utils/axios';

import {
  LIVE_MENTOR_SLOTS_QUERY_KEY,
  LIVE_MENTORING_QUESTION_QUERY_KEY,
  LIVE_MENTORING_REFUND_PREVIEW_QUERY_KEY,
  MY_LIVE_MENTORING_APPLICATIONS_QUERY_KEY,
  useCancelLiveMentoringApplicationMutation,
  useLiveMentoringRefundPreviewQuery,
  useLiveMentoringQuestionQuery,
  useMyLiveMentoringApplicationsQuery,
  useUpdateLiveMentoringQuestionMutation,
  useConfirmLiveMentoringPaymentMutation,
  useCreateLiveMentoringApplicationMutation,
  useLiveMentorDetailQuery,
  useLiveMentorListQuery,
  useLiveMentorSlotsQuery,
  useLiveMentoringEntryQuery,
  useCreateLiveMentoringEntryMeetingRoomMutation,
  useUpdateLiveMentoringEntryAttendanceMutation,
} from './liveMentoring';

// axios 모듈 자체를 모킹 (default export)
jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), patch: jest.fn() },
}));

const axiosGet = axios.get as jest.Mock;
const axiosPost = axios.post as jest.Mock;
const axiosPatch = axios.patch as jest.Mock;

function makeOpening(overrides: Record<string, unknown> = {}) {
  return {
    liveMentoringId: 100,
    openingId: 500,
    mentorId: 1,
    mentorNickname: '자소서장인',
    mentorProfileImage: null,
    mentorIntroduction: '두괄식 구조',
    representativeCareer: null,
    title: '자소서장인 멘토의 1대1 라이브 멘토링',
    categories: ['PERSONAL_STATEMENT'],
    durations: [60],
    minimumPrice: 60000,
    ...overrides,
  };
}

function listResponse() {
  return {
    data: {
      data: {
        openingList: [makeOpening()],
        pageInfo: {
          pageNum: 1,
          pageSize: 9,
          totalElements: 14,
          totalPages: 2,
        },
      },
    },
  };
}

/** 모든 목록 호출에 공통으로 붙는 axios 옵션(배열 파라미터 직렬화 교정). */
const PARAMS_SERIALIZER = { indexes: null };

function createWrapper(client: QueryClient) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'QueryWrapper';
  return Wrapper;
}

function newClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
}

beforeEach(() => {
  axiosGet.mockReset();
  axiosPost.mockReset();
  axiosPatch.mockReset();
});

describe('useLiveMentorListQuery', () => {
  it('page/size/sortType 을 쿼리로 전달하고 응답을 파싱한다', async () => {
    axiosGet.mockResolvedValue(listResponse());

    const { result } = renderHook(
      () => useLiveMentorListQuery({ page: 2, sort: 'LATEST' }),
      { wrapper: createWrapper(newClient()) },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(axiosGet).toHaveBeenCalledWith('/live-mentoring', {
      params: {
        page: 2,
        size: 12,
        categories: undefined,
        sortType: 'LATEST',
      },
      paramsSerializer: PARAMS_SERIALIZER,
    });
    expect(result.current.data?.openingList).toHaveLength(1);
    expect(result.current.data?.pageInfo.totalPages).toBe(2);
  });

  it('page 기본값은 1이다 (서버가 one-indexed)', async () => {
    axiosGet.mockResolvedValue(listResponse());

    const { result } = renderHook(() => useLiveMentorListQuery(), {
      wrapper: createWrapper(newClient()),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(axiosGet).toHaveBeenCalledWith(
      '/live-mentoring',
      expect.objectContaining({
        params: expect.objectContaining({ page: 1 }),
      }),
    );
  });

  it('선택한 카테고리가 없으면 categories 쿼리를 전달하지 않는다', async () => {
    axiosGet.mockResolvedValue(listResponse());

    const { result } = renderHook(
      () => useLiveMentorListQuery({ categories: [] }),
      { wrapper: createWrapper(newClient()) },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(axiosGet).toHaveBeenCalledWith('/live-mentoring', {
      params: {
        page: 1,
        size: 12,
        categories: undefined,
        sortType: undefined,
      },
      paramsSerializer: PARAMS_SERIALIZER,
    });
  });

  it('선택한 카테고리를 categories 쿼리에 그대로 담는다(다중 선택)', async () => {
    axiosGet.mockResolvedValue(listResponse());

    const { result } = renderHook(
      () => useLiveMentorListQuery({ categories: ['PORTFOLIO', 'RESUME'] }),
      { wrapper: createWrapper(newClient()) },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(axiosGet).toHaveBeenCalledWith('/live-mentoring', {
      params: {
        page: 1,
        size: 12,
        categories: ['PORTFOLIO', 'RESUME'],
        sortType: undefined,
      },
      paramsSerializer: PARAMS_SERIALIZER,
    });
  });

  it('응답 스키마가 깨지면 isError 가 된다', async () => {
    axiosGet.mockResolvedValue({
      data: {
        data: {
          openingList: [makeOpening({ minimumPrice: 'x' })],
          pageInfo: {
            pageNum: 1,
            pageSize: 9,
            totalElements: 1,
            totalPages: 1,
          },
        },
      },
    });

    const { result } = renderHook(() => useLiveMentorListQuery(), {
      wrapper: createWrapper(newClient()),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useLiveMentorDetailQuery', () => {
  it('mentorId 가 있으면 GET /live-mentoring/mentors/{id} 를 호출한다', async () => {
    axiosGet.mockResolvedValue({
      data: {
        data: {
          mentorId: 3,
          openingId: 6,
          title: '포폴메이커 멘토의 1:1 멘토링',
          categories: ['PORTFOLIO'],
          durations: [60],
          durationPrices: [{ durationPriceId: 5, duration: 60, price: 60000 }],
          price: 60000,
          rating: 5,
          reviewCount: 10,
          feedbackStartDate: '2026-07-18',
          feedbackEndDate: '2026-08-01',
          profile: {
            visible: true,
            mosaicEnabled: false,
            mosaicBlur: 0,
            nickname: '포폴메이커',
            profileImage: null,
            introduction: '소개',
            careers: [],
          },
          template: {
            categories: ['PORTFOLIO'],
            hero: { bullets: ['불릿'] },
            intro: {
              passedCount: null,
              profileImage: null,
              affiliation: '',
              careerLines: [],
              oneLiner: '소개',
            },
            mentoringTypes: { title: 't', subtitle: 's', items: [] },
            strategy: { visible: false, title: 't', subtitle: 's', points: [] },
            video: {
              visible: false,
              title: 't',
              subtitle: 's',
              videoUrl: null,
              caption: '',
            },
            results: { visible: false, title: 't', subtitle: 's', cases: [] },
            reviews: { visible: true, selectedReviewIds: [] },
          },
          reviews: [],
          challenges: [],
        },
      },
    });

    const { result } = renderHook(() => useLiveMentorDetailQuery(3), {
      wrapper: createWrapper(newClient()),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(axiosGet).toHaveBeenCalledWith('/live-mentoring/mentors/3');
    expect(result.current.data?.mentorId).toBe(3);
  });

  it('mentorId 가 null 이면 axios 를 호출하지 않는다', async () => {
    renderHook(() => useLiveMentorDetailQuery(null), {
      wrapper: createWrapper(newClient()),
    });

    await new Promise((r) => setTimeout(r, 10));
    expect(axiosGet).not.toHaveBeenCalled();
  });
});

describe('useLiveMentorSlotsQuery', () => {
  it('GET /live-mentoring/mentors/{id}/slots 를 호출하고 슬롯 목록을 파싱한다', async () => {
    axiosGet.mockResolvedValue({
      data: {
        data: {
          liveMentoringSlotList: [
            {
              slotId: 1,
              startDate: '2026-09-01T10:00:00',
              endDate: '2026-09-01T10:30:00',
              status: 'OPEN',
            },
            {
              slotId: 2,
              startDate: '2026-09-03T14:00:00',
              endDate: '2026-09-03T14:30:00',
              status: 'OPEN',
            },
          ],
        },
      },
    });

    const { result } = renderHook(() => useLiveMentorSlotsQuery(3), {
      wrapper: createWrapper(newClient()),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(axiosGet).toHaveBeenCalledWith('/live-mentoring/mentors/3/slots');
    expect(result.current.data?.liveMentoringSlotList).toHaveLength(2);
    expect(result.current.data?.liveMentoringSlotList[0].startDate).toBe(
      '2026-09-01T10:00:00',
    );
  });

  // 활성 개설이 없는 멘토는 서버가 빈 배열을 준다 — 에러가 아니다.
  it('슬롯이 없으면 빈 배열을 성공으로 받는다', async () => {
    axiosGet.mockResolvedValue({
      data: { data: { liveMentoringSlotList: [] } },
    });

    const { result } = renderHook(() => useLiveMentorSlotsQuery(3), {
      wrapper: createWrapper(newClient()),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.liveMentoringSlotList).toEqual([]);
  });

  it('mentorId 가 null 이면 axios 를 호출하지 않는다', async () => {
    renderHook(() => useLiveMentorSlotsQuery(null), {
      wrapper: createWrapper(newClient()),
    });

    await new Promise((r) => setTimeout(r, 10));
    expect(axiosGet).not.toHaveBeenCalled();
  });

  it('응답 스키마가 깨지면 isError 가 된다', async () => {
    axiosGet.mockResolvedValue({
      data: {
        data: {
          liveMentoringSlotList: [
            {
              slotId: 1,
              startDate: '2026-09-01T10:00:00',
              endDate: '2026-09-01T10:30:00',
              status: 'CANCELED',
            },
          ],
        },
      },
    });

    const { result } = renderHook(() => useLiveMentorSlotsQuery(3), {
      wrapper: createWrapper(newClient()),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

/** 서버 `CreateLiveMentoringApplicationRequestDto` 를 통과하는 최소 페이로드. */
const CREATE_BODY = {
  durationPriceId: 1,
  slotIds: [142],
  mentoringCategory: 'PERSONAL_STATEMENT' as const,
  reservationChangeAgreed: true,
  contactEmail: 'local-admin@letscareer.test',
  question: {
    deferred: true,
    attachmentType: 'NONE' as const,
    mentorShareAgreed: false,
  },
};

function createResponse(overrides: Record<string, unknown> = {}) {
  return {
    data: {
      data: {
        applicationId: 11,
        product: {
          durationPriceId: 1,
          name: '어드민 1대1 라이브 멘토링',
          durationMinutes: 30,
        },
        reservation: {
          slotIds: [142],
          startAt: '2026-09-14T09:30:00',
          endAt: '2026-09-14T10:00:00',
          applicationStatus: 'PAYMENT_PENDING',
          expiresAt: '2026-08-21T12:10:00',
        },
        mentoringCategory: 'PERSONAL_STATEMENT',
        payment: {
          originalPrice: 35000,
          productDiscount: 0,
          couponDiscount: 0,
          finalAmount: 35000,
          orderId: 'lm_20260821_0001',
          currency: 'KRW',
        },
        ...overrides,
      },
    },
  };
}

describe('useCreateLiveMentoringApplicationMutation', () => {
  it('개설 id 경로로 POST 하고 응답을 파싱한다', async () => {
    axiosPost.mockResolvedValue(createResponse());

    const { result } = renderHook(
      () => useCreateLiveMentoringApplicationMutation(6),
      { wrapper: createWrapper(newClient()) },
    );
    result.current.mutate(CREATE_BODY);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(axiosPost).toHaveBeenCalledWith(
      '/live-mentoring/openings/6/applications',
      CREATE_BODY,
    );
    // Toss 에 넘길 주문번호와 10분 선점 만료 시각이 이 응답의 핵심이다
    expect(result.current.data?.payment.orderId).toBe('lm_20260821_0001');
    expect(result.current.data?.reservation.expiresAt).toBe(
      '2026-08-21T12:10:00',
    );
    expect(result.current.data?.reservation.applicationStatus).toBe(
      'PAYMENT_PENDING',
    );
  });

  it('응답 형태가 계약과 다르면 실패로 떨어진다', async () => {
    // orderId 가 빠진 응답 — Toss 로 넘어갈 값이 없는데 성공으로 보이면 안 된다
    axiosPost.mockResolvedValue(
      createResponse({
        payment: {
          originalPrice: 35000,
          productDiscount: 0,
          couponDiscount: 0,
          finalAmount: 35000,
          currency: 'KRW',
        },
      }),
    );

    const { result } = renderHook(
      () => useCreateLiveMentoringApplicationMutation(6),
      { wrapper: createWrapper(newClient()) },
    );
    result.current.mutate(CREATE_BODY);

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  /*
    서버 LiveMentoringErrorCode 를 사용자 문구로 바꾸는 일은 화면의 몫이다.
    훅은 에러를 가공하지 않고 그대로 흘려보낸다.
  */
  it('서버 에러를 가공하지 않고 그대로 던진다', async () => {
    const serverError = Object.assign(new Error('Request failed'), {
      response: {
        status: 409,
        data: {
          message: '이미 예약된 슬롯입니다.',
          code: 'SLOT_ALREADY_TAKEN',
        },
      },
    });
    axiosPost.mockRejectedValue(serverError);

    const { result } = renderHook(
      () => useCreateLiveMentoringApplicationMutation(6),
      { wrapper: createWrapper(newClient()) },
    );
    result.current.mutate(CREATE_BODY);

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBe(serverError);
  });
});

const CONFIRM_BODY = {
  paymentKey: 'tviva20260821',
  orderId: 'ON5-6V4M6A57',
  // 요청의 amount 는 문자열이다. 응답에서는 숫자로 돌아온다.
  amount: '35000',
};

function confirmResponse() {
  return {
    data: {
      data: {
        applicationId: 14,
        paymentId: 501,
        orderId: 'ON5-6V4M6A57',
        amount: 35000,
        applicationStatus: 'CONFIRMED',
      },
    },
  };
}

describe('useConfirmLiveMentoringPaymentMutation', () => {
  it('신청 id 경로로 POST 하고 응답을 파싱한다', async () => {
    axiosPost.mockResolvedValue(confirmResponse());

    const { result } = renderHook(
      () => useConfirmLiveMentoringPaymentMutation(14),
      { wrapper: createWrapper(newClient()) },
    );
    result.current.mutate(CONFIRM_BODY);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(axiosPost).toHaveBeenCalledWith(
      '/live-mentoring/applications/14/payment/confirm',
      CONFIRM_BODY,
    );
    expect(result.current.data?.applicationStatus).toBe('CONFIRMED');
    expect(result.current.data?.amount).toBe(35000);
  });

  /*
    승인이 끝나면 선점이 확정 예약으로 바뀐다. 슬롯 목록을 무효화하지 않으면
    방금 잡은 시간이 여전히 예약 가능한 것처럼 보이고, 다시 누르면 서버에서
    중복 예약으로 떨어진다.
  */
  it('승인 성공 시 슬롯 목록 쿼리를 무효화한다', async () => {
    axiosPost.mockResolvedValue(confirmResponse());
    const client = newClient();
    const invalidate = jest.spyOn(client, 'invalidateQueries');

    const { result } = renderHook(
      () => useConfirmLiveMentoringPaymentMutation(14),
      { wrapper: createWrapper(client) },
    );
    result.current.mutate(CONFIRM_BODY);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidate).toHaveBeenCalledWith({
      queryKey: LIVE_MENTOR_SLOTS_QUERY_KEY,
    });
  });

  it('승인이 실패하면 슬롯 목록을 무효화하지 않는다', async () => {
    axiosPost.mockRejectedValue(new Error('승인 실패'));
    const client = newClient();
    const invalidate = jest.spyOn(client, 'invalidateQueries');

    const { result } = renderHook(
      () => useConfirmLiveMentoringPaymentMutation(14),
      { wrapper: createWrapper(client) },
    );
    result.current.mutate(CONFIRM_BODY);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(invalidate).not.toHaveBeenCalled();
  });

  it('응답의 amount 가 문자열로 오면 실패로 떨어진다', async () => {
    axiosPost.mockResolvedValue({
      data: {
        data: {
          applicationId: 14,
          paymentId: 501,
          orderId: 'ON5-6V4M6A57',
          amount: '35000',
          applicationStatus: 'CONFIRMED',
        },
      },
    });

    const { result } = renderHook(
      () => useConfirmLiveMentoringPaymentMutation(14),
      { wrapper: createWrapper(newClient()) },
    );
    result.current.mutate(CONFIRM_BODY);

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

const MY_APPLICATION = {
  applicationId: 10,
  paymentId: null,
  mentorName: '어드어드민닉네임',
  thumbnail: 'https://example.test/t.png',
  productName: '어드민 1대1 라이브 멘토링',
  durationMinutes: 60,
  reservationStartAt: '2026-09-13T10:00:00',
  reservationEndAt: '2026-09-13T11:00:00',
  status: 'CONFIRMED',
  questionWritten: true,
  questionEditable: true,
  entryLink: null,
};

const QUESTION = {
  applicationId: 10,
  deferred: false,
  content: '이력서 봐주세요',
  attachmentType: 'NONE',
  fileId: null,
  attachmentUrl: null,
  mentorShareAgreed: true,
  reservationStartAt: '2026-09-13T10:00:00',
  editable: true,
  editDeadline: '2026-09-12T10:00:00',
};

describe('useMyLiveMentoringApplicationsQuery', () => {
  it('신청 목록을 조회해 파싱한다', async () => {
    axiosGet.mockResolvedValue({
      data: { data: { applicationList: [MY_APPLICATION] } },
    });

    const { result } = renderHook(() => useMyLiveMentoringApplicationsQuery(), {
      wrapper: createWrapper(newClient()),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(axiosGet).toHaveBeenCalledWith('/live-mentoring/applications/my');
    expect(result.current.data?.applicationList[0].applicationId).toBe(10);
  });

  it('응답 스키마가 깨지면 isError 가 된다', async () => {
    axiosGet.mockResolvedValue({
      data: {
        data: { applicationList: [{ ...MY_APPLICATION, status: 'PAID' }] },
      },
    });

    const { result } = renderHook(() => useMyLiveMentoringApplicationsQuery(), {
      wrapper: createWrapper(newClient()),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useLiveMentoringQuestionQuery', () => {
  it('신청 id 경로로 조회하고 editable 을 그대로 받는다', async () => {
    axiosGet.mockResolvedValue({ data: { data: QUESTION } });

    const { result } = renderHook(() => useLiveMentoringQuestionQuery(10), {
      wrapper: createWrapper(newClient()),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(axiosGet).toHaveBeenCalledWith(
      '/live-mentoring/applications/10/question',
    );
    // 48시간 판정은 서버가 한다. 화면이 다시 계산하면 시계가 어긋난다.
    expect(result.current.data?.editable).toBe(true);
  });

  it('신청 id 가 null 이면 조회하지 않는다', () => {
    renderHook(() => useLiveMentoringQuestionQuery(null), {
      wrapper: createWrapper(newClient()),
    });

    expect(axiosGet).not.toHaveBeenCalled();
  });
});

describe('useUpdateLiveMentoringQuestionMutation', () => {
  const body = {
    deferred: false,
    content: '고친 질문',
    attachmentType: 'NONE' as const,
    fileId: null,
    url: null,
    mentorShareAgreed: true,
  };

  it('PATCH 로 보내고 응답을 파싱한다', async () => {
    axiosPatch.mockResolvedValue({
      data: { data: { ...QUESTION, content: '고친 질문' } },
    });

    const { result } = renderHook(
      () => useUpdateLiveMentoringQuestionMutation(10),
      { wrapper: createWrapper(newClient()) },
    );
    result.current.mutate(body);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(axiosPatch).toHaveBeenCalledWith(
      '/live-mentoring/applications/10/question',
      body,
    );
    expect(result.current.data?.content).toBe('고친 질문');
  });

  /*
    목록의 questionWritten 이 카드 버튼을 `작성` / `수정` 으로 가른다. 목록을
    남겨 두면 방금 쓴 질문인데도 카드에는 여전히 `멘토링 질문 작성` 이 남는다.
  */
  it('수정 성공 시 질문과 신청 목록을 함께 무효화한다', async () => {
    axiosPatch.mockResolvedValue({ data: { data: QUESTION } });
    const client = newClient();
    const invalidate = jest.spyOn(client, 'invalidateQueries');

    const { result } = renderHook(
      () => useUpdateLiveMentoringQuestionMutation(10),
      { wrapper: createWrapper(client) },
    );
    result.current.mutate(body);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidate).toHaveBeenCalledWith({
      queryKey: LIVE_MENTORING_QUESTION_QUERY_KEY,
    });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: MY_LIVE_MENTORING_APPLICATIONS_QUERY_KEY,
    });
  });

  it('수정이 실패하면 아무것도 무효화하지 않는다', async () => {
    axiosPatch.mockRejectedValue(new Error('409'));
    const client = newClient();
    const invalidate = jest.spyOn(client, 'invalidateQueries');

    const { result } = renderHook(
      () => useUpdateLiveMentoringQuestionMutation(10),
      { wrapper: createWrapper(client) },
    );
    result.current.mutate(body);

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(invalidate).not.toHaveBeenCalled();
  });
});

const REFUND_PREVIEW = {
  applicationId: 10,
  paymentId: null,
  orderId: 'GHiV6ewvHOw4',
  originalPrice: 60000,
  productDiscount: 0,
  couponDiscount: 0,
  paidAmount: 60000,
  cancelFeePercent: 50,
  cancelFee: 30000,
  refundAmount: 30000,
  reservationStartAt: '2026-09-13T10:00:00',
  cancelable: true,
};

describe('useLiveMentoringRefundPreviewQuery', () => {
  it('신청 id 경로로 조회하고 서버가 계산한 금액을 그대로 받는다', async () => {
    axiosGet.mockResolvedValue({ data: { data: REFUND_PREVIEW } });

    const { result } = renderHook(
      () => useLiveMentoringRefundPreviewQuery(10),
      { wrapper: createWrapper(newClient()) },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(axiosGet).toHaveBeenCalledWith(
      '/live-mentoring/applications/10/refund-preview',
    );
    expect(result.current.data?.cancelFeePercent).toBe(50);
    expect(result.current.data?.refundAmount).toBe(30000);
  });

  it('신청 id 가 null 이면 조회하지 않는다', () => {
    renderHook(() => useLiveMentoringRefundPreviewQuery(null), {
      wrapper: createWrapper(newClient()),
    });

    expect(axiosGet).not.toHaveBeenCalled();
  });
});

describe('useCancelLiveMentoringApplicationMutation', () => {
  it('취소를 요청하고 응답을 파싱한다', async () => {
    axiosPost.mockResolvedValue({ data: { data: REFUND_PREVIEW } });

    const { result } = renderHook(
      () => useCancelLiveMentoringApplicationMutation(10),
      { wrapper: createWrapper(newClient()) },
    );
    result.current.mutate();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(axiosPost).toHaveBeenCalledWith(
      '/live-mentoring/applications/10/cancel',
    );
    expect(result.current.data?.refundAmount).toBe(30000);
  });

  /*
    서버가 Toss 부분 취소를 부르고 슬롯을 되돌린다. 무효화하지 않으면 방금 풀린
    시간이 여전히 예약 불가로 보이고, 마이페이지에는 취소된 신청이 남는다.
  */
  it('취소 성공 시 슬롯·신청현황·환불 미리보기를 함께 무효화한다', async () => {
    axiosPost.mockResolvedValue({ data: { data: REFUND_PREVIEW } });
    const client = newClient();
    const invalidate = jest.spyOn(client, 'invalidateQueries');

    const { result } = renderHook(
      () => useCancelLiveMentoringApplicationMutation(10),
      { wrapper: createWrapper(client) },
    );
    result.current.mutate();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidate).toHaveBeenCalledWith({
      queryKey: LIVE_MENTOR_SLOTS_QUERY_KEY,
    });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: MY_LIVE_MENTORING_APPLICATIONS_QUERY_KEY,
    });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: LIVE_MENTORING_REFUND_PREVIEW_QUERY_KEY,
    });
  });

  it('취소가 실패하면 아무것도 무효화하지 않는다', async () => {
    axiosPost.mockRejectedValue(new Error('409'));
    const client = newClient();
    const invalidate = jest.spyOn(client, 'invalidateQueries');

    const { result } = renderHook(
      () => useCancelLiveMentoringApplicationMutation(10),
      { wrapper: createWrapper(client) },
    );
    result.current.mutate();

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(invalidate).not.toHaveBeenCalled();
  });

  /*
    되돌릴 수 없는 요청이다. 실패가 정말 실패인지 알 수 없는 상태에서 자동으로
    한 번 더 부르면 이중 취소가 될 수 있다.
  */
  it('실패해도 자동으로 다시 부르지 않는다', async () => {
    axiosPost.mockRejectedValue(new Error('409'));

    const { result } = renderHook(
      () => useCancelLiveMentoringApplicationMutation(10),
      { wrapper: createWrapper(newClient()) },
    );
    result.current.mutate();

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(axiosPost).toHaveBeenCalledTimes(1);
  });
});

function entryResponse(overrides: Record<string, unknown> = {}) {
  return {
    data: {
      data: {
        applicationId: 31,
        myRole: 'MENTOR',
        productName: '이력서 라이브 멘토링',
        durationMinutes: 30,
        reservationStartAt: '2026-09-13T10:00:00',
        reservationEndAt: '2026-09-13T10:30:00',
        mentorName: '김멘토',
        menteeName: '박멘티',
        questionDeferred: false,
        questionContent: '질문입니다.',
        attachmentType: 'NONE',
        attachmentUrl: null,
        mentorStatus: 'PENDING',
        menteeStatus: 'PENDING',
        meetingUrl: null,
        reviewId: null,
        questionEditable: true,
        questionEditDeadline: '2026-09-12T10:00:00',
        ...overrides,
      },
    },
  };
}

describe('useLiveMentoringEntryQuery', () => {
  it('GET .../applications/{id}/entry 를 호출하고 응답을 파싱한다', async () => {
    axiosGet.mockResolvedValueOnce(entryResponse());

    const { result } = renderHook(() => useLiveMentoringEntryQuery(31), {
      wrapper: createWrapper(newClient()),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(axiosGet).toHaveBeenCalledWith(
      '/live-mentoring/applications/31/entry',
    );
    expect(result.current.data?.myRole).toBe('MENTOR');
  });

  it('applicationId 가 null 이면 axios 를 호출하지 않는다', () => {
    renderHook(() => useLiveMentoringEntryQuery(null), {
      wrapper: createWrapper(newClient()),
    });
    expect(axiosGet).not.toHaveBeenCalled();
  });

  it('응답 스키마가 깨지면 isError 가 된다', async () => {
    axiosGet.mockResolvedValueOnce({ data: { data: { applicationId: 31 } } });

    const { result } = renderHook(() => useLiveMentoringEntryQuery(31), {
      wrapper: createWrapper(newClient()),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useCreateLiveMentoringEntryMeetingRoomMutation', () => {
  it('base 만 담아 PATCH 하고 최종 주소 문자열을 돌려준다', async () => {
    axiosPatch.mockResolvedValueOnce({
      data: { data: 'https://meet.jit.si/room-abc' },
    });

    const { result } = renderHook(
      () => useCreateLiveMentoringEntryMeetingRoomMutation(31),
      { wrapper: createWrapper(newClient()) },
    );
    result.current.mutate('https://meet.jit.si/');

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(axiosPatch).toHaveBeenCalledWith(
      '/live-mentoring/applications/31/entry/meeting-url',
      { meetingUrlBase: 'https://meet.jit.si/' },
    );
    expect(result.current.data).toBe('https://meet.jit.si/room-abc');
  });
});

describe('useUpdateLiveMentoringEntryAttendanceMutation', () => {
  it('멘토용 출석 엔드포인트로 PATCH 한다', async () => {
    axiosPatch.mockResolvedValueOnce({ data: { data: null } });

    const { result } = renderHook(
      () => useUpdateLiveMentoringEntryAttendanceMutation(31),
      { wrapper: createWrapper(newClient()) },
    );
    result.current.mutate({ menteeStatus: 'PRESENT' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(axiosPatch).toHaveBeenCalledWith(
      '/mentor/live-mentoring/reservations/31/attendance',
      { menteeStatus: 'PRESENT' },
    );
  });
});
