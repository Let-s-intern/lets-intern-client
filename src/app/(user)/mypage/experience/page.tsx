'use client';

import ExperienceCreateButton from '@components/common/mypage/experience/ExperienceCreateButton';
import ExperienceDataTable from '@components/common/mypage/experience/ExperienceDataTable';
import ExperienceFilters, {
  Filters,
} from '@components/common/mypage/experience/ExperienceFilters';
import { useState } from 'react';

const DEFAULT_FILTERS: Filters = {
  category: 'ALL',
  activity: 'ALL',
  year: 'ALL',
  coreCompetency: 'ALL',
} as const;

const Experience = () => {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const handleFilterChange = (filterType: keyof Filters, value: string) => {
    setFilters({
      ...filters,
      [filterType]: value,
    });
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  return (
    <div className="flex w-full flex-col gap-3 px-5 pb-20">
      <section className="flex w-full justify-between">
        <h1 className="text-lg font-semibold">경험 정리 목록</h1>
        <ExperienceCreateButton />
      </section>

      <section className="flex justify-between">
        <ExperienceFilters
          filters={filters}
          onFiltersChange={handleFilterChange}
        />
        {/* 정렬 필터 영역 (추후 구현) */}
      </section>

      <ExperienceDataTable
        filters={filters}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};

export default Experience;

// // 임시: 경험 추가 뮤테이션 테스트
// const { mutate: postUserExperience } = usePostUserExperienceMutation();
// useEffect(() => {
//   // 임시 데이터 추가 (테스트 용도)
//   postUserExperience({
//     startDate: '2025-10-29',
//     endDate: '2025-10-29',
//     title: '제목',
//     activityType: 'TEAM',
//     experienceCategory: 'ACADEMIC',
//     role: 'FE',
//     situation: 'test',
//     task: 'test',
//     action: 'test',
//     result: 'test',
//     // coreCompetency: 'test',
//     // customCategoryName: 'test',
//     isAdminAdded: false,
//   });
// }, []);
