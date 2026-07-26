import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import axios from '@/utils/axios';
import LiveMentoringListPage from './LiveMentoringListPage';

jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

const axiosGet = axios.get as jest.Mock;

/** 모든 목록 호출에 공통으로 붙는 axios 옵션(배열 파라미터 직렬화 교정). */
const PARAMS_SERIALIZER = { indexes: null };

function makeOpening(id: number) {
  return {
    id: id * 100,
    mentorId: id,
    mentorNickname: `멘토${id}`,
    mentorProfileImage: 'https://example.com/p.png',
    mentorIntroduction: '소개',
    representativeCareer: null,
    title: `멘토${id} 멘토의 1대1 라이브 멘토링`,
    categories: ['PERSONAL_STATEMENT'],
    durations: [30],
    minimumPrice: 35000,
    feedbackStartDate: '2026-07-10',
    feedbackEndDate: '2026-07-23',
  };
}

function listResponse(count: number, totalPages = 2) {
  return {
    data: {
      data: {
        openingList: Array.from({ length: count }, (_, i) =>
          makeOpening(i + 1),
        ),
        pageInfo: {
          pageNum: 1,
          pageSize: 9,
          totalElements: 14,
          totalPages,
        },
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

  it('기본은 1페이지·최신순으로 조회한다', async () => {
    renderPage();
    await waitFor(() =>
      expect(axiosGet).toHaveBeenCalledWith('/live-mentoring', {
        params: {
          page: 1,
          size: 9,
          categories: undefined,
          sortType: 'LATEST',
        },
        paramsSerializer: PARAMS_SERIALIZER,
      }),
    );
  });

  it('카테고리 필터를 바꾸면 1페이지로 해당 카테고리를 조회한다', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('멘토1')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: '포트폴리오' }));

    await waitFor(() =>
      expect(axiosGet).toHaveBeenLastCalledWith('/live-mentoring', {
        params: {
          page: 1,
          size: 9,
          categories: ['PORTFOLIO'],
          sortType: 'LATEST',
        },
        paramsSerializer: PARAMS_SERIALIZER,
      }),
    );
  });

  it('정렬을 바꾸면 해당 sortType 으로 조회한다', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('멘토1')).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText('정렬'), {
      target: { value: 'FEEDBACK_START_DATE' },
    });

    await waitFor(() =>
      expect(axiosGet).toHaveBeenLastCalledWith('/live-mentoring', {
        params: {
          page: 1,
          size: 9,
          categories: undefined,
          sortType: 'FEEDBACK_START_DATE',
        },
        paramsSerializer: PARAMS_SERIALIZER,
      }),
    );
  });

  it('페이지를 넘기면 1-based page 를 그대로 전달한다', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('멘토1')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Go to page 2' }));

    await waitFor(() =>
      expect(axiosGet).toHaveBeenLastCalledWith('/live-mentoring', {
        params: {
          page: 2,
          size: 9,
          categories: undefined,
          sortType: 'LATEST',
        },
        paramsSerializer: PARAMS_SERIALIZER,
      }),
    );
  });
});
