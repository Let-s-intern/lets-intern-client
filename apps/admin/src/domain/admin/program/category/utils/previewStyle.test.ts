import { describe, expect, it } from 'vitest';
import { resolveStyle } from './previewStyle';

const of = (...types: string[]) => types.map((targetType) => ({ targetType }));

describe('resolveStyle', () => {
  it('정해 둔 카드 모양은 그대로 쓴다', () => {
    expect(resolveStyle('BLOG', of('CHALLENGE'))).toBe('BLOG');
  });
  it('자동이면 한 유형일 때만 그 유형 모양, 섞이면 카드 목록', () => {
    expect(resolveStyle('AUTO', of('CHALLENGE', 'CHALLENGE'))).toBe('FEATURED');
    expect(resolveStyle('AUTO', of('LIVE_MENTORING'))).toBe('MENTOR');
    expect(resolveStyle('AUTO', of('BLOG'))).toBe('BLOG');
    expect(resolveStyle('AUTO', of('CHALLENGE', 'LIVE'))).toBe('CARDS');
    expect(resolveStyle('AUTO', [])).toBe('CARDS');
  });
});
