/**
 * findExperienceMissionPairs — 같은 challengeId+th의 EXPERIENCE_1/EXPERIENCE_2 페어 판별.
 *
 * - 정상 페어: 페어로 묶인다.
 * - 한쪽만 있음: 짝이 안 맞아 페어에 넣지 않는다(원래대로 표시).
 * - 여러 챌린지/회차: 각각 별도 페어 키로 분리된다.
 * - 경험정리 아닌 미션(OT/POOL/BONUS/null): 무시된다.
 */
import { describe, expect, it } from 'vitest';

import {
  findExperienceMissionPairs,
  type ExperienceMissionInput,
} from '../experiencePairGrouping';

describe('findExperienceMissionPairs', () => {
  it('같은 challengeId+th의 EXPERIENCE_1/EXPERIENCE_2를 페어로 묶는다', () => {
    const missions: ExperienceMissionInput[] = [
      { challengeId: 3, th: 4, missionId: 3401, missionType: 'EXPERIENCE_1' },
      { challengeId: 3, th: 4, missionId: 3402, missionType: 'EXPERIENCE_2' },
    ];
    const pairs = findExperienceMissionPairs(missions);
    expect(pairs.size).toBe(1);
    expect(pairs.get('3-4')).toEqual({
      exp1MissionId: 3401,
      exp2MissionId: 3402,
    });
  });

  it('한쪽 타입만 있으면 페어로 묶지 않는다', () => {
    const missions: ExperienceMissionInput[] = [
      { challengeId: 3, th: 4, missionId: 3401, missionType: 'EXPERIENCE_1' },
    ];
    expect(findExperienceMissionPairs(missions).size).toBe(0);
  });

  it('페어가 여러 챌린지/회차에 걸쳐 있으면 각각 별도 키로 분리된다', () => {
    const missions: ExperienceMissionInput[] = [
      { challengeId: 3, th: 4, missionId: 3401, missionType: 'EXPERIENCE_1' },
      { challengeId: 3, th: 4, missionId: 3402, missionType: 'EXPERIENCE_2' },
      { challengeId: 3, th: 5, missionId: 3501, missionType: 'EXPERIENCE_1' },
      { challengeId: 3, th: 5, missionId: 3502, missionType: 'EXPERIENCE_2' },
      { challengeId: 7, th: 4, missionId: 7401, missionType: 'EXPERIENCE_1' },
      { challengeId: 7, th: 4, missionId: 7402, missionType: 'EXPERIENCE_2' },
    ];
    const pairs = findExperienceMissionPairs(missions);
    expect(pairs.size).toBe(3);
    expect(pairs.get('3-4')).toEqual({
      exp1MissionId: 3401,
      exp2MissionId: 3402,
    });
    expect(pairs.get('3-5')).toEqual({
      exp1MissionId: 3501,
      exp2MissionId: 3502,
    });
    expect(pairs.get('7-4')).toEqual({
      exp1MissionId: 7401,
      exp2MissionId: 7402,
    });
  });

  it('같은 th라도 challengeId가 다르면 페어로 묶이지 않는다', () => {
    const missions: ExperienceMissionInput[] = [
      { challengeId: 3, th: 4, missionId: 3401, missionType: 'EXPERIENCE_1' },
      { challengeId: 7, th: 4, missionId: 7402, missionType: 'EXPERIENCE_2' },
    ];
    expect(findExperienceMissionPairs(missions).size).toBe(0);
  });

  it('경험정리 아닌 미션(OT/POOL/BONUS/null/undefined)은 무시한다', () => {
    const missions: ExperienceMissionInput[] = [
      { challengeId: 1, th: 1, missionId: 1, missionType: 'OT' },
      { challengeId: 1, th: 2, missionId: 2, missionType: 'POOL' },
      { challengeId: 1, th: 3, missionId: 3, missionType: 'BONUS' },
      { challengeId: 1, th: 4, missionId: 4, missionType: null },
      { challengeId: 1, th: 5, missionId: 5 },
    ];
    expect(findExperienceMissionPairs(missions).size).toBe(0);
  });
});
