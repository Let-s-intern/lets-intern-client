import { render, screen } from '@testing-library/react';

/*
 * 히어로 1차 CTA 가 판매가를 붙여 "175,900으로 시작하기" 로 조립된다(LC-3294). 그래서
 * 이 섹션이 가격 단일 출처를 구독하는데, 그 훅이 react-query 를 끌어와 jest 가 파싱하지
 * 못한다. 이 테스트의 관심사는 카피와 구조라 훅은 고정값으로 갈아끼운다.
 */
jest.mock('../lib/useMembershipChallengeData', () => ({
  useMembershipChallengeData: () => ({
    salePrice: 175900,
    // 배지가 이 날짜를 그대로 찍는다. 카피에 날짜를 박지 않는다는 것이 요점이라
    // 값 자체는 시안·어드민과 무관한 아무 날짜여도 된다.
    endDate: new Date('2026-11-30T23:59:59+09:00'),
  }),
}));

import { HERO, HERO_STATS } from '../data/hero';
import HeroSection from './HeroSection';

describe('HeroSection', () => {
  it('배지와 헤드라인 3줄을 렌더한다', () => {
    render(<HeroSection />);
    // 배지는 카피 + 어드민 종료일로 조립된다. 날짜가 카피에 박혀 있으면 운영에서
    // 기간을 바꿨을 때 배지만 옛 날짜로 남는다(시안 11/28 vs 어드민 11/30).
    expect(
      screen.getByText(
        (_, el) =>
          el?.className === 'hero-badge' &&
          (el?.textContent ?? '').includes('11월 30일'),
      ),
    ).toBeInTheDocument();
    for (const line of HERO.titleLines) {
      expect(screen.getByText(line)).toBeInTheDocument();
    }
  });

  it('CTA 두 개를 렌더한다', () => {
    render(<HeroSection />);
    expect(
      screen.getByRole('button', { name: HERO.ctaSecondary }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('하단 지표 스트립의 제목과 설명을 모두 렌더한다', () => {
    render(<HeroSection />);
    for (const stat of HERO_STATS) {
      expect(screen.getByText(stat.title)).toBeInTheDocument();
      expect(screen.getByText(stat.desc)).toBeInTheDocument();
    }
  });

  it('하단 지표는 hero-stats 스트립 안에 들어간다', () => {
    const { container } = render(<HeroSection />);
    expect(container.querySelectorAll('.hero-stats .hero-stat')).toHaveLength(
      HERO_STATS.length,
    );
  });

  // 시안 0.png 은 1열 중앙 정렬이고 카운트다운 카드가 없다. 아래 두 케이스가 깨지면
  // 시안에서 빠진 블록이 다시 렌더되고 있다는 뜻이다.
  it('카운트다운 카드(offer)를 렌더하지 않는다', () => {
    const { container } = render(<HeroSection />);
    expect(container.querySelector('.offer')).toBeNull();
    expect(container.querySelector('#hero-cd')).toBeNull();
    expect(screen.queryByText(HERO.offerTag)).not.toBeInTheDocument();
    expect(screen.queryByText(HERO.offerTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(HERO.offerFine)).not.toBeInTheDocument();
  });

  it('모집기간 메타(hero-meta)를 렌더하지 않는다', () => {
    const { container } = render(<HeroSection />);
    expect(container.querySelector('.hero-meta')).toBeNull();
    expect(screen.queryByText(/모집기간/)).not.toBeInTheDocument();
  });

  it('시안에 없는 이모지를 화면에 남기지 않는다', () => {
    const { container } = render(<HeroSection />);
    expect(container.textContent).not.toMatch(
      /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u,
    );
  });
});
