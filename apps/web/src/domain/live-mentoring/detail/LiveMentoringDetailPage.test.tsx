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

function detail(overrides: Record<string, unknown> = {}) {
  return {
    data: {
      data: {
        mentorId: 3,
        title: '포폴메이커 멘토의 1:1 멘토링',
        categories: ['PORTFOLIO'],
        durations: [60],
        durationPrices: [{ duration: 60, price: 60000 }],
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
          categories: ['PORTFOLIO'],
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

/** 예약 가능 슬롯 기본 시드 — 진행기간이 "09월 01일 ~ 09월 30일" 로 잡힌다. */
const SLOTS = [
  {
    slotId: 1,
    startDate: '2030-09-01T10:00:00',
    endDate: '2030-09-01T10:30:00',
    status: 'OPEN',
  },
  {
    slotId: 2,
    startDate: '2030-09-30T17:00:00',
    endDate: '2030-09-30T17:30:00',
    status: 'OPEN',
  },
];

/**
 * 상세와 슬롯은 별개의 API 다. URL 로 갈라 응답한다.
 * 상세 응답에는 기간이 없어 진행기간은 슬롯에서만 나온다.
 */
function mockApis(detailResponse: unknown, slots: unknown[] = SLOTS) {
  axiosGet.mockImplementation((url: string) =>
    url.endsWith('/slots')
      ? Promise.resolve({ data: { data: { liveMentoringSlotList: slots } } })
      : Promise.resolve(detailResponse),
  );
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
  it('편집 섹션(소개·유형·전략·영상·결과사례)과 고정 이미지 섹션을 렌더한다', async () => {
    mockApis(detail());
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
    mockApis(detail());
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
    mockApis(detailData);
    renderDetail();

    await waitFor(() =>
      expect(screen.getByText('포트폴리오 피드백')).toBeInTheDocument(),
    );
    expect(screen.queryByText('핵심 키워드 5가지')).not.toBeInTheDocument();
    expect(screen.queryByText('서류 완성도 UP!')).not.toBeInTheDocument();
  });

  it('후기 노출 off 면 후기 섹션을 렌더하지 않는다', async () => {
    mockApis(
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
    mockApis(detail());
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
    mockApis(detail());
    renderDetail();

    await waitFor(() =>
      expect(
        screen.getByText('- 이력서, 자기소개서, 포트폴리오 피드백 및 첨삭'),
      ).toBeInTheDocument(),
    );
  });

  /*
    상세 응답에는 기간이 없다. 진행기간은 슬롯 API 의
    첫 슬롯 시작 ~ 마지막 슬롯 종료로 만든다.
  */
  it('예약 가능 슬롯이 있으면 첫 시작 ~ 마지막 종료를 진행기간으로 보여준다', async () => {
    mockApis(detail());
    renderDetail();

    await waitFor(() =>
      expect(screen.getByText('멘토 자기소개 본문')).toBeInTheDocument(),
    );
    // 히어로와 진행 프로세스(시안 7) 두 곳에 같은 값이 들어간다
    expect(
      screen.getAllByText('2030년 09월 01일(일) ~ 09월 30일(월)'),
    ).toHaveLength(2);
    expect(axiosGet).toHaveBeenCalledWith('/live-mentoring/mentors/3/slots');
  });

  it('예약 가능 슬롯이 없으면 진행기간 자리에 오픈 준비 중을 보여준다', async () => {
    mockApis(detail(), []);
    renderDetail();

    await waitFor(() =>
      expect(screen.getByText('멘토 자기소개 본문')).toBeInTheDocument(),
    );
    expect(screen.getAllByText('오픈 준비 중')).toHaveLength(2);
  });

  it('예약 가능 슬롯이 없어도 하단 신청 바를 감추지 않고 비활성으로 남긴다', async () => {
    mockApis(detail(), []);
    renderDetail();

    await waitFor(() =>
      expect(screen.getByText('멘토 자기소개 본문')).toBeInTheDocument(),
    );
    const buttons = screen.getAllByRole('button', {
      name: '현재 예약 가능한 일정이 없습니다',
    });
    expect(buttons).toHaveLength(2);
    buttons.forEach((button) => expect(button).toBeDisabled());
    expect(screen.queryByText('출시알림신청')).not.toBeInTheDocument();
  });

  it('예약 가능 슬롯이 있으면 하단 신청 바가 정상 동작한다', async () => {
    mockApis(detail());
    renderDetail();

    await waitFor(() =>
      expect(screen.getByText('멘토 자기소개 본문')).toBeInTheDocument(),
    );
    expect(screen.getAllByText('지금 바로 신청')).toHaveLength(2);
    expect(
      screen.queryByText('현재 예약 가능한 일정이 없습니다'),
    ).not.toBeInTheDocument();
  });

  // ⚠️ 임시 — 백엔드 연동 후 이 케이스는 일반 오류 문구 단언으로 되돌릴 것.
  //    상세 조건은 UnderDevelopmentNotice.tsx 상단 주석 참고.
  it('상세 조회에 실패하면 담당자와 함께 개발 중 안내를 노출한다', async () => {
    axiosGet.mockRejectedValue(new Error('500'));
    renderDetail();

    await waitFor(() =>
      expect(screen.getByText('개발 중인 페이지입니다.')).toBeInTheDocument(),
    );
    expect(screen.getByText('담당자 임성빈')).toBeInTheDocument();
  });
});
