import { describe, expect, it } from 'vitest';
import { GUIDE_SEEN_KEY, hasSeenGuide, markGuideSeen } from './guideSeen';

const memory = () => {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
  };
};

const broken = {
  getItem: () => {
    throw new Error('blocked');
  },
  setItem: () => {
    throw new Error('blocked');
  },
};

describe('사용법 첫 방문', () => {
  it('처음에는 안 본 것, 닫으면 본 것으로 기억한다', () => {
    const storage = memory();
    expect(hasSeenGuide(storage)).toBe(false);
    markGuideSeen(storage);
    expect(storage.getItem(GUIDE_SEEN_KEY)).toBe('1');
    expect(hasSeenGuide(storage)).toBe(true);
  });

  it('저장소가 막혀 있으면 오류 없이 본 것으로 친다', () => {
    expect(hasSeenGuide(broken)).toBe(true);
    expect(() => markGuideSeen(broken)).not.toThrow();
  });

  it('저장소가 없어도 본 것으로 친다', () => {
    expect(hasSeenGuide(null)).toBe(true);
  });
});
