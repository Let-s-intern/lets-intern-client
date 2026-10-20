import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  clearFeedbackDraft,
  loadFeedbackDraft,
  saveFeedbackDraft,
} from '../feedbackLocalDraft';

describe('feedbackLocalDraft', () => {
  afterEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('저장한 초안을 출석 id별로 되읽는다', () => {
    saveFeedbackDraft(1, 'A');
    saveFeedbackDraft(2, 'B');

    expect(loadFeedbackDraft(1)).toBe('A');
    expect(loadFeedbackDraft(2)).toBe('B');
    expect(loadFeedbackDraft(3)).toBeNull();
  });

  it('초안을 지우면 다시 읽히지 않는다', () => {
    saveFeedbackDraft(1, 'A');
    clearFeedbackDraft(1);

    expect(loadFeedbackDraft(1)).toBeNull();
  });

  it('저장소가 막혀 있어도 던지지 않는다', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });

    expect(() => saveFeedbackDraft(1, 'A')).not.toThrow();
    expect(loadFeedbackDraft(1)).toBeNull();
    expect(() => clearFeedbackDraft(1)).not.toThrow();
  });
});
