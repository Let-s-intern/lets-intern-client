import { describe, expect, it } from 'vitest';

import {
  getVersionTitleError,
  toVersionInfoPayload,
} from './toVersionInfoPayload';

describe('toVersionInfoPayload', () => {
  it('제목 앞뒤 공백을 지운다', () => {
    const result = toVersionInfoPayload([
      { challengeVersionId: 1, title: '  대학생 ' },
    ]);

    expect(result[0].title).toBe('대학생');
  });

  it('배열 순서를 sortOrder 로 매긴다', () => {
    const result = toVersionInfoPayload([
      { challengeVersionId: 2, title: '인턴 경력' },
      { challengeVersionId: 1, title: '대학생' },
    ]);

    expect(result).toEqual([
      { challengeVersionId: 2, title: '인턴 경력', sortOrder: 0 },
      { challengeVersionId: 1, title: '대학생', sortOrder: 1 },
    ]);
  });

  it('새로 추가한 버전은 challengeVersionId 를 null 로 보낸다', () => {
    const result = toVersionInfoPayload([
      { challengeVersionId: 1, title: '대학생' },
      { challengeVersionId: null, title: '이직자' },
    ]);

    expect(result[1]).toEqual({
      challengeVersionId: null,
      title: '이직자',
      sortOrder: 1,
    });
  });

  it('빈 목록은 빈 배열이다', () => {
    expect(toVersionInfoPayload([])).toEqual([]);
  });
});

describe('getVersionTitleError', () => {
  it('제목이 모두 있고 겹치지 않으면 null', () => {
    expect(
      getVersionTitleError([
        { challengeVersionId: 1, title: '대학생' },
        { challengeVersionId: null, title: '이직자' },
      ]),
    ).toBeNull();
  });

  it('버전이 없으면 null', () => {
    expect(getVersionTitleError([])).toBeNull();
  });

  it('제목이 비었거나 공백뿐이면 입력 요청 문구', () => {
    expect(
      getVersionTitleError([{ challengeVersionId: null, title: '   ' }]),
    ).toBe('버전 제목을 입력해주세요.');
  });

  it('공백을 지운 제목이 겹치면 중복 문구', () => {
    expect(
      getVersionTitleError([
        { challengeVersionId: 1, title: '대학생' },
        { challengeVersionId: null, title: ' 대학생 ' },
      ]),
    ).toBe('같은 이름의 버전이 이미 있습니다.');
  });
});
