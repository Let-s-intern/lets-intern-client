import { render, screen } from '@testing-library/react';
import { MARKETER_VOD } from './data/marketerVod';
import { MENTORING_COUPON } from './data/mentoringCoupon';
import { RECOMMEND } from './data/recommend';
import { ROADMAP } from './data/roadmap';
import { SPECIAL_LIVE } from './data/specialLive';
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
jest.mock('./section/RealTalkSection', () => ({
  __esModule: true,
  default: () => <div data-testid="RealTalkSection" />,
}));
jest.mock('./section/CheckupSection', () => ({
  __esModule: true,
  default: () => <div data-testid="CheckupSection" />,
}));
jest.mock('./section/CheckupResultSection', () => ({
  __esModule: true,
  default: () => <div data-testid="CheckupResultSection" />,
}));
jest.mock('./section/JobMarketSection', () => ({
  __esModule: true,
  default: () => <div data-testid="JobMarketSection" />,
}));
jest.mock('./section/PrepStepsSection', () => ({
  __esModule: true,
  default: () => <div data-testid="PrepStepsSection" />,
}));
jest.mock('./section/PassResultsSection', () => ({
  __esModule: true,
  default: () => <div data-testid="PassResultsSection" />,
}));
jest.mock('./section/PassIntroSection', () => ({
  __esModule: true,
  default: () => <div data-testid="PassIntroSection" />,
}));
jest.mock('./section/LiveClinicSection', () => ({
  __esModule: true,
  default: () => <div data-testid="LiveClinicSection" />,
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
jest.mock('./section/PlaybookIntroSection', () => ({
  __esModule: true,
  default: () => <div data-testid="PlaybookIntroSection" />,
}));
jest.mock('./section/CoursePlanSection', () => ({
  __esModule: true,
  default: () => <div data-testid="CoursePlanSection" />,
}));
jest.mock('./section/PlaybookDashboardSection', () => ({
  __esModule: true,
  default: () => <div data-testid="PlaybookDashboardSection" />,
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
  'RealTalkSection', //         개편 시안 1
  'CheckupSection', //          개편 시안 2
  'CheckupResultSection', //    개편 시안 3
  'JobMarketSection', //        시안 3
  'PrepStepsSection', //        개편 시안 4 (RoadmapSection 자리)
  'PassResultsSection', //      개편 시안 5
  'PassIntroSection', //        개편 시안 6 (혜택 4종이 모달로)
  'LiveClinicSection', //       개편 시안 7 (SpecialLiveSection 자리)
  'SolutionSection', //         시안 5
  'PassBenefitsSection', //     시안 6
  'PathMatchSection', //        시안 7
  'PlaybookIntroSection', //    개편 시안 8 (매트릭스 바로 위)
  'CoursePlanSection', //       개편 시안 9
  'PlaybookDashboardSection', // 개편 시안 10 (세 덩어리)
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
      // 고민 3카드. 개편에서 REAL TALK 이 이 자리를 대신하며 빠졌다.
      'RecommendSection',
      // STEP 01~05 세로 목록. 준비 단계 카드 7장이 이 자리를 대신한다.
      'RoadmapSection',
      'VodHookSection',
      'ChallengeScheduleSection',
      'CommunityChatSection',
      'ReviewsSection',
      'EarlyBirdBanner',
      'PartnerBenefitsSection',
      'FinalCtaSection',
      // 아래 넷은 내용이 패스 소개의 혜택 모달로 들어가면서 섹션에서 빠졌다.
      'ChallengeListSection',
      'GuidebookListSection',
      'MarketerVodSection',
      'MentoringCouponSection',
      // 쥬디 클리닉은 LiveClinicSection 이 대신한다.
      'SpecialLiveSection',
    ]) {
      expect(screen.queryByTestId(removed)).not.toBeInTheDocument();
    }
  });

  /*
   * 플레이북 세 화면의 순서는 인트로 → 매트릭스 → 대시보드다. 인트로가 매트릭스가
   * 무엇인지 먼저 말해 주고, 대시보드가 그 매트릭스를 어떻게 굴리는지 잇는다.
   * 자리가 바뀌면 설명이 대상보다 뒤에 온다.
   */
  it('플레이북 인트로가 매트릭스 위에, 대시보드가 매트릭스 아래에 온다', () => {
    const { container } = render(<MembershipLanding />);

    const ids = [...container.querySelectorAll('[data-testid]')].map((el) =>
      el.getAttribute('data-testid'),
    );

    expect(ids.indexOf('PlaybookIntroSection')).toBeLessThan(
      ids.indexOf('CoursePlanSection'),
    );
    expect(ids.indexOf('CoursePlanSection')).toBeLessThan(
      ids.indexOf('PlaybookDashboardSection'),
    );
  });

  it('개편 시안 5·6·7 세 섹션이 준비 단계 뒤에 들어와 있다', () => {
    render(<MembershipLanding />);

    for (const added of [
      'PassResultsSection',
      'PassIntroSection',
      'LiveClinicSection',
    ]) {
      expect(screen.getByTestId(added)).toBeInTheDocument();
    }
  });

  /*
   * 빠진 네 섹션은 mock 대상이 아니라 되살아나도 testid 가 붙지 않는다. 섹션 제목으로
   * 한 번 더 못박는다 — 모달 안에도 같은 문구가 있지만 모달은 눌러야 열린다.
   */
  it('모달로 들어간 네 섹션의 제목이 페이지에 남아 있지 않다', () => {
    render(<MembershipLanding />);

    for (const title of [
      '취준 필수 챌린지 참여 10종 - 베이직',
      '취준 필수 가이드북 7종',
      MARKETER_VOD.title,
      MENTORING_COUPON.mentorsTitle,
      SPECIAL_LIVE.clinic.title,
    ]) {
      expect(screen.queryByText(title)).not.toBeInTheDocument();
    }
  });

  /*
   * 위 목록은 data-testid 로만 확인한다. RecommendSection·RoadmapSection 은 더 이상
   * mock 대상이 아니라서 되살아나도 testid 가 붙지 않는다 — 실제 문구로 한 번 더 못박는다.
   */
  it('고민 3카드와 기존 STEP 목록의 문구가 화면에 남아 있지 않다', () => {
    render(<MembershipLanding />);

    for (const card of RECOMMEND.cards) {
      expect(screen.queryByText(card.title)).not.toBeInTheDocument();
    }
    for (const step of ROADMAP.steps) {
      expect(screen.queryByText(step.title)).not.toBeInTheDocument();
    }
  });

  it('결제 시트를 마운트한다', () => {
    render(<MembershipLanding />);
    expect(screen.getByTestId('MembershipPaymentSheet')).toBeInTheDocument();
  });
});
