import { describe, expect, it } from 'vitest';

import { buildMentorNameIndex, resolveMentorId } from './resolveMentorId';

const row = (mentorName: string, mentorId?: number) => ({
  mentorName,
  mentorId,
});

describe('buildMentorNameIndex', () => {
  it('고유 이름은 id 로 매핑하고 ambiguous=false 이다', () => {
    const index = buildMentorNameIndex([
      { id: 101, name: '쥬디' },
      { id: 102, name: '제이슨' },
    ]);
    expect(index.get('쥬디')).toEqual({ id: 101, ambiguous: false });
    expect(index.get('제이슨')).toEqual({ id: 102, ambiguous: false });
  });

  it('같은 이름이 둘 이상이면 ambiguous=true 로 표시한다', () => {
    const index = buildMentorNameIndex([
      { id: 101, name: '쥬디' },
      { id: 103, name: '쥬디' },
    ]);
    expect(index.get('쥬디')?.ambiguous).toBe(true);
  });
});

describe('resolveMentorId', () => {
  const index = buildMentorNameIndex([
    { id: 101, name: '쥬디' },
    { id: 102, name: '제이슨' },
    { id: 201, name: '김멘토' },
    { id: 202, name: '김멘토' }, // 동명이인
  ]);

  it('이름이 정확히 1명 매칭되면 그 id 로 폴백한다', () => {
    expect(resolveMentorId(row('쥬디'), index)).toEqual({
      mentorId: 101,
      reason: 'name-fallback',
    });
  });

  it('동명이인이면 폴백하지 않는다 (mentorId: null, ambiguous)', () => {
    expect(resolveMentorId(row('김멘토'), index)).toEqual({
      mentorId: null,
      reason: 'ambiguous',
    });
  });

  it('미매칭이면 폴백하지 않는다 (mentorId: null, not-found)', () => {
    expect(resolveMentorId(row('없는멘토'), index)).toEqual({
      mentorId: null,
      reason: 'not-found',
    });
  });

  it('API mentorId 가 있으면 폴백을 무시하고 그 값을 우선한다', () => {
    // 이름은 동명이인이지만 row.mentorId 가 있으면 그 값 사용
    expect(resolveMentorId(row('김멘토', 999), index)).toEqual({
      mentorId: 999,
      reason: 'api',
    });
  });

  it('빈 인덱스에서는 미매칭으로 처리한다', () => {
    expect(resolveMentorId(row('쥬디'), new Map())).toEqual({
      mentorId: null,
      reason: 'not-found',
    });
  });
});
