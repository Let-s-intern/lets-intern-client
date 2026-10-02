import { describe, expect, it } from 'vitest';

import type { ChallengeVersionDraft } from '@/domain/admin/program/challenge/ChallengeVersionSection';

import {
  getVersionInfoError,
  toVersionInfoPayload,
} from './toVersionInfoPayload';

const draft = (
  overrides: Partial<ChallengeVersionDraft> = {},
): ChallengeVersionDraft => ({
  challengeVersionId: 1,
  title: '대학생',
  programTitle: '대학생 경험정리 챌린지',
  shortDesc: '한 줄 설명',
  thumbnail: 'https://cdn/m.png',
  desktopThumbnail: 'https://cdn/d.png',
  description: '{"intro":{}}',
  ...overrides,
});

describe('toVersionInfoPayload', () => {
  it('노출 필드를 모두 싣는다', () => {
    expect(toVersionInfoPayload([draft()])).toEqual([
      {
        challengeVersionId: 1,
        title: '대학생',
        sortOrder: 0,
        programTitle: '대학생 경험정리 챌린지',
        shortDesc: '한 줄 설명',
        thumbnail: 'https://cdn/m.png',
        desktopThumbnail: 'https://cdn/d.png',
        description: '{"intro":{}}',
      },
    ]);
  });

  it('버전 제목과 노출 제목의 앞뒤 공백을 지운다', () => {
    const [result] = toVersionInfoPayload([
      draft({ title: '  대학생 ', programTitle: ' 노출 제목  ' }),
    ]);

    expect(result.title).toBe('대학생');
    expect(result.programTitle).toBe('노출 제목');
  });

  it('비어 있는 선택 입력은 null 로 보내 챌린지 값을 쓰게 한다', () => {
    const [result] = toVersionInfoPayload([
      draft({ shortDesc: '  ', desktopThumbnail: '', description: null }),
    ]);

    expect(result.shortDesc).toBeNull();
    expect(result.desktopThumbnail).toBeNull();
    expect(result.description).toBeNull();
  });

  it('배열 순서를 sortOrder 로 매긴다', () => {
    const result = toVersionInfoPayload([
      draft({ challengeVersionId: 2, title: '인턴 경력' }),
      draft({ challengeVersionId: 1, title: '대학생' }),
    ]);

    expect(
      result.map(({ challengeVersionId, sortOrder }) => [
        challengeVersionId,
        sortOrder,
      ]),
    ).toEqual([
      [2, 0],
      [1, 1],
    ]);
  });

  it('새로 추가한 버전은 challengeVersionId 를 null 로 보낸다', () => {
    const result = toVersionInfoPayload([
      draft(),
      draft({ challengeVersionId: null, title: '이직자' }),
    ]);

    expect(result[1].challengeVersionId).toBeNull();
  });

  it('빈 목록은 빈 배열이다', () => {
    expect(toVersionInfoPayload([])).toEqual([]);
  });
});

describe('getVersionInfoError', () => {
  it('필수 입력이 모두 있고 제목이 겹치지 않으면 null', () => {
    expect(
      getVersionInfoError([
        draft(),
        draft({ challengeVersionId: null, title: '이직자' }),
      ]),
    ).toBeNull();
  });

  it('선택 입력은 비어 있어도 null', () => {
    expect(
      getVersionInfoError([
        draft({ shortDesc: null, desktopThumbnail: null, description: null }),
      ]),
    ).toBeNull();
  });

  it('버전이 없으면 null', () => {
    expect(getVersionInfoError([])).toBeNull();
  });

  it('제목이 비었거나 공백뿐이면 입력 요청 문구', () => {
    expect(getVersionInfoError([draft({ title: '   ' })])).toBe(
      '버전 제목을 입력해주세요.',
    );
  });

  it('공백을 지운 제목이 겹치면 중복 문구', () => {
    expect(
      getVersionInfoError([
        draft(),
        draft({ challengeVersionId: null, title: ' 대학생 ' }),
      ]),
    ).toBe('같은 이름의 버전이 이미 있습니다.');
  });

  it('노출 제목이 비면 몇 번 버전인지 알려준다', () => {
    expect(
      getVersionInfoError([
        draft(),
        draft({ title: '이직자', programTitle: '  ' }),
      ]),
    ).toBe('2번 버전의 노출 제목을 입력해주세요.');
  });

  it('모바일 썸네일이 없으면 몇 번 버전인지 알려준다', () => {
    expect(getVersionInfoError([draft({ thumbnail: '' })])).toBe(
      '1번 버전의 모바일 썸네일을 등록해주세요.',
    );
  });
});
