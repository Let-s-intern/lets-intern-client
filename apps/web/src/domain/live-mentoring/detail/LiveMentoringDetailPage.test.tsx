import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';

import axios from '@/utils/axios';
import LiveMentoringDetailPage from './LiveMentoringDetailPage';

jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

const axiosGet = axios.get as jest.Mock;

function detail(overrides: Record<string, unknown> = {}) {
  return {
    data: {
      data: {
        mentorId: 3,
        category: 'PORTFOLIO',
        durationMin: 50,
        price: 60000,
        rating: 4.8,
        reviewCount: 12,
        profile: {
          visible: true,
          mosaicEnabled: false,
          mosaicBlur: 0,
          nickname: '포폴메이커',
          profileImage: 'https://example.com/p.png',
          introduction: '프로필 소개',
          careers: [],
        },
        template: {
          category: 'PORTFOLIO',
          faq: [{ q: '환불되나요', a: '네' }],
          process: [{ step: 1, title: '사전질문', desc: '작성' }],
          submissionSpec: { title: '포트폴리오 PDF', desc: '10p 이내' },
          introduction: '멘토 자기소개 본문',
          careers: [
            {
              company: '카카오',
              position: '디자이너',
              period: '3년',
              visible: true,
            },
            {
              company: '숨김회사',
              position: 'x',
              period: '1년',
              visible: false,
            },
          ],
          mentoringPoints: '스토리라인 위주',
          reviews: { visible: true, selectedReviewIds: [10] },
          checklist: [
            { id: 1, label: '노출항목', mode: 'SHOWN' },
            { id: 2, label: '숨김항목', mode: 'HIDDEN' },
            { id: 3, label: '기본', mode: 'CUSTOM', customText: '커스텀항목' },
          ],
        },
        reviews: [
          {
            reviewId: 10,
            menteeName: '김**',
            score: 5,
            content: '좋았어요',
            createdAt: '2026-06-01',
          },
          {
            reviewId: 11,
            menteeName: '이**',
            score: 4,
            content: '선택안됨',
            createdAt: '2026-06-02',
          },
        ],
        ...(overrides as object),
      },
    },
  };
}

function renderDetail() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return render(
    <QueryClientProvider client={client}>
      <LiveMentoringDetailPage mentorId="3" />
    </QueryClientProvider>,
  );
}

beforeEach(() => axiosGet.mockReset());

describe('LiveMentoringDetailPage', () => {
  it('편집 가능 콘텐츠(자기소개·멘토링포인트)와 편집 불가 섹션(FAQ·과정·제출물)을 렌더한다', async () => {
    axiosGet.mockResolvedValue(detail());
    renderDetail();

    await waitFor(() =>
      expect(screen.getByText('멘토 자기소개 본문')).toBeInTheDocument(),
    );
    expect(screen.getByText('스토리라인 위주')).toBeInTheDocument();
    expect(screen.getByText('자주 묻는 질문')).toBeInTheDocument();
    expect(screen.getByText('피드백 과정')).toBeInTheDocument();
    expect(screen.getByText('포트폴리오 PDF')).toBeInTheDocument();
    expect(screen.getByText('60,000원')).toBeInTheDocument();
  });

  it('노출 선택된 후기만 보여주고, visible 이력만 노출한다', async () => {
    axiosGet.mockResolvedValue(detail());
    renderDetail();

    await waitFor(() =>
      expect(screen.getByText('좋았어요')).toBeInTheDocument(),
    );
    expect(screen.queryByText('선택안됨')).not.toBeInTheDocument();
    expect(screen.getByText(/카카오/)).toBeInTheDocument();
    expect(screen.queryByText(/숨김회사/)).not.toBeInTheDocument();
  });

  it('체크리스트는 HIDDEN 제외, CUSTOM 은 customText 로 노출한다', async () => {
    axiosGet.mockResolvedValue(detail());
    renderDetail();

    await waitFor(() =>
      expect(screen.getByText('노출항목')).toBeInTheDocument(),
    );
    expect(screen.getByText('커스텀항목')).toBeInTheDocument();
    expect(screen.queryByText('숨김항목')).not.toBeInTheDocument();
  });

  it('후기 노출 off 면 후기 섹션을 렌더하지 않는다', async () => {
    axiosGet.mockResolvedValue(
      detail({
        template: {
          ...(detail().data.data.template as object),
          reviews: { visible: false, selectedReviewIds: [10] },
        },
      }),
    );
    renderDetail();

    await waitFor(() =>
      expect(screen.getByText('멘토 자기소개 본문')).toBeInTheDocument(),
    );
    expect(screen.queryByText('멘티 후기')).not.toBeInTheDocument();
  });

  it('신청 CTA 는 비활성이다', async () => {
    axiosGet.mockResolvedValue(detail());
    renderDetail();

    await waitFor(() =>
      expect(screen.getByRole('button', { name: /신청하기/ })).toBeDisabled(),
    );
  });
});
