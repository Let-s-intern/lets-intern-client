/**
 * 라이브 신규 12개 훅 + 4개 RSC fetch 헬퍼 스모크 테스트.
 * BE 응답 형태가 일부 미확정이라 보수적으로 .passthrough() 로 정의된 스키마는
 * 최소 필드만 mock 한다.
 *
 * apps/admin/src/api/__tests__/live-new-endpoints.test.ts 와 짝을 이룬다.
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';

// axios 인스턴스 모킹: 앱 초기화 시 createDefaultAxios 가 env 검증을 수행하므로 회피한다.
jest.mock('../../utils/axios', () => {
  const get = jest.fn();
  const post = jest.fn();
  const patch = jest.fn();
  const del = jest.fn();
  return {
    __esModule: true,
    default: { get, post, patch, delete: del },
  };
});

// axiosV2 인스턴스 모킹: v2 review 훅이 axiosV2 를 사용한다.
jest.mock('../../utils/axiosV2', () => {
  const get = jest.fn();
  const post = jest.fn();
  const patch = jest.fn();
  const del = jest.fn();
  return {
    __esModule: true,
    default: { get, post, patch, delete: del },
  };
});

jest.mock('../../utils/auth', () => ({
  getAuthHeader: () => ({}),
  logoutAndRefreshPage: () => {},
}));

import axios from '../../utils/axios';
import axiosV2 from '../../utils/axiosV2';
import {
  fetchLiveContent,
  fetchLiveHistory,
  fetchLiveThumbnail,
  fetchLiveTitle,
  useGetLiveApplicantsQuery,
  useGetLiveApplicationFormQuery,
  useGetLiveContentQuery,
  useGetLiveHistoryQuery,
  useGetLiveMentorContentQuery,
  useGetLiveMentorPasswordQuery,
  useGetLiveReviewsAdminQuery,
  useGetLiveReviewsQuery,
  useGetLiveThumbnailQuery,
  useGetLiveTitleQuery,
  useGetReviewListV2Query,
  usePostReviewV2Mutation,
} from '../program';

const get = axios.get as unknown as jest.Mock;
const post = axios.post as unknown as jest.Mock;
const v2Get = axiosV2.get as unknown as jest.Mock;
const v2Post = axiosV2.post as unknown as jest.Mock;

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children,
    );
  };
}

beforeEach(() => {
  get.mockReset();
  post.mockReset();
  v2Get.mockReset();
  v2Post.mockReset();
});

// ────────────────────────────────────────────────────────────
// TanStack Query 훅 12개
// ────────────────────────────────────────────────────────────

describe('useGetLiveContentQuery', () => {
  it('GET /live/{liveId}/content 를 호출한다', async () => {
    get.mockResolvedValue({ data: { data: { desc: '본문' } } });
    const { result } = renderHook(
      () => useGetLiveContentQuery({ liveId: 7, enabled: true }),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(get).toHaveBeenCalledWith('/live/7/content');
  });
});

describe('useGetLiveTitleQuery', () => {
  it('GET /live/{liveId}/title 를 호출한다', async () => {
    get.mockResolvedValue({ data: { data: { title: '실전 직무' } } });
    const { result } = renderHook(
      () => useGetLiveTitleQuery({ liveId: 1, enabled: true }),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(get).toHaveBeenCalledWith('/live/1/title');
  });
});

describe('useGetLiveThumbnailQuery', () => {
  it('GET /live/{liveId}/thumbnail 를 호출한다', async () => {
    get.mockResolvedValue({
      data: { data: { thumbnail: 'a.png', desktopThumbnail: 'b.png' } },
    });
    const { result } = renderHook(
      () => useGetLiveThumbnailQuery({ liveId: 2, enabled: true }),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(get).toHaveBeenCalledWith('/live/2/thumbnail');
  });
});

describe('useGetLiveApplicationFormQuery', () => {
  it('GET /live/{liveId}/application 를 호출한다', async () => {
    get.mockResolvedValue({ data: { data: { applied: false, priceList: [] } } });
    const { result } = renderHook(
      () => useGetLiveApplicationFormQuery({ liveId: 3, enabled: true }),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(get).toHaveBeenCalledWith('/live/3/application');
  });
});

describe('useGetLiveHistoryQuery', () => {
  it('GET /live/{liveId}/history 를 호출한다', async () => {
    get.mockResolvedValue({ data: { data: { applied: true } } });
    const { result } = renderHook(
      () => useGetLiveHistoryQuery({ liveId: 4, enabled: true }),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(get).toHaveBeenCalledWith('/live/4/history');
  });
});

describe('useGetLiveApplicantsQuery', () => {
  it('GET /live/{liveId}/applications 를 호출한다', async () => {
    get.mockResolvedValue({ data: { data: { applicationList: [] } } });
    const { result } = renderHook(
      () => useGetLiveApplicantsQuery({ liveId: 5, enabled: true }),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(get).toHaveBeenCalledWith('/live/5/applications');
  });
});

describe('useGetLiveReviewsAdminQuery', () => {
  it('GET /live/{liveId}/reviews 를 호출한다', async () => {
    get.mockResolvedValue({ data: { data: { reviewList: [] } } });
    const { result } = renderHook(
      () => useGetLiveReviewsAdminQuery({ liveId: 6, enabled: true }),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(get).toHaveBeenCalledWith('/live/6/reviews');
  });
});

describe('useGetLiveReviewsQuery', () => {
  it('GET /live/reviews 를 호출한다', async () => {
    get.mockResolvedValue({ data: { data: { reviewList: [] } } });
    const { result } = renderHook(
      () => useGetLiveReviewsQuery({ enabled: true }),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(get).toHaveBeenCalledWith('/live/reviews');
  });
});

describe('useGetLiveMentorPasswordQuery', () => {
  it('GET /live/{liveId}/mentor 를 호출한다', async () => {
    get.mockResolvedValue({ data: { data: { mentorPassword: 'abc' } } });
    const { result } = renderHook(
      () => useGetLiveMentorPasswordQuery({ liveId: 8, enabled: true }),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(get).toHaveBeenCalledWith('/live/8/mentor');
  });
});

describe('useGetLiveMentorContentQuery', () => {
  it('GET /live/{liveId}/mentor/{password} 를 호출한다', async () => {
    get.mockResolvedValue({
      data: {
        data: {
          liveMentorVo: { id: 1 },
          questionList: [],
          motivateList: [],
          reviewList: [],
        },
      },
    });
    const { result } = renderHook(
      () =>
        useGetLiveMentorContentQuery({
          liveId: 9,
          password: 'pwd',
          enabled: true,
        }),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(get).toHaveBeenCalledWith('/live/9/mentor/pwd');
  });
});

describe('useGetReviewListV2Query', () => {
  it('axiosV2 GET /review 를 params 와 함께 호출한다', async () => {
    v2Get.mockResolvedValue({ data: { data: { reviewList: [] } } });
    const { result } = renderHook(
      () =>
        useGetReviewListV2Query({
          params: { type: 'CHALLENGE', size: 10 },
          enabled: true,
        }),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(v2Get).toHaveBeenCalledWith('/review', {
      params: { type: 'CHALLENGE', size: 10 },
    });
  });
});

describe('usePostReviewV2Mutation', () => {
  it('axiosV2 POST /review 를 호출한다', async () => {
    v2Post.mockResolvedValue({ data: { id: 1 } });
    const { result } = renderHook(() => usePostReviewV2Mutation(), {
      wrapper: createWrapper(),
    });
    result.current.mutate({
      programType: 'LIVE',
      programId: 1,
      nps: 9,
      npsAns: '추천',
      npsCheckAns: true,
      score: 5,
      content: '좋음',
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(v2Post).toHaveBeenCalledWith('/review', {
      programType: 'LIVE',
      programId: 1,
      nps: 9,
      npsAns: '추천',
      npsCheckAns: true,
      score: 5,
      content: '좋음',
    });
  });
});

// ────────────────────────────────────────────────────────────
// RSC 용 fetch 헬퍼 4개 — global fetch 모킹
// ────────────────────────────────────────────────────────────

describe('RSC fetch helpers', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  function mockFetch(json: unknown) {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(json),
    }) as unknown as typeof fetch;
  }

  it('fetchLiveContent 는 .../live/{liveId}/content 를 호출한다', async () => {
    mockFetch({ data: { desc: '본문' } });
    const result = await fetchLiveContent(11);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/live/11/content'),
      undefined,
    );
    expect(result.desc).toBe('본문');
  });

  it('fetchLiveTitle 는 .../live/{liveId}/title 를 호출한다', async () => {
    mockFetch({ data: { title: '실전 직무' } });
    const result = await fetchLiveTitle(12);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/live/12/title'),
      undefined,
    );
    expect(result.title).toBe('실전 직무');
  });

  it('fetchLiveThumbnail 는 .../live/{liveId}/thumbnail 를 호출한다', async () => {
    mockFetch({
      data: { thumbnail: 'a.png', desktopThumbnail: 'b.png' },
    });
    const result = await fetchLiveThumbnail(13);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/live/13/thumbnail'),
      undefined,
    );
    expect(result.thumbnail).toBe('a.png');
  });

  it('fetchLiveHistory 는 .../live/{liveId}/history 를 호출하고 init 을 전달한다', async () => {
    mockFetch({ data: { applied: true } });
    const init = { headers: { Authorization: 'Bearer x' } };
    await fetchLiveHistory(14, init);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/live/14/history'),
      init,
    );
  });

  it('fetchLiveContent 는 ok:false 응답에 대해 throw 한다', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({}),
    }) as unknown as typeof fetch;
    await expect(fetchLiveContent(15)).rejects.toThrow(
      'Failed to fetch live content',
    );
  });
});
