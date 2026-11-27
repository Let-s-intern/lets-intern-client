import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const get = vi.fn();

vi.mock('@/utils/axiosV2', () => ({
  default: {
    get: (...args: unknown[]) => get(...args),
  },
}));

import {
  useChallengeQuestionQuery,
  type ChallengeQuestionItem,
} from './challengeQuestion';

const serverQuestion = {
  id: 7,
  answerStatus: 'COMPLETED',
  title: '제목',
  content: '내용',
  answer: '서버 답변',
  isVisible: true,
  challengeId: 3,
  challengeTitle: '챌린지',
  userId: 1,
  userName: '홍길동',
  email: 'a@b.c',
  createDate: '2026-11-27T10:00:00',
};

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 0 } },
});

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: queryClient }, children);

afterEach(() => {
  queryClient.clear();
  get.mockReset();
});

describe('useChallengeQuestionQuery', () => {
  it('단건 API 응답을 문의 스키마로 파싱한다', async () => {
    get.mockResolvedValue({ data: { data: serverQuestion } });

    const { result } = renderHook(() => useChallengeQuestionQuery(3, 7), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(get).toHaveBeenCalledWith('/admin/challenge/3/questions/7');
    expect(result.current.data?.answer).toBe('서버 답변');
    // 스키마 기본값이 채워진다
    expect(result.current.data?.imageUrls).toEqual([]);
    expect(result.current.data?.isAnswerRead).toBe(false);
    expect(result.current.isPlaceholderData).toBe(false);
  });

  it('첫 표시용 문의가 있으면 응답 전에 바로 돌려주고, 서버 값으로 바꾼다', async () => {
    get.mockResolvedValue({ data: { data: serverQuestion } });
    const fromList = {
      ...serverQuestion,
      answer: '목록의 오래된 답변',
      imageUrls: [],
      isAnswerRead: false,
    } as ChallengeQuestionItem;

    const { result } = renderHook(
      () => useChallengeQuestionQuery(3, 7, fromList),
      { wrapper },
    );

    expect(result.current.data?.answer).toBe('목록의 오래된 답변');
    expect(result.current.isPlaceholderData).toBe(true);

    await waitFor(() => expect(result.current.isPlaceholderData).toBe(false));
    expect(result.current.data?.answer).toBe('서버 답변');
  });
});
