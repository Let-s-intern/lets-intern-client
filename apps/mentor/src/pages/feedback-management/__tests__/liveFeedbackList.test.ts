/**
 * Push 1 / 1.4.T1 — 라이브 피드백 회차 목록 훅 스모크 테스트
 */
import { describe, it, expect } from 'vitest';

describe('useLiveFeedbackList', () => {
  it('훅 모듈이 import 된다', async () => {
    const mod = await import('../hooks/useLiveFeedbackList');
    expect(typeof mod.useLiveFeedbackList).toBe('function');
  });

  it('LiveFeedbackRoundList UI 가 import 된다', async () => {
    const Mod = await import('../ui/LiveFeedbackRoundList');
    expect(typeof Mod.default).toBe('function');
  });

  it('FeedbackTabs UI 가 import 된다', async () => {
    const Mod = await import('../ui/FeedbackTabs');
    expect(typeof Mod.default).toBe('function');
  });
});
