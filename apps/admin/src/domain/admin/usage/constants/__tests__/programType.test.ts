import { describe, expect, it } from 'vitest';

import {
  formatProgramType,
  PROGRAM_TYPE_OPTIONS,
  UNTRACKED_PROGRAM_SUFFIX,
} from '../programType';

const optionFor = (value: string) =>
  PROGRAM_TYPE_OPTIONS.find((option) => option.value === value);

describe('PROGRAM_TYPE_OPTIONS', () => {
  it('적재 대상 타입은 라벨만 쓴다', () => {
    expect(optionFor('CHALLENGE')?.label).toBe('챌린지');
    expect(optionFor('VOD')?.label).toBe('VOD');
    expect(optionFor('GUIDEBOOK')?.label).toBe('가이드북');
  });

  it('적재 범위 밖 타입은 집계 대상이 아니라고 밝힌다', () => {
    // 0건이 나왔을 때 "이용한 사람이 없다"로 읽히면 안 된다.
    // 기록하지 않는 타입이라 이용 여부를 말할 수 없는 것이다.
    expect(optionFor('LIVE')?.label).toBe(`라이브${UNTRACKED_PROGRAM_SUFFIX}`);
    expect(optionFor('REPORT')?.label).toBe(
      `서류진단${UNTRACKED_PROGRAM_SUFFIX}`,
    );
  });

  it('선택지에서 빼지는 않는다', () => {
    // 빼면 "라이브는 왜 없지"라는 질문이 남는다. 이유를 적어 두는 편이 낫다.
    expect(optionFor('LIVE')).toBeDefined();
    expect(optionFor('REPORT')).toBeDefined();
  });

  it('적재 대상 타입 라벨에는 꼬리표가 붙지 않는다', () => {
    ['CHALLENGE', 'VOD', 'GUIDEBOOK'].forEach((value) => {
      expect(optionFor(value)?.label).not.toContain(UNTRACKED_PROGRAM_SUFFIX);
    });
  });
});

describe('formatProgramType', () => {
  it('아는 타입은 한글 라벨로 바꾼다', () => {
    expect(formatProgramType('CHALLENGE')).toBe('챌린지');
  });

  it('모르는 타입은 서버가 준 값을 그대로 보여준다', () => {
    // 빈칸으로 두면 프로그램이 없는 행처럼 읽힌다.
    expect(formatProgramType('NEW_TYPE')).toBe('NEW_TYPE');
  });

  it('값이 없으면 빈 문자열이다', () => {
    expect(formatProgramType(null)).toBe('');
    expect(formatProgramType(undefined)).toBe('');
  });
});
