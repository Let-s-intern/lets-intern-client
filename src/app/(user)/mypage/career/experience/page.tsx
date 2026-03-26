'use client';

import {
  Sortable,
  UserExperienceType,
} from '@/api/experience/experienceSchema';
import { usePostUserExperienceMutation } from '@/api/user/user';
import ExperienceCreateButton from '@/domain/mypage/experience/ExperienceCreateButton';
import ExperienceDataTable from '@/domain/mypage/experience/ExperienceDataTable';
import ExperienceFilters, {
  Filters,
} from '@/domain/mypage/experience/ExperienceFilters';
import SortFilterDropdown from '@/domain/mypage/experience/SortFilterDropdown';
import { ExperienceForm } from '@/domain/mypage/mypage/experience/ExperienceForm';
import { useControlScroll } from '@/hooks/useControlScroll';
import drawerReducer from '@/reducers/drawerReducer';
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

  const handleCopy = useCallback(
    (copiedExperience: UserExperienceType) => {
      setSelectedExperience(copiedExperience); // 복제된 경험을 선택
      dispatchIsDrawerOpen({ type: 'open' }); // 드로어 열기
    },
    [dispatchIsDrawerOpen],
  );

  const createMutation = usePostUserExperienceMutation();

  return (
    <>
      {isDrawerOpen && (
        <div
          className="fixed bottom-0 left-0 right-0 top-0 z-[100] animate-fade-in bg-black/50"
          onClick={handleDrawerClose}
        >
          <div
            className="absolute bottom-0 right-0 top-0 max-w-[600px] animate-slide-in-right bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <ExperienceForm
              onClose={handleDrawerClose}
              initialData={selectedExperience}
              isCopy={!!(selectedExperience && !selectedExperience.id)}
              createMutation={createMutation}
            />
          </div>
        </div>
      )}
      <div className="flex w-full min-w-0 flex-col gap-3">
        {/* 데스크탑 버전에서의 타이틀+버튼+필터 배치 */}
        <section className="hidden w-full justify-between md:flex">
          <h1 className="text-small18 font-medium">경험 정리 목록</h1>
          <ExperienceCreateButton onClick={handleDrawerOpen} />
        </section>

        <section className="hidden justify-between md:flex">
          <ExperienceFilters
            filters={filters}
            onFiltersChange={handleFilterChange}
            onReset={handleResetFilter}
          />

          <SortFilterDropdown sortBy={sortBy} onSortChange={setSortBy} />
        </section>

        {/* 모바일 버전에서의 타이틀+버튼+필터 배치 */}
        <section className="w-full flex-col md:hidden">
          <h1 className="text-small18 font-medium">경험 정리 목록</h1>

          <div className="mb-2 mt-4 flex justify-between">
            <ExperienceCreateButton onClick={handleDrawerOpen} />
            <SortFilterDropdown sortBy={sortBy} onSortChange={setSortBy} />
          </div>
        </section>

        <section className="-mx-5 flex justify-between border-b border-t border-neutral-85 bg-neutral-95 px-5 py-3 md:hidden">
          <ExperienceFilters
            filters={filters}
            onFiltersChange={handleFilterChange}
            onReset={handleResetFilter}
          />
        </section>

        <div>
          <ExperienceDataTable
            sortBy={sortBy}
            filters={filters}
            onResetFilters={handleResetFilters}
            onRowClick={handleRowClick}
            onCreateClick={handleDrawerOpen}
            onCopy={handleCopy}
          />
        </div>
      </div>
    </>
  );
};

export default Experience;
