import { describe, expect, it } from 'vitest';

import { Row } from '@/types/interface';

import {
  getMissionColumns,
  getMissionTypeForTh,
} from './ChallengeOperationCells';

const getMissionNameFormatter = () => {
  const column = getMissionColumns().find(
    (c) => c.field === 'missionTemplateId',
  );
  if (!column?.valueFormatter) {
    throw new Error('미션명 컬럼 valueFormatter 를 찾지 못했습니다.');
  }
  return column.valueFormatter;
};

/**
 * 1.2 회귀 방지: 서버가 준 미션명(row.title)이 있으면
 * 템플릿 조인(missionTemplatesOptions)이 실패해도 그 값을 표시해야 한다.
 */
describe('미션명 컬럼 표시값', () => {
  it('템플릿 조인 실패(옵션 목록 비어있음)여도 row.title 을 표시한다', () => {
    const formatter = getMissionNameFormatter();
    const row = {
      title: '자기소개서 미션',
      missionTemplateId: 123,
      missionTemplatesOptions: [], // 20위 밖 → 조인 실패 상황
    } as unknown as Row;

    const result = formatter(null, row, {} as never, {} as never);

    expect(result).toBe('(123) 자기소개서 미션');
  });

  it('title 이 비어있으면 템플릿에서 파생 폴백한다', () => {
    const formatter = getMissionNameFormatter();
    const row = {
      title: '',
      missionTemplateId: 7,
      missionTemplatesOptions: [{ id: 7, title: '템플릿 미션' }],
    } as unknown as Row;

    const result = formatter(null, row, {} as never, {} as never);

    expect(result).toBe('(7) 템플릿 미션');
  });
});

describe('회차 변경 시 미션 타입 (6.4)', () => {
  it.each([
    [0, 'OT'],
    [99, 'POOL'],
    [100, 'BONUS'],
  ] as const)('%i 회차는 기존대로 %s 로 바꾼다', (th, expected) => {
    expect(getMissionTypeForTh(th, null)).toBe(expected);
    expect(getMissionTypeForTh(th, 'EXPERIENCE_1')).toBe(expected);
  });

  it.each(['EXPERIENCE_1', 'EXPERIENCE_2'] as const)(
    '일반 회차로 바꿔도 %s 타입은 유지한다',
    (missionType) => {
      expect(getMissionTypeForTh(3, missionType)).toBe(missionType);
    },
  );

  it.each(['OT', 'POOL', 'BONUS'] as const)(
    '일반 회차로 바꾸면 %s 타입은 기본(null)으로 되돌린다',
    (missionType) => {
      expect(getMissionTypeForTh(3, missionType)).toBeNull();
    },
  );

  it('회차를 비우거나 음수면 타입을 바꾸지 않는다', () => {
    expect(getMissionTypeForTh(null, 'EXPERIENCE_2')).toBe('EXPERIENCE_2');
    expect(getMissionTypeForTh(-1, 'OT')).toBe('OT');
  });
});
