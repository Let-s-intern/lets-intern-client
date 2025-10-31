'use client';

import { useControlScroll } from '@/hooks/useControlScroll';
import drawerReducer from '@/reducers/drawerReducer';
import ExperienceCreateButton from '@components/common/mypage/experience/ExperienceCreateButton';
import ExperienceDataTable from '@components/common/mypage/experience/ExperienceDataTable';
import ExperienceFilters, {
  Filters,
} from '@components/common/mypage/experience/ExperienceFilters';
import SortFilterDropdown from '@components/common/mypage/experience/SortFilterDropdown';
import { ExperienceForm } from '@components/pages/mypage/experience/ExperienceForm';
import { Plus } from 'lucide-react';
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
        <div className="fixed bottom-0 left-0 right-0 top-0 z-30 mb-[57px] bg-black/50 md:mb-0">
          <div className="absolute bottom-0 right-0 top-0 max-w-[600px] bg-white">
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

// TODO: props로 variant 등 추가 예정
interface SolidButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

const SolidButton = ({ children, onClick }: SolidButtonProps) => {
  return (
    <button
      className="flex cursor-pointer items-center gap-1 rounded-xs bg-primary-10 px-3 py-2 text-primary hover:bg-primary-15"
      onClick={onClick}
    >
      <Plus size={16} />
      <span className="text-sm font-medium">{children}</span>
    </button>
  );
};
