import { describe, expect, it, beforeEach, vi } from 'vitest';

const STORAGE_KEY = 'mentor_read_notice_ids';

// localStorage mock
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    clear: () => { store = {}; },
  };
})();

vi.stubGlobal('localStorage', localStorageMock);

describe('useNotificationState localStorage', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('읽은 공지 ID를 저장하고 불러온다', () => {
    const ids = [1, 2, 3];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    const result = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    expect(result).toEqual([1, 2, 3]);
  });

  it('빈 상태에서 빈 배열을 반환한다', () => {
    const result = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    expect(result).toEqual([]);
  });

  it('새 ID를 추가하면 기존 ID가 유지된다', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([1, 2]));
    const prev = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const next = [...prev, 3];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    const result = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    expect(result).toEqual([1, 2, 3]);
  });

  it('중복 ID는 추가하지 않는다', () => {
    const ids = [1, 2];
    const newId = 2;
    if (!ids.includes(newId)) ids.push(newId);
    expect(ids).toEqual([1, 2]);
  });

  it('오늘 공지 중 안 읽은 수를 계산한다', () => {
    const readIds = [1, 3];
    const todayGuides = [
      { challengeMentorGuideId: 1 },
      { challengeMentorGuideId: 2 },
      { challengeMentorGuideId: 3 },
      { challengeMentorGuideId: 4 },
    ];
    const unreadCount = todayGuides.filter(
      (g) => !readIds.includes(g.challengeMentorGuideId),
    ).length;
    expect(unreadCount).toBe(2);
  });
});
