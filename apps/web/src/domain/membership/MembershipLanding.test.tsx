import { render, screen } from '@testing-library/react';
import MembershipLanding from './MembershipLanding';

// 이 테스트가 검증하는 것은 MembershipLanding 자신의 책임 — "어떤 섹션을 어떤 순서로 합치는가" 다.
// 섹션 내부 동작은 각 섹션의 테스트가 맡는다. 그래서 섹션을 전부 가벼운 스텁으로 대체한다.
//
// 이렇게 하면 (1) react-query·라우터 같은 데이터 계층을 끌어오지 않아 깨질 일이 없고
// (2) 섹션 하나를 주석 처리했을 때 이 테스트가 바로 잡아낸다.
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
jest.mock('./section/RoadmapSection', () => ({
  __esModule: true,
  default: () => <div data-testid="RoadmapSection" />,
}));
jest.mock('./section/CompareSection', () => ({
  __esModule: true,
  default: () => <div data-testid="CompareSection" />,
}));
jest.mock('./section/ChallengeScheduleSection', () => ({
  __esModule: true,
  default: () => <div data-testid="ChallengeScheduleSection" />,
}));
jest.mock('./section/SolutionSection', () => ({
  __esModule: true,
  default: () => <div data-testid="SolutionSection" />,
}));
jest.mock('./section/CoursePlanSection', () => ({
  __esModule: true,
  default: () => <div data-testid="CoursePlanSection" />,
}));
jest.mock('./section/BenefitsSection', () => ({
  __esModule: true,
  default: () => <div data-testid="BenefitsSection" />,
}));
jest.mock('./section/PlansSection', () => ({
  __esModule: true,
  default: () => <div data-testid="PlansSection" />,
}));
jest.mock('./section/ReviewsSection', () => ({
  __esModule: true,
  default: () => <div data-testid="ReviewsSection" />,
}));
jest.mock('./section/FinalCtaSection', () => ({
  __esModule: true,
  default: () => <div data-testid="FinalCtaSection" />,
}));
jest.mock('./section/FaqSection', () => ({
  __esModule: true,
  default: () => <div data-testid="FaqSection" />,
}));

/**
 * `<main>` 안에 렌더되는 순서. LC-3219 시안 순서를 그대로 옮긴 것이다.
 *
 * 얼리버드 배너·VOD 훅·추천 대상·세미나·제휴 혜택은 시안에 없어 뺐다.
 * 이 배열이 그 사실을 고정한다 — 누가 되살리면 순서 비교가 실패한다.
 */
const EXPECTED_ORDER = [
  'MembershipAnimations',
  'HeroSection',
  'MembershipNav',
  'RoadmapSection',
  'CompareSection',
  'ChallengeScheduleSection',
  'SolutionSection',
  'CoursePlanSection',
  'BenefitsSection',
  'PlansSection',
  'ReviewsSection',
  'FinalCtaSection',
  'FaqSection',
  'ApplyBar',
];

describe('MembershipLanding', () => {
  it('LC-3219 로 추가된 두 섹션이 마운트돼 있다', () => {
    render(<MembershipLanding />);
    // 로드맵은 이전 시즌에 주석 처리돼 있던 것을 되살렸다.
    expect(screen.getByTestId('RoadmapSection')).toBeInTheDocument();
    // 간트는 이번에 신규로 추가했다.
    expect(screen.getByTestId('ChallengeScheduleSection')).toBeInTheDocument();
  });

  it('섹션을 시안 순서대로 합친다', () => {
    const { container } = render(<MembershipLanding />);
    const main = container.querySelector('main');
    expect(main).not.toBeNull();

    const rendered = Array.from(main!.querySelectorAll('[data-testid]')).map(
      (el) => el.getAttribute('data-testid'),
    );

    expect(rendered).toEqual(EXPECTED_ORDER);
  });

  it('결제 시트는 .membership-root 스코프 밖에 둔다', () => {
    // 결제 시트는 앱 자체 Tailwind 컴포넌트를 쓰므로 멤버십 CSS 스코프 안에 들어가면 안 된다.
    const { container } = render(<MembershipLanding />);
    const root = container.querySelector('.membership-root');
    expect(root).not.toBeNull();
    expect(
      root!.querySelector('[data-testid="MembershipPaymentSheet"]'),
    ).toBeNull();
    expect(screen.getByTestId('MembershipPaymentSheet')).toBeInTheDocument();
  });
});
