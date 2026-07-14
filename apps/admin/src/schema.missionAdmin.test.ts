import { describe, expect, it } from 'vitest';

import { missionAdmin } from './schema';

// 회귀 방지: FE가 실제 호출하는 v2 엔드포인트
// GET /api/v2/admin/challenge/{challengeId}/mission 의 응답 DTO
// (MissionAdminResponseDto)는 대기 인원을 JSON 필드 `waitingCount` 로 내려준다.
// (내부 VO 필드명은 waitingAttendanceCount 이지만 직렬화 시 waitingCount 로 나감)
// 스키마가 `waitingCount` 를 그대로 파싱해야 미션 목록이 정상 렌더된다.
// 필드명을 waitingAttendanceCount 로 바꾸면 실제 응답에 그 키가 없어
// parse 가 throw → 미션이 아예 안 보이는 회귀가 발생한다.
describe('missionAdmin 스키마 - v2 응답 waitingCount 파싱', () => {
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

  it('v2 응답의 waitingCount 를 그대로 파싱한다', () => {
    const result = missionAdmin.parse({ missionList: [baseMission] });

    expect(result.missionList[0].waitingCount).toBe(5);
  });

  it('waitingCount 가 null 이어도 파싱된다', () => {
    const result = missionAdmin.parse({
      missionList: [{ ...baseMission, waitingCount: null }],
    });

    expect(result.missionList[0].waitingCount).toBeNull();
  });
});
