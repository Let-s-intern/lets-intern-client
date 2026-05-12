import { describe, expect, it } from 'vitest';

import { getPercentColor } from './percentColor';

describe('getPercentColor', () => {
  it('80 이상이면 진한 초록을 반환한다', () => {
    expect(getPercentColor(100)).toBe('#10b981');
    expect(getPercentColor(80)).toBe('#10b981');
  });

  it('60 이상 80 미만이면 청록을 반환한다', () => {
    expect(getPercentColor(79)).toBe('#02b3a7');
    expect(getPercentColor(60)).toBe('#02b3a7');
  });

  it('40 이상 60 미만이면 주황을 반환한다', () => {
    expect(getPercentColor(59)).toBe('#f59e0b');
    expect(getPercentColor(40)).toBe('#f59e0b');
  });

  it('40 미만이면 빨강을 반환한다', () => {
    expect(getPercentColor(39)).toBe('#ef4444');
    expect(getPercentColor(0)).toBe('#ef4444');
  });
});
