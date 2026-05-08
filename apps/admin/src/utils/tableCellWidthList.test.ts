import { describe, expect, it } from 'vitest';

import { challengeSubmitDetailCellWidthList } from './tableCellWidthList';

/**
 * 챌린지 제출확인 상세 테이블의 columns 정렬 보장.
 *
 * - 헤더(TableHead.tsx)와 본문 행(TableRow.tsx)이 동일한 width 배열을
 *   동일한 인덱스로 사용한다.
 * - 따라서 배열의 길이/형태가 흐트러지면 곧바로 줄 간 정렬이 어긋난다.
 * - 이 테스트는 그 invariant 를 회귀 테스트 형태로 고정한다.
 */
describe('challengeSubmitDetailCellWidthList', () => {
  it('헤더와 본문이 공유하는 컬럼 수(11개)를 유지한다', () => {
    expect(challengeSubmitDetailCellWidthList).toHaveLength(11);
  });

  it('모든 셀이 shrink-0 으로 고정 너비를 보장한다', () => {
    challengeSubmitDetailCellWidthList.forEach((cls) => {
      expect(cls).toMatch(/shrink-0/);
    });
  });

  it('모든 셀이 명시적 width(w-[N%]) 형태로 고정되어 flex 잔여공간 분배에 흔들리지 않는다', () => {
    challengeSubmitDetailCellWidthList.forEach((cls) => {
      expect(cls).toMatch(/w-\[\d+%\]/);
    });
  });

  it('width 합이 정확히 100% 가 되어 flex 컨테이너에 잔여공간이 남지 않는다', () => {
    const total = challengeSubmitDetailCellWidthList.reduce((sum, cls) => {
      const match = cls.match(/w-\[(\d+)%\]/);
      return sum + (match ? Number(match[1]) : 0);
    }, 0);
    expect(total).toBe(100);
  });
});
