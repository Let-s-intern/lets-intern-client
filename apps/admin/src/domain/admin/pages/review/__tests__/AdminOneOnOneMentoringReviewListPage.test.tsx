import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

const getMock = vi.fn();
const patchMock = vi.fn().mockResolvedValue({ data: {} });

vi.mock('@/utils/axiosV2', () => ({
  default: {
    get: (...args: unknown[]) => getMock(...args),
    patch: (...args: unknown[]) => patchMock(...args),
  },
}));

// VisibilityToggle이 MISSION_REVIEW 분기에서 쓰는 훅. 이 화면은 그 분기를 타지 않지만
// 컴포넌트 트리에 있으므로 axios(v1)까지 목이 필요하다.
vi.mock('@/utils/axios', () => ({
  default: { patch: vi.fn(), get: vi.fn() },
}));

import AdminOneOnOneMentoringReviewListPage from '../AdminOneOnOneMentoringReviewListPage';

const renderPage = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={['/review/live-mentoring-1on1']}>
        <AdminOneOnOneMentoringReviewListPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

const mockReview = {
  reviewInfo: {
    reviewId: 1,
    createDate: '2026-09-01T10:00:00',
    title: '커리어 컨설팅 30분',
    name: '홍길동',
    score: 5,
    content: '많은 도움이 됐어요.',
    isVisible: false,
  },
  reviewItemList: [],
};

describe('AdminOneOnOneMentoringReviewListPage', () => {
  it('LIVE_MENTORING_REVIEW 타입으로 조회하고 목록을 렌더한다', async () => {
    getMock.mockResolvedValue({
      data: {
        data: {
          reviewList: [mockReview],
          pageInfo: { pageNum: 0, pageSize: 20, totalElements: 1, totalPages: 1 },
        },
      },
    });

    renderPage();

    expect(
      await screen.findByText('많은 도움이 됐어요.'),
    ).toBeInTheDocument();
    expect(getMock).toHaveBeenCalledWith('/admin/review/LIVE_MENTORING_REVIEW', {
      params: { page: 0, size: 20 },
    });

    const grid = screen.getByRole('grid');
    expect(
      within(grid).getByRole('columnheader', { name: '상품명' }),
    ).toBeInTheDocument();
    expect(
      within(grid).getByRole('columnheader', { name: '멘티명' }),
    ).toBeInTheDocument();
    expect(screen.getByText('홍길동')).toBeInTheDocument();
  });

  it('노출여부 토글을 누르면 isVisible 반전 값으로 PATCH 한다', async () => {
    getMock.mockResolvedValue({
      data: {
        data: {
          reviewList: [mockReview],
          pageInfo: { pageNum: 0, pageSize: 20, totalElements: 1, totalPages: 1 },
        },
      },
    });

    renderPage();

    const toggle = await screen.findByRole('checkbox');
    fireEvent.click(toggle);

    await waitFor(() =>
      expect(patchMock).toHaveBeenCalledWith(
        '/admin/review/LIVE_MENTORING_REVIEW/1',
        { isVisible: true },
      ),
    );
  });
});
