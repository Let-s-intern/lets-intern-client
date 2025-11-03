import {
  ACTIVITY_TYPE_KR,
  EXPERIENCE_CATEGORY_KR,
} from '@/api/experienceSchema';
import { Filters } from '@components/common/mypage/experience/ExperienceFilters';

/**
 * ✅ API 응답 데이터를 UI 드롭다운 옵션 형식으로 변환
 * (API → UI)
 */
export const convertFilterResToUiFormat = (data: any) => {
  const addAllOption = (options: { value: string; label: string }[]) => [
    { value: 'ALL', label: '전체' },
    ...options,
  ];

  return {
    availableCategories: addAllOption(
      data.availableCategories.map((key) => {
        const label = EXPERIENCE_CATEGORY_KR[key] ?? key;
        return { value: key, label };
      }),
    ),
    availableActivityTypes: addAllOption(
      data.availableActivityTypes.map((key) => {
        const label = ACTIVITY_TYPE_KR[key] ?? key;
        return { value: key, label };
      }),
    ),
    availableYears: addAllOption(
      data.availableYears.map((key) => {
        const label = String(key) + '년';
        return { value: String(key), label };
      }),
    ),
    availableCoreCompetencies: addAllOption(
      data.availableCoreCompetencies.map((key) => ({
        value: key,
        label: key,
      })),
    ),
  };
};

/**
 * ✅ UI 상태(filters)를 API 요청 페이로드 형식으로 변환
 * (UI → API)
 */
export const convertFilterUiToApiFormat = (filters: Filters) => {
  return {
    experienceCategories:
      filters.category === 'ALL' ? null : [filters.category],
    activityTypes: filters.activity === 'ALL' ? null : [filters.activity],
    years: filters.year === 'ALL' ? null : [Number(filters.year)],
    coreCompetencies:
      filters.coreCompetency === 'ALL' ? null : [filters.coreCompetency],
  };
};
