import { describe, expect, it } from 'vitest';

import { missionAdmin } from './schema';

// 회귀 방지: FE 가 호출하는 v2 GET /admin/challenge/{id}/mission 응답을
// missionAdmin 이 파싱한다. 실제 응답에는 다음 두 가지가 존재한다.
//  1) 대기 인원 JSON 필드명은 waitingCount (waitingAttendanceCount 아님)
//  2) OT/0회차 등 일부 미션은 missionType 이 null
// 스키마가 이를 수용하지 못하면 z.array 항목 하나가 배열 전체 parse 를 throw 시켜
// 미션 목록이 통째로 사라진다("No rows"). 두 경우 모두 파싱돼야 한다.
describe('missionAdmin 스키마 - v2 응답 내성', () => {
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
    waitingCount: 5,
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

  it('v2 응답의 waitingCount(null 포함)를 그대로 파싱한다', () => {
    const result = missionAdmin.parse({
      missionList: [baseMission, { ...baseMission, id: 2, waitingCount: null }],
    });

    expect(result.missionList[0].waitingCount).toBe(5);
    expect(result.missionList[1].waitingCount).toBeNull();
  });

  it('missionType 이 null 인 미션이 섞여도 throw 하지 않고 전량 파싱한다', () => {
    const result = missionAdmin.parse({
      missionList: [
        baseMission,
        { ...baseMission, id: 2, missionType: null },
      ],
    });

    // 두 미션 모두 살아남아 목록이 유지된다(=No rows 회귀 방지).
    expect(result.missionList).toHaveLength(2);
    expect(result.missionList[1].missionType).toBeNull();
  });
});
