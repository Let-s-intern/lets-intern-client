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

describe('missionAdmin 스키마 - 자료 항목의 버전', () => {
  const baseMission = {
    id: 1,
    title: '1주차 미션',
    th: 1,
    missionTag: '태그',
    missionType: 'OT',
    missionStatusType: 'WAITING',
    attendanceCount: 3,
    lateAttendanceCount: 0,
    wrongAttendanceCount: 0,
    waitingCount: null,
    applicationCount: 10,
    score: 100,
    lateScore: 50,
    missionTemplateId: 123,
    startDate: '2026-06-01T00:00:00',
    endDate: '2026-06-03T00:00:00',
    challengeOptionId: null,
    challengeOptionCode: null,
    essentialContentsList: null,
    additionalContentsList: null,
  };

  it('버전이 null 인 공통 자료와 버전 자료를 함께 파싱한다', () => {
    const result = missionAdmin.parse({
      missionList: [
        {
          ...baseMission,
          essentialContentsList: [
            {
              id: 10,
              title: '자료A',
              link: 'https://a.example',
              missionContentsId: 100,
              challengeVersionId: null,
            },
            {
              id: 11,
              title: '자료B',
              link: 'https://b.example',
              missionContentsId: 101,
              challengeVersionId: 1,
            },
          ],
        },
      ],
    });

    const [common, versioned] = result.missionList[0].essentialContentsList!;
    expect(common?.missionContentsId).toBe(100);
    expect(common?.challengeVersionId).toBeNull();
    expect(versioned?.missionContentsId).toBe(101);
    expect(versioned?.challengeVersionId).toBe(1);
  });

  it('버전 필드가 없는 자료는 두 필드를 null 로 파싱한다', () => {
    const result = missionAdmin.parse({
      missionList: [
        {
          ...baseMission,
          additionalContentsList: [
            { id: 12, title: '자료C', link: 'https://c.example' },
          ],
        },
      ],
    });

    const [contents] = result.missionList[0].additionalContentsList!;
    expect(contents?.missionContentsId).toBeNull();
    expect(contents?.challengeVersionId).toBeNull();
  });
});
