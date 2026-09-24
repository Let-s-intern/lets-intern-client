import { HERO, HERO_STATS } from './hero';

describe('HERO 카피', () => {
  it('헤드라인은 3줄이고 각 줄이 비어 있지 않다', () => {
    expect(HERO.titleLines).toHaveLength(3);
    for (const line of HERO.titleLines) {
      expect(line.trim().length).toBeGreaterThan(0);
    }
  });

  it('배지에 이용 종료일(11월 30일)이 들어 있다', () => {
    expect(HERO.badge).toContain('11월 30일');
  });

  it('CTA 두 개가 모두 비어 있지 않다', () => {
    expect(HERO.ctaPrimary.trim().length).toBeGreaterThan(0);
    expect(HERO.ctaSecondary.trim().length).toBeGreaterThan(0);
  });

  it('리드 카피는 2줄이고 각 줄이 비어 있지 않다', () => {
    expect(HERO.lead).toHaveLength(2);
    for (const line of HERO.lead) {
      expect(line.trim().length).toBeGreaterThan(0);
    }
  });
});

describe('HERO_STATS 4지표', () => {
  it('항목은 4개다', () => {
    expect(HERO_STATS).toHaveLength(4);
  });

  it('모든 항목에 title 과 desc 가 있다', () => {
    for (const stat of HERO_STATS) {
      expect(stat.title.trim().length).toBeGreaterThan(0);
      expect(stat.desc.trim().length).toBeGreaterThan(0);
    }
  });
});
