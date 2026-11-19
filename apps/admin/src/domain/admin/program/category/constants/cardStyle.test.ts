import { describe, expect, it } from 'vitest';
import {
  cardStyleOf,
  displayTypeToSend,
  isLegacyFixedStyle,
} from './cardStyle';

describe('카드 모양', () => {
  it('FEATURED 만 대표 상품, 나머지는 모두 카드 목록으로 보인다', () => {
    expect(cardStyleOf('FEATURED')).toBe('FEATURED');
    for (const v of [
      'AUTO',
      'CARDS',
      'MENTOR',
      'BLOG',
      null,
      undefined,
    ] as const)
      expect(cardStyleOf(v)).toBe('CARDS');
  });

  it('바꾸지 않으면 보내지 않는다', () => {
    expect(displayTypeToSend('MENTOR', 'CARDS')).toBeUndefined();
    expect(displayTypeToSend(null, 'CARDS')).toBeUndefined();
    expect(displayTypeToSend('FEATURED', 'FEATURED')).toBeUndefined();
  });

  it('카드 목록은 AUTO, 대표 상품은 FEATURED 로 보낸다', () => {
    expect(displayTypeToSend('FEATURED', 'CARDS')).toBe('AUTO');
    expect(displayTypeToSend('BLOG', 'FEATURED')).toBe('FEATURED');
  });

  it('예전 고정 값을 알아본다', () => {
    expect(isLegacyFixedStyle('MENTOR')).toBe(true);
    expect(isLegacyFixedStyle('AUTO')).toBe(false);
    expect(isLegacyFixedStyle('FEATURED')).toBe(false);
  });
});
