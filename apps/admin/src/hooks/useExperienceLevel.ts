import { useSearchUserExperiencesQuery } from '@/api/user/userExperience';
import dayjs from '@/lib/dayjs';
import { Schedule } from '@/schema';
import { useEffect, useMemo, useState } from 'react';

type ExperienceLevel = 'LV1' | 'LV2';

export const useExperienceLevel = (schedules: Schedule[]) => {
  const [level, setLevel] = useState<ExperienceLevel>('LV1');

  // EXPERIENCE_1 타입의 첫 번째 미션의 startDate 추출
  const experience1MissionStartDate = useMemo(() => {
    const experience1Mission = schedules.find(
      (schedule) => schedule.missionInfo.missionType === 'EXPERIENCE_1',
    );
    return experience1Mission?.missionInfo.startDate ?? null;
  }, [schedules]);

  // 모든 경험 데이터 검색
  const { data: allExperiencesData } = useSearchUserExperiencesQuery(
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

  // 레벨 판별 로직
  useEffect(() => {
    if (!experience1MissionStartDate || !allExperiencesData?.userExperiences) {
      setLevel('LV1');
      return;
    }

    const hasUserCreatedExperienceBeforeMissionStart =
      allExperiencesData.userExperiences.some((exp) => {
        const createDate = dayjs(exp.createDate);
        return (
          !exp.isAddedByAdmin &&
          createDate.isBefore(experience1MissionStartDate, 'day')
        );
      });

    setLevel(hasUserCreatedExperienceBeforeMissionStart ? 'LV2' : 'LV1');
  }, [experience1MissionStartDate, allExperiencesData]);

  return level;
};
