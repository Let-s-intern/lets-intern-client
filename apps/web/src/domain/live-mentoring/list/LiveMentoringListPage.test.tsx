import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import axios from '@/utils/axios';
import LiveMentoringListPage from './LiveMentoringListPage';

jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

const axiosGet = axios.get as jest.Mock;

function makeCard(id: number) {
  return {
    mentorId: id,
    nickname: `멘토${id}`,
    profileImage: 'https://example.com/p.png',
    profileVisible: true,
    mosaicEnabled: false,
    mosaicBlur: 0,
    headline: '회사 · 직무',
    mentoringPoints: '포인트',
    categories: ['PERSONAL_STATEMENT'],
    durations: [30],
    price: 35000,
    rating: 4.5,
    reviewCount: 10,
    feedbackStartDate: '2026-07-10',
    feedbackEndDate: '2026-07-23',
  };
}

function listResponse(count: number, totalPages = 2) {
  return {
    data: {
      data: {
        content: Array.from({ length: count }, (_, i) => makeCard(i + 1)),
        page: 0,
        size: 9,
        totalPages,
        totalElements: 14,
      },
    },
  };
}

function renderPage() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return render(
    <QueryClientProvider client={client}>
      <LiveMentoringListPage />
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  axiosGet.mockReset();
  axiosGet.mockResolvedValue(listResponse(9));
});

describe('LiveMentoringListPage', () => {
  it('한 페이지에 카드 9개(3×3)를 렌더한다', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('멘토1')).toBeInTheDocument());
    expect(screen.getAllByRole('link')).toHaveLength(9);
  });

  it('기본 정렬은 평점순으로 조회한다', async () => {
    renderPage();
    await waitFor(() =>
      expect(axiosGet).toHaveBeenCalledWith('/live-mentoring/mentors', {
        params: { page: 0, size: 9, category: undefined, sort: 'rating' },
      }),
    );
  });

  it('카테고리 필터를 바꾸면 page 0 으로 해당 카테고리를 조회한다', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('멘토1')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: '포트폴리오' }));

    await waitFor(() =>
      expect(axiosGet).toHaveBeenLastCalledWith('/live-mentoring/mentors', {
        params: { page: 0, size: 9, category: 'PORTFOLIO', sort: 'rating' },
      }),
    );
  });

  it('정렬을 바꾸면 해당 sort 로 조회한다', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('멘토1')).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText('정렬'), {
      target: { value: 'latest' },
    });

    await waitFor(() =>
      expect(axiosGet).toHaveBeenLastCalledWith('/live-mentoring/mentors', {
        params: { page: 0, size: 9, category: undefined, sort: 'latest' },
      }),
    );
  });
});
