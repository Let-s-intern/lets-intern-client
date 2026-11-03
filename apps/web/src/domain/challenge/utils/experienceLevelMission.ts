import { Schedule, ScheduleMission } from '@/schema';

type ExperienceLevel = 'LV1' | 'LV2';

const MISSION_TYPE_BY_LEVEL = {
  LV1: 'EXPERIENCE_1',
  LV2: 'EXPERIENCE_2',
} as const;

export const isExperienceMissionType = (
  missionType: ScheduleMission['missionType'],
) => missionType === 'EXPERIENCE_1' || missionType === 'EXPERIENCE_2';

/**
 * 선택된 미션이 레벨과 다른 쪽 경험정리 미션이면, 같은 회차의 레벨에 맞는 미션을 돌려준다.
 * 바꿀 필요가 없으면(이미 맞음, 경험정리 아님, 짝 없음, 일정에 없음) null 이다.
 *
 * 서버는 레벨을 모르고 오늘 미션으로 경험정리1 을 준다. 그대로 두면 LV2 멘티가
 * 화면에는 경험정리2 를 보면서 경험정리1 에 제출한다(LC-3555).
 */
export const findLevelCounterpartMission = (
  schedules: Schedule[],
  selectedMissionId: number,
  level: ExperienceLevel,
): Pick<ScheduleMission, 'id' | 'th'> | null => {
  const selected = schedules.find(
    (schedule) => schedule.missionInfo.id === selectedMissionId,
  )?.missionInfo;
  if (!selected || !isExperienceMissionType(selected.missionType)) return null;

  const levelMissionType = MISSION_TYPE_BY_LEVEL[level];
  if (selected.missionType === levelMissionType) return null;

  const counterpart = schedules.find(
    (schedule) =>
      schedule.missionInfo.th === selected.th &&
      schedule.missionInfo.missionType === levelMissionType,
  )?.missionInfo;
  if (!counterpart) return null;

  return { id: counterpart.id, th: counterpart.th };
};
