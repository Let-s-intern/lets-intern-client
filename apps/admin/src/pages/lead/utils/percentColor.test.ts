import { describe, expect, it } from 'vitest';

import { getPercentColor } from './percentColor';

describe('getPercentColor', () => {
  it.each([
    [100, '#059669'],
    [90, '#059669'],
    [89, '#10b981'],
    [80, '#10b981'],
    [79, '#22c55e'],
    [70, '#22c55e'],
    [69, '#84cc16'],
    [60, '#84cc16'],
    [59, '#eab308'],
    [50, '#eab308'],
    [49, '#f59e0b'],
    [40, '#f59e0b'],
    [39, '#f97316'],
    [30, '#f97316'],
    [29, '#ef4444'],
    [20, '#ef4444'],
    [19, '#dc2626'],
    [10, '#dc2626'],
    [9, '#991b1b'],
    [0, '#991b1b'],
  ])('percent %d → %s', (percent, expected) => {
    expect(getPercentColor(percent)).toBe(expected);
  });
});
