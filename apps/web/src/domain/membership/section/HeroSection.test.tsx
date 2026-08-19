import { render, screen } from '@testing-library/react';
import { HERO, HERO_STATS } from '../data/hero';
import HeroSection from './HeroSection';

describe('HeroSection', () => {
  it('배지와 헤드라인 2줄을 렌더한다', () => {
    render(<HeroSection />);
    expect(screen.getByText(HERO.badge)).toBeInTheDocument();
    for (const line of HERO.titleLines) {
      expect(screen.getByText(line)).toBeInTheDocument();
    }
  });

  it('CTA 두 개를 렌더한다', () => {
    render(<HeroSection />);
    expect(screen.getByRole('button', { name: HERO.ctaSecondary })).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('4지표 스트립의 제목과 설명을 모두 렌더한다', () => {
    render(<HeroSection />);
    for (const stat of HERO_STATS) {
      expect(screen.getByText(stat.title)).toBeInTheDocument();
      expect(screen.getByText(stat.desc)).toBeInTheDocument();
    }
  });

  it('4지표는 hero-stats 스트립 안에 4칸으로 들어간다', () => {
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
    expect(container.textContent).not.toMatch(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u);
  });
});
