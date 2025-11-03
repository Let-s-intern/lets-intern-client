import {
  ACTIVITY_TYPE_KR,
  EXPERIENCE_CATEGORY_KR,
  ExperienceFiltersRes,
} from '@/api/experienceSchema';
import { Filters } from '@components/common/mypage/experience/ExperienceFilters';

/**
 * ✅ API 응답 데이터를 UI 드롭다운 옵션 형식으로 변환
 * (API → UI)
 */
export const convertFilterResToUiFormat = (data: ExperienceFiltersRes) => {
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
    experienceCategories: filters.category,
    activityTypes: filters.activity === 'ALL' ? [] : [filters.activity],
    years: filters.year === 'ALL' ? [] : [Number(filters.year)],
    coreCompetencies: filters.coreCompetency,
  };
};

/**
 * ✅ 모든 필터가 '전체' 상태인지 확인
 */
export const isAllFilters = (filters: Filters) => {
  return (
    filters.category.length === 0 &&
    filters.activity === 'ALL' &&
    filters.year === 'ALL' &&
    filters.coreCompetency.length === 0
  );
};

/**
 * ✅ 경험 목록 정렬 (최신 순, 오래된 순, 최근 수정일 순)
 */
export const sortExperiences = (experiences: any[], sortBy: string) => {
  if (!Array.isArray(experiences)) return [];

  const sorted = [...experiences]; // 원본 불변성 유지

  switch (sortBy) {
    case 'recentlyModified':
      return sorted.sort(
        (a, b) =>
          new Date(b.lastModifiedDate).getTime() -
          new Date(a.lastModifiedDate).getTime(),
      );

    case 'oldest':
      return sorted.sort(
        (a, b) =>
          new Date(a.createDate).getTime() - new Date(b.createDate).getTime(),
      );

    default:
      return experiences;
  }
};
