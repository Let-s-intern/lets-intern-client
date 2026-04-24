import { Schedule } from '@/schema';
import { useMemo } from 'react';

type ExperienceLevel = 'LV1' | 'LV2';

export const useFilteredSchedules = (
  schedules: Schedule[],
  level: ExperienceLevel,
) => {
  return useMemo(() => {
    return schedules.filter((schedule) => {
      const missionType = schedule.missionInfo.missionType;

      // 경험정리 미션이 아닌 경우 모두 유지
      if (missionType !== 'EXPERIENCE_1' && missionType !== 'EXPERIENCE_2') {
        return true;
      }

      // 경험정리 미션은 레벨에 맞게 필터링
      if (level === 'LV1') {
        return missionType === 'EXPERIENCE_1';
      }

      return missionType === 'EXPERIENCE_2';
    });
  }, [schedules, level]);
};
