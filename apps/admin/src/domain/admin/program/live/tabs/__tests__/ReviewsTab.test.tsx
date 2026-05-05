/// <reference types="vitest/globals" />
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/utils/axios', () => {
  const get = vi.fn();
  return { default: { get, post: vi.fn(), patch: vi.fn(), delete: vi.fn() } };
});
vi.mock('@/utils/auth', () => ({
  getAuthHeader: () => ({}),
  logoutAndRefreshPage: () => {},
}));

import axios from '@/utils/axios';
import ReviewsTab from '../ReviewsTab';

const get = axios.get as unknown as ReturnType<typeof vi.fn>;

function renderWithClient(node: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{node}</QueryClientProvider>,
  );
}

describe('ReviewsTab', () => {
  beforeEach(() => {
    get.mockReset();
  });

  it('리뷰 항목을 별점/작성자/본문/작성일과 함께 렌더한다', async () => {
    get.mockResolvedValue({
      data: {
        data: {
          reviewList: [
            {
              id: 1,
              score: 4,
              isVisible: true,
              name: '홍길동',
              content: '좋았습니다',
              createdDate: '2026-05-01',
            },
          ],
        },
      },
    });

    renderWithClient(<ReviewsTab liveId={5} />);

    expect(await screen.findByText('홍길동')).toBeInTheDocument();
    expect(screen.getByText('좋았습니다')).toBeInTheDocument();
    expect(screen.getByText('2026-05-01')).toBeInTheDocument();
    expect(screen.getByLabelText('별점 4점')).toBeInTheDocument();
    expect(screen.getByText('(4/5)')).toBeInTheDocument();
    expect(get).toHaveBeenCalledWith('/live/5/reviews');
  });

  it('200자 초과 시 더보기 버튼으로 본문이 토글된다', async () => {
    const longContent = 'a'.repeat(220);
    get.mockResolvedValue({
      data: {
        data: {
          reviewList: [
            {
              id: 2,
              score: 5,
              isVisible: true,
              name: 'A',
              content: longContent,
              createdDate: '2026-05-02',
            },
          ],
        },
      },
    });

    renderWithClient(<ReviewsTab liveId={6} />);

    const moreButton = await screen.findByRole('button', { name: '더보기' });
    expect(screen.getByText(/a{200}…$/)).toBeInTheDocument();

    fireEvent.click(moreButton);
    expect(
      screen.getByRole('button', { name: '접기' }),
    ).toBeInTheDocument();
    expect(screen.getByText(longContent)).toBeInTheDocument();
  });

  it('빈 응답일 때 안내 문구를 표시한다', async () => {
    get.mockResolvedValue({ data: { data: { reviewList: [] } } });
    renderWithClient(<ReviewsTab liveId={7} />);

    expect(await screen.findByText('리뷰가 없습니다.')).toBeInTheDocument();
  });
});
