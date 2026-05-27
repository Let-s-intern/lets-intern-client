/**
 * Push 2 / 2.3.T1 — mockNow 실시각화 검증.
 *
 * MOCK_NOW = null 로 전환되어 currentNow()가 항상 실제 시각(new Date())을
 * 반환하는지 확인한다.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import { MOCK_NOW, currentNow } from '../mockNow';

describe('currentNow / MOCK_NOW', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('MOCK_NOW 는 null 이다 (데모 시각 override 해제)', () => {
    expect(MOCK_NOW).toBeNull();
  });

  it('currentNow() 는 실제 시각을 반환한다', () => {
    vi.useFakeTimers();
    const fixed = new Date('2026-05-20T10:00:00.000Z');
    vi.setSystemTime(fixed);

    expect(currentNow().getTime()).toBe(fixed.getTime());
  });

  it('currentNow() 는 매 호출마다 현재 시각을 새로 읽는다', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-20T10:00:00.000Z'));
    const first = currentNow().getTime();

    vi.setSystemTime(new Date('2026-05-20T11:00:00.000Z'));
    const second = currentNow().getTime();

    expect(second - first).toBe(60 * 60 * 1000);
  });
});
