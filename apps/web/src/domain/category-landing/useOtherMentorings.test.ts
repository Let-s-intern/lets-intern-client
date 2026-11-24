import type { ProgramCategoryTarget } from '@/api/program-category/programCategory';
import { appendOtherMentorings } from './useOtherMentorings';

jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

const m = (targetId: number): ProgramCategoryTarget => ({
  targetType: 'LIVE_MENTORING',
  targetId,
  title: `m${targetId}`,
  categoryIds: [],
});

describe('랜딩 멘토링 섹션', () => {
  it('연결된 멘토링을 앞에 두고 나머지를 겹치지 않게 뒤에 붙인다', () => {
    expect(
      appendOtherMentorings([m(3), m(1)], [m(1), m(2), m(3), m(4)]).map(
        (t) => t.targetId,
      ),
    ).toEqual([3, 1, 2, 4]);
  });

  it('열린 멘토링 목록에 없는 연결 멘토링(비노출)은 뺀다', () => {
    expect(
      appendOtherMentorings([m(12), m(3)], [m(2), m(3)]).map((t) => t.targetId),
    ).toEqual([3, 2]);
  });
});
