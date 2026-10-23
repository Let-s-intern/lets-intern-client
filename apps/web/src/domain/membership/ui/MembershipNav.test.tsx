import { render, screen } from '@testing-library/react';

/*
 * 이 테스트가 잡으려는 것은 "죽은 앵커" 다. 네비 항목이 가리키는 id 가 페이지에 없으면
 * 눌러도 아무 일이 일어나지 않고 에러도 나지 않는다 — 목록만 읽어서는 알 수 없고,
 * 랜딩을 실제로 그려서 대조해야만 보인다.
 *
 * 그래서 섹션은 mock 하지 않는다. 대신 이 흐름과 상관없는 것만 비운다 —
 * 어드민 조회 세 개(react-query + axios)와 결제 시트(앱 공용 바텀시트)다.
 */
jest.mock('../lib/useChallengeThumbnails', () => ({
  useChallengeThumbnails: () => ({}),
}));
jest.mock('../lib/useGuidebookThumbnails', () => ({
  useGuidebookThumbnails: () => ({}),
}));
jest.mock('../lib/useMembershipChallengeData', () => ({
  useMembershipChallengeData: () => ({
    beginning: new Date('2026-09-10T00:00:00+09:00'),
    deadline: new Date('2026-09-20T23:59:59+09:00'),
    startDate: new Date('2026-09-21T00:00:00+09:00'),
    endDate: new Date('2026-11-30T23:59:59+09:00'),
    regularPrice: 175900,
    salePrice: 175900,
    vodRegularPrice: 300000,
    vodSalePrice: 30000,
    faqItems: [],
  }),
}));
jest.mock('../ui/MembershipPaymentSheet', () => ({
  __esModule: true,
  default: () => null,
}));

import MembershipLanding from '../MembershipLanding';
import MembershipNav, { NAV_ITEMS } from './MembershipNav';

describe('MembershipNav 앵커', () => {
  beforeAll(() => {
    // jsdom 에는 matchMedia 가 없다. 등장 애니메이션이 "모션 최소화" 경로로 빠지게 한다.
    window.matchMedia = jest.fn().mockReturnValue({ matches: true });
    // 캐러셀 도트 훅용 폴리필. 이 테스트는 스크롤 동작이 아니라 id 존재만 본다.
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

  it('항목이 5개이고 중복된 이름이 없다', () => {
    render(<MembershipNav />);

    const titles = screen.getAllByRole('button').map((b) => b.textContent);

    expect(titles).toEqual([
      '무료 진단',
      '준비 단계',
      '패스 혜택',
      '플레이북',
      '가격',
    ]);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it('모든 항목이 랜딩에 실제로 있는 섹션 id 를 가리킨다', () => {
    const { container } = render(<MembershipLanding />);

    const pageIds = new Set(
      [...container.querySelectorAll('[id]')].map((el) => el.id),
    );

    for (const item of NAV_ITEMS) {
      expect(pageIds.has(item.to)).toBe(true);
    }
  });

  /*
   * 스크롤 스파이가 IntersectionObserver 로 현재 섹션을 하이라이트한다. 나열 순서가
   * DOM 순서와 어긋나면 스크롤할 때 활성 항목이 앞뒤로 튄다.
   */
  it('항목 순서가 랜딩의 DOM 순서와 같다', () => {
    const { container } = render(<MembershipLanding />);

    const domOrder = [...container.querySelectorAll('[id]')]
      .map((el) => el.id)
      .filter((id) => NAV_ITEMS.some((item) => item.to === id));

    expect(domOrder).toEqual(NAV_ITEMS.map((item) => item.to));
  });
});
