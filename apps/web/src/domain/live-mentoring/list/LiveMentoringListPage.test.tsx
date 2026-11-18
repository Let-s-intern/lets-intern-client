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
    liveMentoringId: id * 100,
    openingId: id * 1000,
    mentorId: id,
    mentorNickname: `멘토${id}`,
    mentorProfileImage: 'https://example.com/p.png',
    mentorIntroduction: '소개',
    representativeCareer: null,
    title: `멘토${id} 멘토의 1:1 LIVE 멘토링`,
    categories: ['PERSONAL_STATEMENT'],
    durations: [30],
    minimumPrice: 35000,
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
          pageSize: 12,
          totalElements: 20,
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

/** jsdom 에 없는 IntersectionObserver. 목록 끝 표시가 붙으면 바로 보인 것으로 친다 */
beforeAll(() => {
  (
    window as unknown as { IntersectionObserver: unknown }
  ).IntersectionObserver = class {
    constructor(private cb: (entries: { isIntersecting: boolean }[]) => void) {}
    observe() {
      this.cb([{ isIntersecting: true }]);
    }
    disconnect() {}
  };
});

beforeEach(() => {
  axiosGet.mockReset();
  axiosGet.mockResolvedValue(listResponse(12, 1));
});

describe('LiveMentoringListPage', () => {
  it('한 페이지에 카드 12개(4×3)를 렌더한다', async () => {
    renderPage();
    await waitFor(() =>
      expect(
        screen.getByText('멘토1 멘토의 1:1 LIVE 멘토링'),
      ).toBeInTheDocument(),
    );
    expect(screen.getAllByRole('link')).toHaveLength(12);
  });

  it('기본은 1페이지·최신순으로 조회한다', async () => {
    renderPage();
    await waitFor(() =>
      expect(axiosGet).toHaveBeenCalledWith('/live-mentoring', {
        params: {
          page: 1,
          size: 12,
          categories: undefined,
          sortType: 'LATEST',
        },
        paramsSerializer: PARAMS_SERIALIZER,
      }),
    );
  });

  it('사이드바에서 카테고리를 체크하면 1페이지로 해당 카테고리를 조회한다', async () => {
    renderPage();
    await waitFor(() =>
      expect(
        screen.getByText('멘토1 멘토의 1:1 LIVE 멘토링'),
      ).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByText('포트폴리오'));

    await waitFor(() =>
      expect(axiosGet).toHaveBeenLastCalledWith('/live-mentoring', {
        params: {
          page: 1,
          size: 12,
          categories: ['PORTFOLIO'],
          sortType: 'LATEST',
        },
        paramsSerializer: PARAMS_SERIALIZER,
      }),
    );
  });

  it('카테고리를 여러 개 체크하면 함께 조회한다(다중 선택)', async () => {
    renderPage();
    await waitFor(() =>
      expect(
        screen.getByText('멘토1 멘토의 1:1 LIVE 멘토링'),
      ).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByText('포트폴리오'));
    fireEvent.click(screen.getByText('이력서'));

    await waitFor(() =>
      expect(axiosGet).toHaveBeenLastCalledWith('/live-mentoring', {
        params: {
          page: 1,
          size: 12,
          categories: ['PORTFOLIO', 'RESUME'],
          sortType: 'LATEST',
        },
        paramsSerializer: PARAMS_SERIALIZER,
      }),
    );
  });

  // 서버 `LiveMentoringSortType` 에 `LATEST` 하나만 남았다. 다른 값을 보내면 400 이므로
  // 셀렉트에 그 값이 남아 있지 않은 것까지 확인한다.
  it('정렬 셀렉트에 최신순만 노출하고, 사라진 정렬 옵션은 남기지 않는다', async () => {
    renderPage();
    await waitFor(() =>
      expect(
        screen.getByText('멘토1 멘토의 1:1 LIVE 멘토링'),
      ).toBeInTheDocument(),
    );

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveValue('LATEST');
    expect(options[0]).toHaveTextContent('최신순');
    expect(screen.queryByText('진행일정 빠른순')).not.toBeInTheDocument();
  });

  it('정렬을 바꿔도 sortType 은 LATEST 외 값을 보내지 않는다', async () => {
    renderPage();
    await waitFor(() =>
      expect(
        screen.getByText('멘토1 멘토의 1:1 LIVE 멘토링'),
      ).toBeInTheDocument(),
    );

    fireEvent.change(screen.getByLabelText('정렬'), {
      target: { value: 'LATEST' },
    });

    await waitFor(() =>
      expect(axiosGet).toHaveBeenLastCalledWith('/live-mentoring', {
        params: {
          page: 1,
          size: 12,
          categories: undefined,
          sortType: 'LATEST',
        },
        paramsSerializer: PARAMS_SERIALIZER,
      }),
    );
    expect(
      axiosGet.mock.calls.every(
        ([, config]) =>
          config.params.sortType === undefined ||
          config.params.sortType === 'LATEST',
      ),
    ).toBe(true);
  });

  it('목록 끝에 닿으면 다음 page 를 이어서 불러와 붙인다', async () => {
    axiosGet.mockResolvedValueOnce(listResponse(12, 2)).mockResolvedValueOnce({
      data: {
        data: {
          openingList: [makeOpening(13)],
          pageInfo: {
            pageNum: 2,
            pageSize: 12,
            totalElements: 13,
            totalPages: 2,
          },
        },
      },
    });
    renderPage();

    await waitFor(() =>
      expect(axiosGet).toHaveBeenLastCalledWith('/live-mentoring', {
        params: {
          page: 2,
          size: 12,
          categories: undefined,
          sortType: 'LATEST',
        },
        paramsSerializer: PARAMS_SERIALIZER,
      }),
    );
    await waitFor(() =>
      expect(
        screen.getByText('멘토13 멘토의 1:1 LIVE 멘토링'),
      ).toBeInTheDocument(),
    );
    expect(screen.getAllByRole('link')).toHaveLength(13);
  });
});
