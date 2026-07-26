import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import axios from '@/utils/axios';

import {
  useLiveMentorDetailQuery,
  useLiveMentorListQuery,
} from './liveMentoring';

// axios 모듈 자체를 모킹 (default export)
jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

const axiosGet = axios.get as jest.Mock;

function makeOpening(overrides: Record<string, unknown> = {}) {
  return {
    id: 100,
    mentorId: 1,
    mentorNickname: '자소서장인',
    mentorProfileImage: null,
    mentorIntroduction: '두괄식 구조',
    representativeCareer: null,
    title: '자소서장인 멘토의 1대1 라이브 멘토링',
    categories: ['PERSONAL_STATEMENT'],
    durations: [60],
    minimumPrice: 60000,
    feedbackStartDate: '2026-07-14',
    feedbackEndDate: '2026-07-28',
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
        size: 9,
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

  it("category='ALL'이면 categories 쿼리를 전달하지 않는다", async () => {
    axiosGet.mockResolvedValue(listResponse());

    const { result } = renderHook(
      () => useLiveMentorListQuery({ category: 'ALL' }),
      { wrapper: createWrapper(newClient()) },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(axiosGet).toHaveBeenCalledWith('/live-mentoring', {
      params: {
        page: 1,
        size: 9,
        categories: undefined,
        sortType: undefined,
      },
      paramsSerializer: PARAMS_SERIALIZER,
    });
  });

  it('구체 카테고리는 배열로 감싸 categories 쿼리에 담는다', async () => {
    axiosGet.mockResolvedValue(listResponse());

    const { result } = renderHook(
      () => useLiveMentorListQuery({ category: 'PORTFOLIO' }),
      { wrapper: createWrapper(newClient()) },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(axiosGet).toHaveBeenCalledWith('/live-mentoring', {
      params: {
        page: 1,
        size: 9,
        categories: ['PORTFOLIO'],
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
          categories: ['PORTFOLIO'],
          durations: [60],
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
            category: 'PORTFOLIO',
            faq: [],
            process: [],
            submissionSpec: { title: 't', desc: 'd' },
            introduction: '소개',
            careers: [],
            mentoringPoints: 'p',
            reviews: { visible: true, selectedReviewIds: [] },
            checklist: [],
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
