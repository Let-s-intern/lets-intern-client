import { render, screen } from '@testing-library/react';
import MembershipLanding from './MembershipLanding';

// 이 테스트가 검증하는 것은 MembershipLanding 자신의 책임 — "어떤 섹션을 어떤 순서로
// 합치는가" 다. 섹션 내부 동작은 각 섹션의 테스트가 맡는다.
//
// LC-3294 에서 이게 특히 중요해졌다. 시안 1~15 는 선택지가 아니라 위에서 아래로 이어지는
// 한 장의 상세페이지이고, **순서 자체가 요구사항**이다. 섹션 하나를 빠뜨리거나 자리를
// 바꾸면 여기서 잡힌다.
//
// jest.mock 팩토리는 호이스팅되므로 공용 스텁 헬퍼를 참조할 수 없다. 그래서 하나씩 적는다.

jest.mock('./ui/MembershipAnimations', () => ({
  __esModule: true,
  default: () => <div data-testid="MembershipAnimations" />,
}));
jest.mock('./ui/MembershipNav', () => ({
  __esModule: true,
  default: () => <div data-testid="MembershipNav" />,
}));
jest.mock('./ui/ApplyBar', () => ({
  __esModule: true,
  default: () => <div data-testid="ApplyBar" />,
}));
jest.mock('./ui/MembershipPaymentSheet', () => ({
  __esModule: true,
  default: () => <div data-testid="MembershipPaymentSheet" />,
}));

jest.mock('./section/HeroSection', () => ({
  __esModule: true,
  default: () => <div data-testid="HeroSection" />,
}));
jest.mock('./section/RecommendSection', () => ({
  __esModule: true,
  default: () => <div data-testid="RecommendSection" />,
}));
jest.mock('./section/JobMarketSection', () => ({
  __esModule: true,
  default: () => <div data-testid="JobMarketSection" />,
}));
jest.mock('./section/RoadmapSection', () => ({
  __esModule: true,
  default: () => <div data-testid="RoadmapSection" />,
}));
jest.mock('./section/SolutionSection', () => ({
  __esModule: true,
  default: () => <div data-testid="SolutionSection" />,
}));
jest.mock('./section/PassBenefitsSection', () => ({
  __esModule: true,
  default: () => <div data-testid="PassBenefitsSection" />,
}));
jest.mock('./section/PathMatchSection', () => ({
  __esModule: true,
  default: () => <div data-testid="PathMatchSection" />,
}));
jest.mock('./section/CoursePlanSection', () => ({
  __esModule: true,
  default: () => <div data-testid="CoursePlanSection" />,
}));
jest.mock('./section/PlaybookDashboardSection', () => ({
  __esModule: true,
  default: () => <div data-testid="PlaybookDashboardSection" />,
}));
jest.mock('./section/ChallengeListSection', () => ({
  __esModule: true,
  default: () => <div data-testid="ChallengeListSection" />,
}));
jest.mock('./section/GuidebookListSection', () => ({
  __esModule: true,
  default: () => <div data-testid="GuidebookListSection" />,
}));
jest.mock('./section/MarketerVodSection', () => ({
  __esModule: true,
  default: () => <div data-testid="MarketerVodSection" />,
}));
jest.mock('./section/SpecialLiveSection', () => ({
  __esModule: true,
  default: () => <div data-testid="SpecialLiveSection" />,
}));
jest.mock('./section/MentoringCouponSection', () => ({
  __esModule: true,
  default: () => <div data-testid="MentoringCouponSection" />,
}));
jest.mock('./section/CompareSection', () => ({
  __esModule: true,
  default: () => <div data-testid="CompareSection" />,
}));
jest.mock('./section/PlansSection', () => ({
  __esModule: true,
  default: () => <div data-testid="PlansSection" />,
}));
jest.mock('./section/FaqSection', () => ({
  __esModule: true,
  default: () => <div data-testid="FaqSection" />,
}));

/** 시안 1~15 순서. 좌측 숫자가 시안 번호다. */
const EXPECTED_ORDER = [
  'HeroSection', //             시안 1
  'MembershipNav',
  'RecommendSection', //        시안 2
  'JobMarketSection', //        시안 3
  'RoadmapSection', //          시안 4
  'SolutionSection', //         시안 5
  'PassBenefitsSection', //     시안 6
  'PathMatchSection', //        시안 7
  'CoursePlanSection', //       시안 8
  'PlaybookDashboardSection', // 시안 9
  'ChallengeListSection', //    시안 10
  'GuidebookListSection', //    시안 11
  'MarketerVodSection', //      시안 12
  'SpecialLiveSection', //      시안 13
  'MentoringCouponSection', //  시안 14
  'CompareSection', //          시안 15
  'PlansSection', //            시안 15 (플랜 카드)
  'FaqSection',
  'ApplyBar',
  // 결제 시트는 섹션이 아니라 컨트롤러다. .membership-root 밖에 마운트되므로
  // 순서 목록의 맨 끝에 잡힌다.
  'MembershipPaymentSheet',
];

describe('MembershipLanding (LC-3294)', () => {
  it('섹션을 시안 1~15 순서대로 합친다', () => {
    const { container } = render(<MembershipLanding />);

    const rendered = [...container.querySelectorAll('[data-testid]')]
      .map((el) => el.getAttribute('testid') ?? el.getAttribute('data-testid'))
      .filter(
        (id): id is string => id !== null && id !== 'MembershipAnimations',
      );

    expect(rendered).toEqual(EXPECTED_ORDER);
  });

  /*
   * 시안에 없는 섹션은 렌더하지 않는다. 파일은 남아 있어서 import 한 줄이면 되살아나는데,
   * 실수로 되살아나면 시안에 없는 화면이 상품 페이지에 섞인다.
   */
  it('시안에 없는 기존 섹션은 렌더하지 않는다', () => {
    render(<MembershipLanding />);

    for (const removed of [
      'VodHookSection',
      'ChallengeScheduleSection',
      'CommunityChatSection',
      'ReviewsSection',
      'EarlyBirdBanner',
      'PartnerBenefitsSection',
      'FinalCtaSection',
    ]) {
      expect(screen.queryByTestId(removed)).not.toBeInTheDocument();
    }
  });

  it('결제 시트를 마운트한다', () => {
    render(<MembershipLanding />);
    expect(screen.getByTestId('MembershipPaymentSheet')).toBeInTheDocument();
  });
});
