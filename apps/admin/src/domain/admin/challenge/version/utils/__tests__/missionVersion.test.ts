import { describe, expect, it } from 'vitest';

import {
  formatMissionRoundLabel,
  formatMissionVersions,
  isMissionVersionLocked,
} from '../missionVersion';

describe('isMissionVersionLocked', () => {
  it.each([
    ['경험정리1', 'EXPERIENCE_1', 3],
    ['경험정리2', 'EXPERIENCE_2', 3],
  ] as const)('%s 미션은 회차와 상관없이 잠근다', (_, missionType, th) => {
    expect(isMissionVersionLocked({ missionType, th })).toBe(true);
  });

  it.each([0, 99, 100])('%i 회차 미션은 잠근다', (th) => {
    expect(isMissionVersionLocked({ missionType: null, th })).toBe(true);
  });

  it('일반 회차의 기본 미션은 잠그지 않는다', () => {
    expect(isMissionVersionLocked({ missionType: null, th: 1 })).toBe(false);
    expect(isMissionVersionLocked({ missionType: null, th: 98 })).toBe(false);
  });
});

describe('formatMissionVersions', () => {
  it('대상 버전이 없으면 공통으로 표시한다', () => {
    expect(formatMissionVersions([])).toBe('공통');
  });

  it('대상 버전 제목을 가운뎃점으로 잇는다', () => {
    expect(
      formatMissionVersions([
        { challengeVersionId: 1, title: 'A' },
        { challengeVersionId: 2, title: 'B' },
      ]),
    ).toBe('A · B');
  });
});

describe('formatMissionRoundLabel', () => {
  it('공통 미션은 회차만 표시한다', () => {
    expect(formatMissionRoundLabel({ th: 3, challengeVersionList: [] })).toBe(
      '3회차',
    );
  });

  it('단일 버전 미션은 회차 옆에 버전명을 붙인다', () => {
    expect(
      formatMissionRoundLabel({
        th: 3,
        challengeVersionList: [{ challengeVersionId: 1, title: '대학생' }],
      }),
    ).toBe('3회차 (대학생)');
  });

  it('여러 버전 미션은 버전명을 모두 붙인다', () => {
    expect(
      formatMissionRoundLabel({
        th: 3,
        challengeVersionList: [
          { challengeVersionId: 1, title: '대학생' },
          { challengeVersionId: 2, title: '직장인' },
        ],
      }),
    ).toBe('3회차 (대학생 · 직장인)');
  });
});
