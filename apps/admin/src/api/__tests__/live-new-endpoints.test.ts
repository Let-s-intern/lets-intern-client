/// <reference types="vitest/globals" />
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// axios 인스턴스를 모킹한다 (앱 초기화 시 호출되는 createDefaultAxios 회피).
vi.mock('../../utils/axios', () => {
  const get = vi.fn();
  const post = vi.fn();
  const patch = vi.fn();
  const del = vi.fn();
  return {
    default: { get, post, patch, delete: del },
  };
});

// axiosV2 인스턴스 모킹: v2 review 훅이 axiosV2 를 사용한다.
vi.mock('../../utils/axiosV2', () => {
  const get = vi.fn();
  const post = vi.fn();
  const patch = vi.fn();
  const del = vi.fn();
  return {
    default: { get, post, patch, delete: del },
  };
});

// auth helper 도 import 시 호출되므로 무해화한다.
vi.mock('../../utils/auth', () => ({
  getAuthHeader: () => ({}),
  logoutAndRefreshPage: () => {},
}));

import axios from '../../utils/axios';
import axiosV2 from '../../utils/axiosV2';
import {
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

const get = axios.get as unknown as ReturnType<typeof vi.fn>;
const post = axios.post as unknown as ReturnType<typeof vi.fn>;
const v2Get = axiosV2.get as unknown as ReturnType<typeof vi.fn>;
const v2Post = axiosV2.post as unknown as ReturnType<typeof vi.fn>;

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

/**
 * URL 경로 호출 검증 + 스키마 파싱 통과 여부 검증.
 * BE 응답 형태가 미확정 영역은 .passthrough() 로 정의되어 있으므로
 * 최소 필드만 mock 한다.
 */
describe('useGetLiveContentQuery', () => {
  it('GET /live/{liveId}/content 를 호출한다', async () => {
    get.mockResolvedValue({ data: { data: { desc: '본문' } } });
    const { result } = renderHook(
      () => useGetLiveContentQuery({ liveId: 7, enabled: true }),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(get).toHaveBeenCalledWith('/live/7/content');
    expect(result.current.data?.desc).toBe('본문');
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
    expect(result.current.data?.title).toBe('실전 직무');
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
