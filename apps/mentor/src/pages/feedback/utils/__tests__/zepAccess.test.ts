import { describe, expect, it } from 'vitest';

import { resolveZepAccess } from '../zepAccess';

describe('resolveZepAccess', () => {
  const start = '2026-05-20T11:00:00+09:00';
  const end = '2026-05-20T11:30:00+09:00';

  describe('meetingUrl 이 null 인 경우', () => {
    it('현재시각과 무관하게 unassigned + url null', () => {
      expect(
        resolveZepAccess(null, start, end, new Date('2026-05-20T11:15:00+09:00')),
      ).toEqual({ state: 'unassigned', url: null });

      expect(
        resolveZepAccess(null, start, end, new Date('2026-05-20T09:00:00+09:00')),
      ).toEqual({ state: 'unassigned', url: null });
    });
  });

  describe('meetingUrl 이 있는 경우', () => {
    const url = 'https://zep.us/play/room8';

    it('T-10 이전 → pending + url 가림', () => {
      // 10:30 = 시작 30분 전
      expect(
        resolveZepAccess(url, start, end, new Date('2026-05-20T10:30:00+09:00')),
      ).toEqual({ state: 'pending', url: null });
    });

    it('T-10 이내(시작 5분 전) → active + url 노출', () => {
      // 10:55 = 시작 5분 전
      expect(
        resolveZepAccess(url, start, end, new Date('2026-05-20T10:55:00+09:00')),
      ).toEqual({ state: 'active', url });
    });

    it('정확히 T-10 시각 → active', () => {
      // 10:50 = 시작 10분 전 (경계)
      expect(
        resolveZepAccess(url, start, end, new Date('2026-05-20T10:50:00+09:00')),
      ).toEqual({ state: 'active', url });
    });

    it('진행 중(11:15) → active', () => {
      expect(
        resolveZepAccess(url, start, end, new Date('2026-05-20T11:15:00+09:00')),
      ).toEqual({ state: 'active', url });
    });

    it('endAt 시각 도달(11:30) → ended', () => {
      expect(
        resolveZepAccess(url, start, end, new Date('2026-05-20T11:30:00+09:00')),
      ).toEqual({ state: 'ended', url: null });
    });

    it('종료 후(12:00) → ended', () => {
      expect(
        resolveZepAccess(url, start, end, new Date('2026-05-20T12:00:00+09:00')),
      ).toEqual({ state: 'ended', url: null });
    });
  });

  it('startDate 가 잘못된 ISO → pending 폴백', () => {
    const r = resolveZepAccess('https://zep.us/room', 'invalid', end, new Date());
    expect(r.state).toBe('pending');
    expect(r.url).toBeNull();
  });
});
