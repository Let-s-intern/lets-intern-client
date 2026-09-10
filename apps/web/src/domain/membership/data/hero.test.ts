import { HERO, HERO_STATS } from './hero';

describe('HERO 카피 (시안 1)', () => {
  /* 이용 종료일은 히어로 배지·가격 카드·어드민 세 곳이 같아야 한다. */
  it('배지에 이용 종료일(11월 28일)이 들어 있다', () => {
    expect(HERO.badge).toContain('11월 28일');
  });

  it('제목은 3줄이다', () => {
    expect(HERO.titleLines).toHaveLength(3);
  });

  /*
   * 1차 CTA 는 금액을 앞에 붙여 "175,900으로 시작하기" 로 조립된다(HeroSection).
   * 카피에 금액을 박으면 어드민에서 가격을 바꿨을 때 버튼만 옛 숫자로 남는다.
   */
  it('1차 CTA 카피에는 금액이 들어 있지 않다', () => {
    expect(HERO.ctaPrimary).not.toMatch(/\d/);
  });
});

describe('HERO_STATS (시안 1 하단)', () => {
  it('항목은 6개다', () => {
    expect(HERO_STATS).toHaveLength(6);
  });

  it('모든 항목에 제목과 설명이 있다', () => {
    for (const stat of HERO_STATS) {
      expect(stat.title.length).toBeGreaterThan(0);
      expect(stat.desc.length).toBeGreaterThan(0);
    }
  });
});
