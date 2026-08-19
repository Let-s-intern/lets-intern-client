import { challengeTypeSchema } from '@/schema';
import { ALL_IN_ONE_ITEMS, COMPARE_COMBOS, COMPARE_COPY } from './compare';

describe('COMPARE_COMBOS — 개별 구매 조합 탭', () => {
  it('탭은 3종이다 (시안 4.png 상단)', () => {
    expect(COMPARE_COMBOS).toHaveLength(3);
  });

  it('탭 id 가 중복되지 않는다 (탭 상태 키로 쓴다)', () => {
    const ids = COMPARE_COMBOS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('각 탭의 구성 챌린지는 2~3종이다', () => {
    for (const combo of COMPARE_COMBOS) {
      expect(combo.items.length).toBeGreaterThanOrEqual(2);
      expect(combo.items.length).toBeLessThanOrEqual(3);
    }
  });

  it('모든 challengeType 이 challengeTypeSchema 를 통과한다', () => {
    // 오타가 나면 /challenge/active 가 조용히 빈 목록을 주고 가격이 사라진다.
    for (const combo of COMPARE_COMBOS) {
      for (const item of combo.items) {
        expect(() =>
          challengeTypeSchema.parse(item.challengeType),
        ).not.toThrow();
      }
    }
  });

  it('탭 라벨과 챌린지 표시 이름이 비어 있지 않다', () => {
    for (const combo of COMPARE_COMBOS) {
      expect(combo.label.trim()).not.toBe('');
      for (const item of combo.items) {
        expect(item.name.trim()).not.toBe('');
      }
    }
  });

  it('한 탭 안에서 같은 challengeType 이 두 번 나오지 않는다', () => {
    // 중복되면 같은 가격을 두 줄로 더해 합계가 부풀려진다.
    for (const combo of COMPARE_COMBOS) {
      const types = combo.items.map((i) => i.challengeType);
      expect(new Set(types).size).toBe(types.length);
    }
  });
});

describe('ALL_IN_ONE_ITEMS — 우측 올인원 카드 항목', () => {
  it('5줄이다', () => {
    expect(ALL_IN_ONE_ITEMS).toHaveLength(5);
  });

  it('흰 박스로 강조되는 줄은 첫 줄 하나뿐이다 (시안)', () => {
    expect(ALL_IN_ONE_ITEMS.filter((i) => i.emphasized)).toHaveLength(1);
    expect(ALL_IN_ONE_ITEMS[0].emphasized).toBe(true);
  });
});

describe('COMPARE_COPY — 섹션 문구', () => {
  it('합계 문구에 항목 수 치환자 {n} 이 있다', () => {
    expect(COMPARE_COPY.totalCaption).toContain('{n}');
  });

  it('시안의 금액은 문구 상수에 들어 있지 않다 (가격은 연동값이다)', () => {
    const copy = JSON.stringify(COMPARE_COPY);
    expect(copy).not.toMatch(/128,?500|79,?000|207,?500/);
  });
});
