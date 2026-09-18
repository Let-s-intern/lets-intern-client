import { fireEvent, render, screen } from '@testing-library/react';

/*
 * 결제 CTA 네 자리(히어로 · 가격 · 마지막 CTA · 하단 고정 바)를 한자리에서 본다.
 * 자리 값이 서로 달라야 어디서 눌렸는지 나뉘는데, 그 대조는 네 파일을 함께 봐야만 된다.
 *
 * 이벤트 이름·속성은 `analytics.test.ts` 가 덮는다. 여기서는 어느 자리 값으로 부르는지와
 * **결제 흐름이 그대로인지**를 본다. 그래서 `openPlanSheet` 는 목으로 바꾸지 않고
 * 실제 커스텀 이벤트를 듣는다 — 목이면 "부르긴 했다" 까지만 알 수 있다.
 */
jest.mock('./analytics');

// 네 컴포넌트 모두 가격 단일 출처를 구독한다. 그 훅이 react-query 를 끌어와 jest 가
// 파싱하지 못하므로 고정값으로 갈아끼운다(`section/HeroSection.test.tsx` 와 같은 이유).
jest.mock('./lib/useMembershipChallengeData', () => ({
  useMembershipChallengeData: () => ({
    salePrice: 175900,
    endDate: new Date('2026-11-30T23:59:59+09:00'),
    deadline: new Date('2026-11-30T23:59:59+09:00'),
  }),
}));

import { capturePaymentCtaClicked } from './analytics';
import type { MembershipPaymentCtaLocation } from './analytics';
import { FINAL_CTA } from './data/finalCta';
import { HERO } from './data/hero';
import { formatKRW } from './data/membership';
import { PRICING } from './data/pricing';
import { ctaLabel } from './lib/membershipChallenge';
import { onOpenPlanSheet } from './lib/planSheet';
import FinalCtaSection from './section/FinalCtaSection';
import HeroSection from './section/HeroSection';
import PricingSection from './section/PricingSection';
import ApplyBar from './ui/ApplyBar';

interface CtaCase {
  name: string;
  location: MembershipPaymentCtaLocation;
  render: () => void;
  buttonName: string;
}

const CASES: readonly CtaCase[] = [
  {
    name: '히어로',
    location: 'hero',
    render: () => render(<HeroSection />),
    buttonName: ctaLabel(`${formatKRW(175900)}${HERO.ctaPrimary}`),
  },
  {
    name: '가격',
    location: 'pricing',
    render: () => render(<PricingSection />),
    buttonName: ctaLabel(PRICING.ctaLabel),
  },
  {
    name: '마지막 CTA',
    location: 'final_cta',
    render: () => render(<FinalCtaSection />),
    buttonName: ctaLabel(FINAL_CTA.ctaLabel),
  },
  {
    name: '하단 고정 바',
    location: 'apply_bar',
    render: () => render(<ApplyBar />),
    buttonName: ctaLabel('지금 바로 신청'),
  },
];

let opened: number;
let unsubscribe: () => void;

beforeEach(() => {
  jest.clearAllMocks();
  opened = 0;
  unsubscribe = onOpenPlanSheet(() => {
    opened += 1;
  });
});

afterEach(() => {
  unsubscribe();
});

describe('결제 CTA 이벤트', () => {
  it.each(CASES)(
    '$name — 위치 $location 으로 보낸다',
    ({ render: mount, buttonName, location }) => {
      mount();

      fireEvent.click(screen.getByRole('button', { name: buttonName }));

      expect(capturePaymentCtaClicked).toHaveBeenCalledTimes(1);
      expect(capturePaymentCtaClicked).toHaveBeenCalledWith({ location });
    },
  );

  /* 이벤트는 결제 흐름에 덧붙이기만 한다. 시트가 열리지 않으면 결제 자체가 막힌다. */
  it.each(CASES)(
    '$name — 결제 시트를 그대로 연다',
    ({ render: mount, buttonName }) => {
      mount();

      fireEvent.click(screen.getByRole('button', { name: buttonName }));

      expect(opened).toBe(1);
    },
  );

  it('네 자리의 위치 값이 서로 다르다', () => {
    const locations = CASES.map((it) => it.location);

    expect(new Set(locations).size).toBe(CASES.length);
  });
});
