import { describe, expect, it } from 'vitest';

import { getChallengeIdSchema, missionAdmin } from './schema';

// LC-3247 버전 필드는 서버 배포 전에는 응답에 없다.
// 필드가 없거나 null 이어도 파싱이 깨지지 않고, 버전 없는 챌린지와 같은 모양이어야 한다.
describe('챌린지 상세 스키마 - versionList', () => {
  const baseChallenge = {
    title: '챌린지',
    challengeType: 'ETC',
    classificationInfo: [],
    priceInfo: [],
    faqInfo: [],
  };

  it('versionList 가 없으면 빈 배열로 파싱한다', () => {
    const result = getChallengeIdSchema.parse(baseChallenge);

    expect(result.versionList).toEqual([]);
  });

  it('versionList 가 null 이면 빈 배열로 파싱한다', () => {
    const result = getChallengeIdSchema.parse({
      ...baseChallenge,
      versionList: null,
    });

    expect(result.versionList).toEqual([]);
  });

  it('versionList 가 있으면 받은 순서대로 파싱한다', () => {
    const versionList = [
      { challengeVersionId: 1, title: '대학생', sortOrder: 0 },
      { challengeVersionId: 2, title: '직장인', sortOrder: 1 },
    ];

    const result = getChallengeIdSchema.parse({
      ...baseChallenge,
      versionList,
    });

    expect(result.versionList).toEqual(versionList);
  });
});

describe('missionAdmin 스키마 - 미션 대상 버전', () => {
  const baseMission = {
    id: 1,
    title: '1주차 미션',
    th: 1,
    missionTag: '태그',
    missionType: null,
    missionStatusType: 'WAITING',
    attendanceCount: 0,
    lateAttendanceCount: 0,
    wrongAttendanceCount: 0,
    waitingCount: null,
    applicationCount: 0,
    score: 10,
    lateScore: 5,
    missionTemplateId: 123,
    startDate: '2026-06-01T00:00:00',
    endDate: '2026-06-03T00:00:00',
    challengeOptionId: null,
    challengeOptionCode: null,
    essentialContentsList: null,
    additionalContentsList: null,
  };

  it('challengeVersionList 가 없거나 null 이면 공통(빈 배열)으로 파싱한다', () => {
    const result = missionAdmin.parse({
      missionList: [
        baseMission,
        { ...baseMission, id: 2, challengeVersionList: null },
      ],
    });

    expect(result.missionList[0].challengeVersionList).toEqual([]);
    expect(result.missionList[1].challengeVersionList).toEqual([]);
  });

  it('challengeVersionList 가 있으면 받은 순서대로 파싱한다', () => {
    const challengeVersionList = [
      { challengeVersionId: 1, title: '대학생' },
      { challengeVersionId: 2, title: '직장인' },
    ];

    const result = missionAdmin.parse({
      missionList: [{ ...baseMission, challengeVersionList }],
    });

    expect(result.missionList[0].challengeVersionList).toEqual(
      challengeVersionList,
    );
  });
});
