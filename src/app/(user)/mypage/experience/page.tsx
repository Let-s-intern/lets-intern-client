'use client';

import { Sortable, UserExperienceType } from '@/api/experienceSchema';
import { useControlScroll } from '@/hooks/useControlScroll';
import drawerReducer from '@/reducers/drawerReducer';
import ExperienceCreateButton from '@components/common/mypage/experience/ExperienceCreateButton';
import ExperienceDataTable from '@components/common/mypage/experience/ExperienceDataTable';
import ExperienceFilters, {
  Filters,
} from '@components/common/mypage/experience/ExperienceFilters';
import SortFilterDropdown from '@components/common/mypage/experience/SortFilterDropdown';
import { ExperienceForm } from '@components/pages/mypage/experience/ExperienceForm';
import { useCallback, useReducer, useState } from 'react';

const DEFAULT_FILTERS: Filters = {
  category: [],
  activity: 'ALL',
  year: 'ALL',
  coreCompetency: [],
};

const Experience = () => {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState<Sortable>('LATEST');
  const [isDrawerOpen, dispatchIsDrawerOpen] = useReducer(drawerReducer, false);
  const [selectedExperience, setSelectedExperience] =
    useState<UserExperienceType | null>(null);

  // drawer가 열리면 뒷 배경 스크롤 제한
  useControlScroll(isDrawerOpen);

  const handleFilterChange = (filterType: keyof Filters, value: string) => {
    setFilters((prev) => {
      const currentValue = prev[filterType];

      // 기존 값이 배열일 경우 (다중 선택 필터)
      if (Array.isArray(currentValue)) {
        if (value === 'ALL') {
          return { ...prev, [filterType]: [] };
        }

        const nextValue = currentValue.includes(value as any)
          ? currentValue.filter((v) => v !== value)
          : [...currentValue, value];

        return { ...prev, [filterType]: nextValue };
      }

      // 단일 선택 필터일 경우
      return { ...prev, [filterType]: value };
    });
  };

  const handleResetFilter = (filterType: keyof Filters) => {
    setFilters((prev) => {
      if (filterType === 'category') {
        return { ...prev, category: [] };
      }
      if (filterType === 'coreCompetency') {
        return { ...prev, coreCompetency: [] };
      }
      return { ...prev, [filterType]: 'ALL' };
    });
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleDrawerOpen = useCallback(() => {
    setSelectedExperience(null); // 생성 모드
    dispatchIsDrawerOpen({
      type: 'open',
    });
  }, [dispatchIsDrawerOpen]);

  const handleDrawerClose = useCallback(() => {
    setSelectedExperience(null);
    dispatchIsDrawerOpen({
      type: 'close',
    });
  }, [dispatchIsDrawerOpen]);

  const handleRowClick = useCallback(
    (experience: UserExperienceType) => {
      setSelectedExperience(experience); // 수정 모드
      dispatchIsDrawerOpen({
        type: 'open',
      });
    },
    [dispatchIsDrawerOpen],
  );

  return (
    <>
      {isDrawerOpen && (
        <div className="animate-fadeIn fixed bottom-0 left-0 right-0 top-0 z-[100] bg-black/50 md:mb-0">
          <div className="animate-slideInRight absolute bottom-0 right-0 top-0 max-w-[600px] bg-white">
            <ExperienceForm
              onClose={handleDrawerClose}
              initialData={selectedExperience}
            />
          </div>
        </div>
      )}
      <div className="flex w-full flex-col gap-3 pb-20">
        {/* 데스크탑 버전에서의 타이틀+버튼+필터 배치 */}
        <section className="hidden w-full justify-between px-5 md:flex">
          <h1 className="text-lg font-semibold">경험 정리 목록</h1>
          <ExperienceCreateButton onClick={handleDrawerOpen} />
        </section>

        <section className="hidden justify-between px-5 md:flex">
          <ExperienceFilters
            filters={filters}
            onFiltersChange={handleFilterChange}
            onReset={handleResetFilter}
          />

          <SortFilterDropdown sortBy={sortBy} onSortChange={setSortBy} />
        </section>

        {/* 모바일 버전에서의 타이틀+버튼+필터 배치 */}
        <section className="w-full flex-col px-5 md:hidden">
          <h1 className="text-lg font-semibold">경험 정리 목록</h1>

          <div className="mb-2 mt-4 flex justify-between">
            <ExperienceCreateButton onClick={handleDrawerOpen} />
            <SortFilterDropdown sortBy={sortBy} onSortChange={setSortBy} />
          </div>
        </section>

        <section className="flex justify-between border-b border-t border-neutral-85 bg-neutral-95 px-5 py-3 md:hidden">
          <ExperienceFilters
            filters={filters}
            onFiltersChange={handleFilterChange}
            onReset={handleResetFilter}
          />
        </section>

        <div className="px-5">
          <ExperienceDataTable
            sortBy={sortBy}
            filters={filters}
            onResetFilters={handleResetFilters}
            onRowClick={handleRowClick}
            onCreateClick={handleDrawerOpen}
          />
        </div>
      </div>
    </>
  );
};

export default Experience;
