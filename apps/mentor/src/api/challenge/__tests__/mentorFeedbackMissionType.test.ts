/**
 * 경험정리 피드백 통합 — `mentorFeedbackMissionSummarySchema.missionType` 파싱 가드.
 *
 * BE 응답에 `missionType`이 아직 없으므로(요청 대기 중) 스키마는 optional/nullable로 둔다.
 * 필드가 있음 / 없음(undefined) / null 세 경우 모두 파싱에 성공해야, BE 필드 도착 전후로
 * FE가 깨지지 않는다 (PRD §6.1).
 */
import { describe, expect, it } from 'vitest';

import { mentorFeedbackManagementSchema } from '../challengeSchema';

const baseMission = {
  missionId: 1001,
  missionTitle: '4회차 — 경험정리',
  th: 4,
  submittedCount: 5,
  notSubmittedCount: 2,
  feedbackStatusCounts: [],
};

const wrap = (mission: Record<string, unknown>) => ({
  challengeList: [
    {
      challengeId: 1,
      title: '챌린지',
      shortDesc: null,
      startDate: '2026-04-14',
      endDate: '2026-05-04',
      feedbackMissions: [mission],
    },
  ],
});

describe('mentorFeedbackMissionSummarySchema — missionType', () => {
  it('missionType가 있으면 값을 보존한다 (EXPERIENCE_1)', () => {
    const parsed = mentorFeedbackManagementSchema.parse(
      wrap({ ...baseMission, missionType: 'EXPERIENCE_1' }),
    );
    expect(parsed.challengeList[0].feedbackMissions[0].missionType).toBe(
      'EXPERIENCE_1',
    );
  });

  it('missionType가 없으면(undefined) undefined로 파싱된다', () => {
    const parsed = mentorFeedbackManagementSchema.parse(
      wrap({ ...baseMission }),
    );
    expect(
      parsed.challengeList[0].feedbackMissions[0].missionType,
    ).toBeUndefined();
  });

  it('missionType이 null이면 null로 파싱된다 (경험정리 아닌 일반 미션)', () => {
    const parsed = mentorFeedbackManagementSchema.parse(
      wrap({ ...baseMission, missionType: null }),
    );
    expect(parsed.challengeList[0].feedbackMissions[0].missionType).toBeNull();
  });

  it('허용되지 않은 missionType 값은 파싱에 실패한다', () => {
    expect(() =>
      mentorFeedbackManagementSchema.parse(
        wrap({ ...baseMission, missionType: 'INVALID' }),
      ),
    ).toThrow();
  });
});
