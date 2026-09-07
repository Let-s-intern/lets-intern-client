import { describe, expect, it } from 'vitest';

import { describeSaveError } from '../saveError';

/*
 * 서버는 검증 실패를 필드 경로로 알려준다. 그대로 띄우면 멘토는 어느 칸인지 알 수 없다.
 * 화면에 적힌 이름으로 옮기되, 못 알아본 경로는 지어내지 않는다.
 */
describe('describeSaveError', () => {
  it('필드 경로를 스텝 이름과 칸 이름으로 옮긴다', () => {
    expect(
      describeSaveError({
        message: '[mentoringTypes.title] 공백일 수 없습니다',
      }),
    ).toBe('멘토링 유형의 소개 제목을 채워 주세요.');
  });

  it('목록 안의 항목이면 몇 번째인지 세어 준다', () => {
    expect(
      describeSaveError({
        message: '[mentoringTypes.items[1].title] 공백일 수 없습니다',
      }),
    ).toBe('멘토링 유형의 2번 유형 제목을 채워 주세요.');
  });

  it('섹션마다 같은 이름인 칸도 그 섹션 이름과 함께 알린다', () => {
    expect(
      describeSaveError({ message: '[video.subtitle] 공백일 수 없습니다' }),
    ).toBe('소개 영상의 섹션 설명을 채워 주세요.');
  });

  it('결과 사례의 전후 설명을 구분한다', () => {
    expect(
      describeSaveError({
        message: '[results.cases[0].afterCaption] 공백일 수 없습니다',
      }),
    ).toBe('결과 사례의 1번 멘토링 후 변화를 채워 주세요.');
  });

  it('오류 코드는 붙이지 않는다', () => {
    const described = describeSaveError({
      code: 'BAD_REQUEST',
      message: '[hero.bullets[0]] 공백일 수 없습니다',
    });
    expect(described).not.toContain('BAD_REQUEST');
    expect(described).toBe('핵심 소개의 1번 소개 문구를 채워 주세요.');
  });

  /* 지어내면 엉뚱한 칸을 찾게 된다. 모르면 서버 문구를 그대로 둔다. */
  it('모르는 경로는 서버 문구를 그대로 둔다', () => {
    const message = '[somethingNew.field] 공백일 수 없습니다';
    expect(describeSaveError({ message })).toBe(message);
  });

  it('필드 경로가 없는 오류는 그대로 둔다', () => {
    expect(describeSaveError({ message: '서버가 응답하지 않습니다' })).toBe(
      '서버가 응답하지 않습니다',
    );
  });

  it('메시지가 없으면 아무것도 만들지 않는다', () => {
    expect(describeSaveError(null)).toBeUndefined();
    expect(describeSaveError({})).toBeUndefined();
  });
});
