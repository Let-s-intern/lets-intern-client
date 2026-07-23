import { describe, expect, it } from 'vitest';

import { Row } from '@/types/interface';

import { getMissionColumns } from './ChallengeOperationCells';

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
