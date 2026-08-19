import { render, screen } from '@testing-library/react';
import { HERO, HERO_STATS } from '../data/hero';

// useMembershipChallengeData 는 axios(@letscareer/api)를 끌어오는데, 그 패키지의 env.ts 가
// import.meta 를 써 jest(SWC) 에서 파싱되지 않는다. 히어로 렌더 검증에는 날짜만 있으면 되므로
// 훅 자체를 고정값으로 대체한다.
jest.mock('../lib/useMembershipChallengeData', () => ({
  useMembershipChallengeData: () => ({
    beginning: new Date('2026-08-01T00:00:00+09:00'),
    deadline: new Date('2026-08-31T23:59:59+09:00'),
    startDate: new Date('2026-09-01T00:00:00+09:00'),
    endDate: new Date('2026-11-30T23:59:59+09:00'),
  }),
}));

import HeroSection from './HeroSection';

describe('HeroSection', () => {
  it('배지와 헤드라인 2줄을 렌더한다', () => {
    render(<HeroSection />);
    expect(screen.getByText(HERO.badge)).toBeInTheDocument();
    for (const line of HERO.titleLines) {
      expect(screen.getByText(line)).toBeInTheDocument();
    }
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
});
