import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import axios from '@/utils/axios';
import DetailMentorReviewSection from './DetailMentorReviewSection';

jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

const axiosGet = axios.get as jest.Mock;

/** 본문이 `후기 n` 인 후기 n개. 뒤로 갈수록 최신이고 점수는 1~5 를 돈다. */
function reviews(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    score: (i % 5) + 1,
    programTitle: '포트폴리오 챌린지',
    review: `후기 ${i + 1}`,
    createDate: `2026-06-${String(i + 1).padStart(2, '0')}T10:00:00`,
  }));
}

function mockApis(reviewList: unknown[]) {
  axiosGet.mockImplementation((url: string) =>
    url.endsWith('/stats')
      ? Promise.resolve({
          data: {
            data: {
              feedbackMenteeCount: 30,
              reviewCount: 40,
              averageScore: 4.5,
            },
          },
        })
      : Promise.resolve({
          data: {
            data: {
              mentorInfo: {
                mentorId: 3,
                nickname: '포폴메이커',
                description: null,
                profileImgUrl: null,
                corpImgUrl: null,
                company: null,
                job: null,
              },
              careerList: [],
              proceedingProgramList: [],
              postProgramList: [],
              reviewList,
            },
          },
        }),
  );
}

function renderSection() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return render(
    <QueryClientProvider client={client}>
      <DetailMentorReviewSection id="review" mentorId="3" />
    </QueryClientProvider>,
  );
}

const shownReviews = () =>
  screen.getAllByText(/^후기 \d+$/).map((el) => el.textContent);

beforeEach(() => {
  axiosGet.mockReset();
});

describe('DetailMentorReviewSection', () => {
  it('멘토 프로필과 같은 API 로 후기 수·평균 평점과 처음 5개를 보여준다', async () => {
    mockApis(reviews(12));
    renderSection();

    expect(await screen.findByText('40개의 후기')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(shownReviews()).toHaveLength(5);
    expect(axiosGet).toHaveBeenCalledWith('/mentor/3');
    expect(axiosGet).toHaveBeenCalledWith('/mentor/3/stats');
  });

  it('더보기를 누를 때마다 5개씩 더 보이고, 다 보이면 버튼을 숨긴다', async () => {
    mockApis(reviews(12));
    renderSection();

    fireEvent.click(await screen.findByRole('button', { name: '더보기' }));
    expect(shownReviews()).toHaveLength(10);

    fireEvent.click(screen.getByRole('button', { name: '더보기' }));
    expect(shownReviews()).toHaveLength(12);
    expect(
      screen.queryByRole('button', { name: '더보기' }),
    ).not.toBeInTheDocument();
  });

  it('후기가 5개 이하면 더보기를 보여주지 않는다', async () => {
    mockApis(reviews(5));
    renderSection();

    await screen.findByText('40개의 후기');
    expect(shownReviews()).toHaveLength(5);
    expect(
      screen.queryByRole('button', { name: '더보기' }),
    ).not.toBeInTheDocument();
  });

  it('기본은 높은 평점순이고, 최신순으로 바꾸면 다시 5개부터 보여준다', async () => {
    mockApis(reviews(12));
    renderSection();

    await screen.findByText('40개의 후기');
    // 5점은 5·10번째 후기 — 같은 점수면 최신이 먼저다
    expect(shownReviews().slice(0, 2)).toEqual(['후기 10', '후기 5']);

    fireEvent.click(screen.getByRole('button', { name: '더보기' }));
    expect(shownReviews()).toHaveLength(10);

    fireEvent.change(screen.getByRole('combobox', { name: '후기 정렬' }), {
      target: { value: 'LATEST' },
    });
    expect(shownReviews()).toEqual([
      '후기 12',
      '후기 11',
      '후기 10',
      '후기 9',
      '후기 8',
    ]);
  });

  it('후기가 없으면 섹션을 렌더하지 않는다', async () => {
    mockApis([]);
    const { container } = renderSection();

    await waitFor(() => expect(axiosGet).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(container).toBeEmptyDOMElement());
    expect(screen.queryByText('후기')).not.toBeInTheDocument();
  });

  it('조회에 실패하면 섹션을 렌더하지 않는다', async () => {
    axiosGet.mockRejectedValue(new Error('500'));
    const { container } = renderSection();

    await waitFor(() => expect(axiosGet).toHaveBeenCalledTimes(2));
    expect(container).toBeEmptyDOMElement();
  });
});
