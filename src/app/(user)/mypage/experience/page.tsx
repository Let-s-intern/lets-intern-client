'use client';

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
  const [sortBy, setSortBy] = useState('latest');
  const [isDrawerOpen, dispatchIsDrawerOpen] = useReducer(drawerReducer, false);

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

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleDrawerOpen = useCallback(() => {
    dispatchIsDrawerOpen({
      type: 'open',
    });
  }, [dispatchIsDrawerOpen]);

  const handleDrawerClose = useCallback(() => {
    // TODO: 작성 중 닫을 경우 고려
    dispatchIsDrawerOpen({
      type: 'close',
    });
  }, [dispatchIsDrawerOpen]);

  return (
    <>
      {isDrawerOpen && (
        <div className="fixed bottom-0 left-0 right-0 top-0 z-30 bg-black/50">
          <div className="absolute bottom-0 right-0 top-0 w-[600px] bg-white">
            <ExperienceForm onClose={handleDrawerClose} />
          </div>
        </div>
      )}
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

          <SortFilterDropdown sortBy={sortBy} onSortChange={setSortBy} />
        </section>

        <ExperienceDataTable
          sortBy={sortBy}
          filters={filters}
          onResetFilters={handleResetFilters}
        />
      </div>
    </>
  );
};

export default Experience;
