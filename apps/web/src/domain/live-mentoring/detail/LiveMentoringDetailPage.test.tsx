import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';

import axios from '@/utils/axios';
import LiveMentoringDetailPage from './LiveMentoringDetailPage';

jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

const axiosGet = axios.get as jest.Mock;

// jsdom 에는 IntersectionObserver 가 없다 — 앵커 네비의 스크롤 스파이용 폴리필.
beforeAll(() => {
  global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
    root = null;
    rootMargin = '';
    thresholds = [];
  } as unknown as typeof IntersectionObserver;
});

/**
 * 신청 CTA 문구는 오늘이 신청 기간에 포함되는지로 갈린다.
 * 픽스처 기간(2026-07-18 ~ 08-01) 안쪽으로 시계를 고정하지 않으면
 * 그 기간이 지나는 순간 테스트가 깨진다 — 실제로 08-02 에 깨졌다.
 * 기간 표기까지 단언하므로 픽스처는 고정 날짜로 두고 시계를 묶는다.
 */
const FROZEN_TODAY = new Date('2026-07-25T09:00:00+09:00');

beforeEach(() => {
  // advanceTimers 를 켜야 waitFor 의 폴링이 멈추지 않는다.
  jest.useFakeTimers({ advanceTimers: true });
  jest.setSystemTime(FROZEN_TODAY);
});

afterEach(() => {
  jest.useRealTimers();
});

