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

function makeCard(overrides: Record<string, unknown> = {}) {
  return {
    mentorId: 1,
    nickname: '자소서장인',
    profileImage: null,
    profileVisible: true,
    mosaicEnabled: false,
    mosaicBlur: 0,
    headline: '네이버 · 기획 7년',
    mentoringPoints: '두괄식 구조',
    categories: ['PERSONAL_STATEMENT'],
    durations: [50],
    price: 60000,
    rating: 4.9,
    reviewCount: 182,
    feedbackStartDate: '2026-07-14',
    feedbackEndDate: '2026-07-28',
    ...overrides,
  };
}

function listResponse() {
  return {
    data: {
      data: {
        content: [makeCard()],
        page: 0,
        size: 9,
        totalPages: 2,
        totalElements: 14,
      },
    },
  };
}

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
  it('page/size/sort 를 쿼리로 전달하고 응답을 파싱한다', async () => {
    axiosGet.mockResolvedValue(listResponse());

    const { result } = renderHook(
      () => useLiveMentorListQuery({ page: 1, sort: 'rating' }),
      { wrapper: createWrapper(newClient()) },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(axiosGet).toHaveBeenCalledWith('/live-mentoring/mentors', {
      params: { page: 1, size: 9, category: undefined, sort: 'rating' },
    });
    expect(result.current.data?.content).toHaveLength(1);
    expect(result.current.data?.totalPages).toBe(2);
  });

  it("category='ALL'이면 category 쿼리를 전달하지 않는다", async () => {
    axiosGet.mockResolvedValue(listResponse());

    const { result } = renderHook(
      () => useLiveMentorListQuery({ category: 'ALL' }),
      { wrapper: createWrapper(newClient()) },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(axiosGet).toHaveBeenCalledWith('/live-mentoring/mentors', {
      params: { page: 0, size: 9, category: undefined, sort: undefined },
    });
  });

  it('구체 카테고리는 그대로 쿼리에 담는다', async () => {
    axiosGet.mockResolvedValue(listResponse());

    const { result } = renderHook(
      () => useLiveMentorListQuery({ category: 'PORTFOLIO' }),
      { wrapper: createWrapper(newClient()) },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(axiosGet).toHaveBeenCalledWith('/live-mentoring/mentors', {
      params: { page: 0, size: 9, category: 'PORTFOLIO', sort: undefined },
    });
  });

  it('응답 스키마가 깨지면 isError 가 된다', async () => {
    axiosGet.mockResolvedValue({
      data: {
        data: {
          content: [makeCard({ rating: 'x' })],
          page: 0,
          size: 9,
          totalPages: 1,
          totalElements: 1,
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
          durations: [50],
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
