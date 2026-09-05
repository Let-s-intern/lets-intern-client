import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';

import axios from '@/utils/axios';
import { useOrderDraftStore } from '../order/hooks/useOrderDraft';
import LiveMentoringDetailPage from './LiveMentoringDetailPage';

interface AuthState {
  isInitialized: boolean;
  isLoggedIn: boolean;
}
let authState: AuthState = { isInitialized: true, isLoggedIn: true };
jest.mock('@letscareer/store', () => ({
  useAuthStore: (selector: (s: AuthState) => unknown) => selector(authState),
}));

jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

// 시트의 `신청하기` 가 결제 페이지로 라우팅한다
const routerPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: routerPush, replace: jest.fn(), back: jest.fn() }),
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
        // 신청 생성 경로에 들어가는 개설 id. 스키마 필수라 픽스처에도 있어야 한다.
        openingId: 6,
        title: '포폴메이커 멘토의 1:1 멘토링',
        categories: ['PORTFOLIO'],
        durations: [60],
        durationPrices: [{ durationPriceId: 5, duration: 60, price: 60000 }],
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
                id: 7,
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

beforeEach(() => {
  axiosGet.mockReset();
  routerPush.mockClear();
  useOrderDraftStore.getState().clearDraft();
});

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

  it('히어로에 상품명·평점·멘티 수와 고를 수 있는 플랜을 보여준다', async () => {
    mockApis(detail());
    renderDetail();

    await waitFor(() =>
      // 히어로 제목 + 플랜 카드 제목 양쪽에 나온다
      expect(
        screen.getAllByText('포폴메이커 멘토의 1:1 멘토링').length,
      ).toBeGreaterThan(0),
    );
    expect(screen.getByText('후기 12건')).toBeInTheDocument();
    expect(
      screen.getByRole('radio', { name: /\[LIVE\] 1:1 멘토링 \(60분\)/ }),
    ).toBeEnabled();
  });

  /*
    히어로와 시트는 같은 상태를 본다. 히어로에서 고른 플랜을 시트가 다시 묻지 않는다.
  */
  it('히어로에서 고른 플랜이 시트에 그대로 반영된다', async () => {
    mockApis(detail());
    renderDetail();

    await waitFor(() =>
      expect(screen.getAllByText('지금 바로 신청')).toHaveLength(2),
    );

    fireEvent.click(
      screen.getByRole('radio', { name: /\[LIVE\] 1:1 멘토링 \(60분\)/ }),
    );
    fireEvent.click(screen.getAllByText('지금 바로 신청')[0]);

    const sheet = within(screen.getByRole('dialog'));
    expect(
      sheet.getByRole('radio', { name: /\[LIVE\] 1:1 멘토링 \(60분\)/ }),
    ).toBeChecked();
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

  /*
    예전에는 신청 버튼이 결제 준비 중 알럿만 띄웠다.
    알럿이 남아 있으면 브라우저가 멈춰 시트가 열려도 아무것도 못 한다.
  */
  /*
    상세는 비회원도 본다 — 상품을 봐야 가입할 이유가 생기고 검색 유입도 여기로
    들어온다. 막는 자리는 신청 시점이다. 챌린지(ChallengeCTAButtons)와 같다.

    시트를 열어 두고 제출 때 막지 않는 이유는, 슬롯·플랜을 다 고른 뒤에 튕기면
    그 선택이 사라지기 때문이다.
  */
  describe('비회원', () => {
    afterEach(() => {
      authState = { isInitialized: true, isLoggedIn: true };
    });

    it('신청 CTA 를 누르면 시트를 열지 않고 로그인으로 보낸다', async () => {
      authState = { isInitialized: true, isLoggedIn: false };
      mockApis(detail());
      renderDetail();

      await waitFor(() =>
        expect(screen.getAllByText('지금 바로 신청')).toHaveLength(2),
      );
      fireEvent.click(screen.getAllByText('지금 바로 신청')[0]);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(routerPush).toHaveBeenCalledTimes(1);
      expect(routerPush.mock.calls[0][0]).toContain('/login?redirect=');
    });

    it('상세 내용 자체는 그대로 보여준다', async () => {
      authState = { isInitialized: true, isLoggedIn: false };
      mockApis(detail());
      renderDetail();

      // 로그인 화면으로 갈아치우지 않는다 — 상품이 보여야 가입 동기가 생긴다.
      await waitFor(() =>
        expect(screen.getAllByText('지금 바로 신청')).toHaveLength(2),
      );
    });
  });

  it('신청 CTA 를 누르면 알럿 없이 신청 시트가 열린다', async () => {
    mockApis(detail());
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    renderDetail();

    await waitFor(() =>
      expect(screen.getAllByText('지금 바로 신청')).toHaveLength(2),
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    fireEvent.click(screen.getAllByText('지금 바로 신청')[0]);

    expect(
      screen.getByRole('dialog', { name: '1대1 멘토링 신청' }),
    ).toBeInTheDocument();
    expect(alertSpy).not.toHaveBeenCalled();
    alertSpy.mockRestore();
  });

  it('시트가 열려 있는 동안 배경 스크롤을 잠그고, 닫으면 되돌린다', async () => {
    mockApis(detail());
    renderDetail();

    await waitFor(() =>
      expect(screen.getAllByText('지금 바로 신청')).toHaveLength(2),
    );
    fireEvent.click(screen.getAllByText('지금 바로 신청')[0]);
    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.click(screen.getByRole('button', { name: '이전 단계로' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  /*
    신청 생성은 결제 페이지의 `결제하기` 시점이다(PRD 7-4 안 A). 시트의 `신청하기` 는
    선택값을 넘기고 이동만 한다 — 여기서 만들면 질문·쿠폰이 정해지기도 전에
    슬롯이 10분 선점된다.
  */
  it('시트에서 신청하기를 누르면 선택값을 넘기고 결제 페이지로 이동한다', async () => {
    // 기본 시드 슬롯은 9/1 과 9/30 이라 이어지지 않는다. 60분 플랜을 고르려면
    // 연속 2칸이 필요하므로 이 테스트만 붙어 있는 슬롯을 쓴다.
    mockApis(detail(), [
      {
        slotId: 1,
        startDate: '2030-09-01T10:00:00',
        endDate: '2030-09-01T10:30:00',
        status: 'OPEN',
      },
      {
        slotId: 2,
        startDate: '2030-09-01T10:30:00',
        endDate: '2030-09-01T11:00:00',
        status: 'OPEN',
      },
    ]);
    renderDetail();

    await waitFor(() =>
      expect(screen.getAllByText('지금 바로 신청')).toHaveLength(2),
    );
    fireEvent.click(screen.getAllByText('지금 바로 신청')[0]);

    const sheet = within(screen.getByRole('dialog'));
    fireEvent.click(
      sheet.getByRole('radio', { name: /\[LIVE\] 1:1 멘토링 \(60분\)/ }),
    );
    // 60분 플랜은 연속 두 칸이 버튼 하나로 합쳐져 있다
    fireEvent.click(sheet.getByRole('button', { name: '10:00 ~ 11:00' }));
    fireEvent.click(sheet.getByRole('radio', { name: '포트폴리오' }));
    fireEvent.click(sheet.getByRole('checkbox', { name: /예약 시간 변경/ }));
    fireEvent.click(sheet.getByRole('button', { name: '신청하기' }));

    expect(routerPush).toHaveBeenCalledWith('/live-mentoring/order?mentorId=3');

    const draft = useOrderDraftStore.getState().draft;
    expect(draft).toMatchObject({
      mentorId: 3,
      openingId: 6,
      duration: 60,
      price: 60000,
      mentoringCategory: 'PORTFOLIO',
      reservationChangeAgreed: true,
    });
    // 60분 플랜이라 연속 2칸이 함께 넘어간다
    expect(draft?.slots.map((slot) => slot.slotId)).toEqual([1, 2]);
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