function detail(overrides: Record<string, unknown> = {}) {
  return {
    data: {
      data: {
        // 상품·개설·멘토 식별자는 서로 다른 대역이다(목과 같은 규칙).
        liveMentoringId: 103,
        openingId: 203,
        mentorId: 3,
        title: '포폴메이커 멘토의 1:1 멘토링',
        categories: ['PORTFOLIO'],
        durations: [60],
        durationPrices: [{ duration: 60, price: 60000 }],
        price: 60000,
        rating: 4.8,
        reviewCount: 12,
        feedbackStartDate: '2026-07-18',
        feedbackEndDate: '2026-08-01',
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
          hero: {
            bullets: [
              '이력서, 자기소개서, 포트폴리오 피드백 및 첨삭',
              '다양한 커리어 고민에 대한 자유로운 QNA',
            ],
          },
          intro: {
            passedCount: 250,
            profileImage: null,
            affiliation: '카카오 | 디자이너',
            careerLines: ['카카오 | 디자이너 (3년)'],
            oneLiner: '멘토 자기소개 본문',
          },
          mentoringTypes: {
            title: '이런 도움을 받을 수 있어요',
            subtitle: '고민에 맞는 유형을 골라보세요.',
            items: [
              {
                typeName: '포트폴리오 피드백',
                title: '핵심 역량을 점검받고 싶다면',
                description: '프로젝트 구성을 점검할 수 있어요.',
                tags: ['구성 점검', '역량 강조'],
              },
            ],
          },
          strategy: {
            visible: true,
            title: '취업 성공 전략',
            subtitle: '멘토링을 통해 다 알려드립니다.',
            points: [
              {
                image: null,
                title: '핵심 키워드 5가지',
                description: '전략 설명',
              },
            ],
          },
          video: {
            visible: true,
            title: '이렇게 도와드려요',
            subtitle: '영상으로 미리 확인하세요!',
            videoUrl: 'https://www.youtube.com/embed/xyz',
            caption: '서류 완성도 UP!',
          },
          results: {
            visible: true,
            title: '함께 완성해요',
            subtitle: '결과 사례',
            cases: [
              {
                beforeImage: null,
                afterImage: null,
                beforeCaption: '추상적인 지원동기',
                afterCaption: '경험 연결',
              },
            ],
          },
          reviews: { visible: true, selectedReviewIds: [10] },
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
        challenges: [
          { challengeId: 31, title: '포트폴리오 완성 챌린지', thumbnail: null },
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
      <LiveMentoringDetailPage liveMentoringId="103" />
    </QueryClientProvider>,
  );
}

beforeEach(() => axiosGet.mockReset());

describe('LiveMentoringDetailPage', () => {
  it('멘토가 아니라 상품 기준 경로로 상세를 조회한다', async () => {
    axiosGet.mockResolvedValue(detail());
    renderDetail();

    await waitFor(() =>
      expect(axiosGet).toHaveBeenCalledWith('/live-mentoring/103'),
    );
  });

  it('편집 섹션(소개·유형·전략·영상·결과사례)과 고정 이미지 섹션을 렌더한다', async () => {
    axiosGet.mockResolvedValue(detail());
    renderDetail();

    await waitFor(() =>
      expect(screen.getByText('멘토 자기소개 본문')).toBeInTheDocument(),
    );
    expect(
      screen.getByText(/확실한 전략으로 250명을 합격시킨/),
    ).toBeInTheDocument();
    expect(screen.getByText('포트폴리오 피드백')).toBeInTheDocument();
    expect(screen.getByText('핵심 키워드 5가지')).toBeInTheDocument();
    expect(screen.getByText('서류 완성도 UP!')).toBeInTheDocument();
    expect(screen.getByText('✓ 경험 연결')).toBeInTheDocument();
    // 운영 확정 마케팅 섹션(플랜·진행 프로세스·다른 멘토·FAQ)은 시안 이미지로 나간다
    expect(screen.getByAltText(/특별 혜택/)).toBeInTheDocument();
    expect(screen.getByAltText(/플랜 안내/)).toBeInTheDocument();
    // 진행 프로세스·FAQ 는 마크업으로 구현한다
    expect(screen.getByText('멘토링은 이렇게 진행돼요!')).toBeInTheDocument();
    expect(screen.getByText('궁금한 점이 있으신가요?')).toBeInTheDocument();
    // 히어로 가격 + 플랜 옵션 가격 양쪽에 나온다
    expect(screen.getAllByText('60,000원').length).toBeGreaterThan(0);
  });

  it('노출 선택된 후기만 보여주고, 경력 줄을 노출한다', async () => {
    axiosGet.mockResolvedValue(detail());
    renderDetail();

    await waitFor(() =>
      expect(screen.getByText('좋았어요')).toBeInTheDocument(),
    );
    expect(screen.queryByText('선택안됨')).not.toBeInTheDocument();
    // 소속 줄과 경력 줄 양쪽에 나타난다
    expect(screen.getAllByText(/카카오/).length).toBeGreaterThan(0);
  });

  it('노출 off 섹션은 상세에서 완전히 제외한다', async () => {
    const detailData = detail();
    detailData.data.data.template.strategy.visible = false;
    detailData.data.data.template.video.visible = false;
    axiosGet.mockResolvedValue(detailData);
    renderDetail();

    await waitFor(() =>
      expect(screen.getByText('포트폴리오 피드백')).toBeInTheDocument(),
    );
    expect(screen.queryByText('핵심 키워드 5가지')).not.toBeInTheDocument();
    expect(screen.queryByText('서류 완성도 UP!')).not.toBeInTheDocument();
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

  it('히어로에 상품명·평점·멘티 수와 플랜을 보여주고, 플랜 선택은 잠겨 있다', async () => {
    axiosGet.mockResolvedValue(detail());
    renderDetail();

    await waitFor(() =>
      // 히어로 제목 + 플랜 카드 제목 양쪽에 나온다
      expect(
        screen.getAllByText('포폴메이커 멘토의 1:1 멘토링').length,
      ).toBeGreaterThan(0),
    );
    expect(screen.getByText('후기 12건')).toBeInTheDocument();
    // 결제 연동 전이라 플랜 체크박스는 비활성
    expect(
      screen.getByRole('checkbox', { name: /\[LIVE\] 1:1 멘토링 \(60분\)/ }),
    ).toBeDisabled();
  });

  it('히어로 불릿을 노출한다', async () => {
    axiosGet.mockResolvedValue(detail());
    renderDetail();

    await waitFor(() =>
      expect(
        screen.getByText('- 이력서, 자기소개서, 포트폴리오 피드백 및 첨삭'),
      ).toBeInTheDocument(),
    );
  });

  it('개설이 있으면 기간·가격·신청 CTA 를 모두 노출한다', async () => {
    axiosGet.mockResolvedValue(detail());
    renderDetail();

    await waitFor(() =>
      expect(screen.getByText('멘토 자기소개 본문')).toBeInTheDocument(),
    );
    expect(screen.queryAllByText(/진행 기간/).length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/2026년 07월 18일\(토\) ~ 08월 01일\(토\)/).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('60,000원').length).toBeGreaterThan(0);
    expect(screen.getAllByText('지금 바로 신청').length).toBeGreaterThan(0);
  });

  /*
   * 개설 없는 상품 — 상세만 저장하고 승인·개설을 아직 안 한 상태.
   * 서버가 200 으로 내려주므로 화면은 떠야 하고, 판매에서 파생되는 값만 빠진다.
   */
  it('개설이 없으면 기간·가격·신청 CTA 를 렌더하지 않고 상세 콘텐츠만 보여준다', async () => {
    axiosGet.mockResolvedValue(
      detail({
        openingId: null,
        durations: [],
        durationPrices: [],
        price: null,
        feedbackStartDate: null,
        feedbackEndDate: null,
      }),
    );
    renderDetail();

    // 상세 콘텐츠(시안 0~10)는 그대로 렌더된다
    await waitFor(() =>
      expect(screen.getByText('멘토 자기소개 본문')).toBeInTheDocument(),
    );
    expect(screen.getByText('포트폴리오 피드백')).toBeInTheDocument();
    expect(screen.getByText('멘토링은 이렇게 진행돼요!')).toBeInTheDocument();
    expect(screen.getByText('궁금한 점이 있으신가요?')).toBeInTheDocument();
    expect(
      screen.getAllByText('포폴메이커 멘토의 1:1 멘토링').length,
    ).toBeGreaterThan(0);

    // 기간(히어로 바 + 진행 프로세스 카드)
    expect(screen.queryAllByText(/진행 기간/)).toEqual([]);
    expect(screen.queryByText(/2026년 07월 18일/)).not.toBeInTheDocument();
    // 진행 방식은 기간과 무관하므로 그대로 남는다
    expect(screen.getByText('진행 방식')).toBeInTheDocument();

    // 가격·플랜
    expect(screen.queryByText('60,000원')).not.toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();

    // 하단 고정 신청 CTA
    expect(screen.queryByText('지금 바로 신청')).not.toBeInTheDocument();
  });

  // 서버가 아직 후기를 주지 않는다(`reviews: []`·`reviewCount: 0` 고정).
  // 노출 토글이 켜져 있어도 섹션이 빠지는 것이 의도된 동작이다.
  it('노출 on 이어도 후기가 비어 있으면 후기 섹션을 렌더하지 않는다', async () => {
    axiosGet.mockResolvedValue(detail({ reviews: [], reviewCount: 0 }));
    renderDetail();

    await waitFor(() =>
      expect(screen.getByText('멘토 자기소개 본문')).toBeInTheDocument(),
    );
    expect(screen.queryByText(/솔직한 멘토링 후기/)).not.toBeInTheDocument();
    expect(screen.queryByText('좋았어요')).not.toBeInTheDocument();
  });

  it('없는 상품(404)이면 찾을 수 없다고 알린다', async () => {
    axiosGet.mockRejectedValue({
      isAxiosError: true,
      response: { status: 404 },
    });
    renderDetail();

    await waitFor(() =>
      expect(
        screen.getByText('해당 멘토링을 찾을 수 없습니다.'),
      ).toBeInTheDocument(),
    );
    expect(
      screen.queryByText('멘토 정보를 불러오지 못했습니다.'),
    ).not.toBeInTheDocument();
  });

  it('그 밖의 오류(500)면 일반 조회 실패 문구를 노출한다', async () => {
    axiosGet.mockRejectedValue({
      isAxiosError: true,
      response: { status: 500 },
    });
    renderDetail();

    await waitFor(() =>
      expect(
        screen.getByText('멘토 정보를 불러오지 못했습니다.'),
      ).toBeInTheDocument(),
    );
    expect(
      screen.queryByText('해당 멘토링을 찾을 수 없습니다.'),
    ).not.toBeInTheDocument();
  });
});
