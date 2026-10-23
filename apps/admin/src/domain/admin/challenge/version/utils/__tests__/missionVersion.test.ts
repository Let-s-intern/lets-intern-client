import { describe, expect, it } from 'vitest';

import {
  formatMissionRoundLabel,
  formatMissionVersions,
  isMissionForVersion,
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

  describe('챌린지 전체 버전 목록을 넘기면', () => {
    const allVersions = [
      { challengeVersionId: 1, title: 'A' },
      { challengeVersionId: 2, title: 'B' },
    ];

    it('모든 버전을 선택한 경우 전체 버전으로 표시한다', () => {
      expect(formatMissionVersions(allVersions, allVersions)).toBe('전체 버전');
    });

    it('일부 버전만 선택한 경우 버전명을 그대로 표시한다', () => {
      expect(formatMissionVersions([allVersions[0]], allVersions)).toBe('A');
    });

    it('버전이 하나뿐인 챌린지는 버전명을 그대로 표시한다', () => {
      expect(formatMissionVersions([allVersions[0]], [allVersions[0]])).toBe(
        'A',
      );
    });

    it('선택이 비어 있으면 공통으로 표시한다', () => {
      expect(formatMissionVersions([], allVersions)).toBe('공통');
    });
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

describe('isMissionForVersion', () => {
  const common = { challengeVersionList: [] };
  const studentOnly = {
    challengeVersionList: [{ challengeVersionId: 1, title: '대학생' }],
  };
  const both = {
    challengeVersionList: [
      { challengeVersionId: 1, title: '대학생' },
      { challengeVersionId: 2, title: '직장인' },
    ],
  };

  it('전체(null)면 모든 미션을 남긴다', () => {
    expect(
      [common, studentOnly, both].every((m) => isMissionForVersion(m, null)),
    ).toBe(true);
  });

  it('버전을 고르면 공통 미션과 그 버전이 지정된 미션만 남긴다', () => {
    expect(isMissionForVersion(common, 2)).toBe(true);
    expect(isMissionForVersion(studentOnly, 2)).toBe(false);
    expect(isMissionForVersion(both, 2)).toBe(true);
  });
});
