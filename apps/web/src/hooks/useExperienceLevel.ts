import { useSearchUserExperiencesQuery } from '@/api/user/userExperience';
import dayjs from '@/lib/dayjs';
import { Schedule } from '@/schema';
import { useMemo } from 'react';

type ExperienceLevel = 'LV1' | 'LV2';

/**
 * 경험정리 레벨과 판정이 끝났는지.
 *
 * 경험 조회가 끝나기 전에는 LV1 이 기본값이라, 그 사이의 LV1 은 판정 결과가 아니다.
 * 경험정리 미션이 없는 일정은 조회하지 않으므로 바로 판정이 끝난 것으로 본다.
 * 조회가 실패해도 끝난 것으로 본다(LV1). 제출을 영영 막지 않기 위해서다.
 */
export const useExperienceLevelState = (schedules: Schedule[]) => {
  // EXPERIENCE_1 타입의 첫 번째 미션의 startDate 추출
  const experience1MissionStartDate = useMemo(() => {
    const experience1Mission = schedules.find(
      (schedule) => schedule.missionInfo.missionType === 'EXPERIENCE_1',
    );
    return experience1Mission?.missionInfo.startDate ?? null;
  }, [schedules]);

  // 모든 경험 데이터 검색
  const { data: allExperiencesData, isPending } = useSearchUserExperiencesQuery(
    {
      experienceCategories: [],
      activityTypes: [],
      years: [],
      coreCompetencies: [],
      sortType: 'LATEST' as const,
      page: 1,
      size: 100,
    },
    !!experience1MissionStartDate,
  );

  // 레벨 판별 로직. 판정 완료 여부와 같은 렌더에서 맞도록 상태가 아니라 파생값으로 둔다.
  const level = useMemo<ExperienceLevel>(() => {
    if (!experience1MissionStartDate || !allExperiencesData?.userExperiences) {
      return 'LV1';
    }

    const hasUserCreatedExperienceBeforeMissionStart =
      allExperiencesData.userExperiences.some((exp) => {
        const createDate = dayjs(exp.createDate);
        return (
          !exp.isAddedByAdmin &&
          createDate.isBefore(experience1MissionStartDate, 'day')
        );
      });

    return hasUserCreatedExperienceBeforeMissionStart ? 'LV2' : 'LV1';
  }, [experience1MissionStartDate, allExperiencesData]);

  const isLevelReady = !experience1MissionStartDate || !isPending;

  return { level, isLevelReady };
};

export const useExperienceLevel = (schedules: Schedule[]) =>
  useExperienceLevelState(schedules).level;
