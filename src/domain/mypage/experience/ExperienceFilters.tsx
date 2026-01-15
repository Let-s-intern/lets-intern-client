import { useGetUserExperienceFiltersQuery } from '@/api/experience';
import { ActivityType, CategoryType } from '@/api/experienceSchema';
import { FilterDropdown } from '@/domain/challenge/my-challenge/section/mission-submit-list-form/components/ExperienceSelectModal/components/FilterDropdown';
import { MultiFilterDropdown } from '@/domain/challenge/my-challenge/section/mission-submit-list-form/components/ExperienceSelectModal/components/MultiFilterDropdown';
import { convertFilterResToUiFormat } from '@/utils/experience';
import { useEffect, useMemo } from 'react';

export interface Filters {
  category: CategoryType[];
  activity: ActivityType | 'ALL';
  year: string;
  coreCompetency: string[];
}

interface ExperienceFiltersProps {
  filters: Filters;
  onFiltersChange: (filterType: keyof Filters, value: string) => void;
  onReset: (filterType: keyof Filters) => void;
}

const ExperienceFilters = ({
  filters,
  onFiltersChange,
  onReset,
}: ExperienceFiltersProps) => {
  const { data: userExperienceFilters } = useGetUserExperienceFiltersQuery();

  const filterOptions = useMemo(
    () =>
      userExperienceFilters
        ? convertFilterResToUiFormat(userExperienceFilters)
        : EXPERIENCE_FILTER_OPTIONS,
    [userExperienceFilters],
  );

  useEffect(() => {
    const availableCompetencyValues =
      filterOptions.availableCoreCompetencies.map((opt) => opt.value);
    const availableYearValues = filterOptions.availableYears.map(
      (opt) => opt.value,
    );
    // 핵심 역량 필터
    const invalidCompetencies = filters.coreCompetency.filter(
      (comp) => !availableCompetencyValues.includes(comp),
    );
    if (invalidCompetencies.length > 0) {
      onReset('coreCompetency');
    }

    // 연도 필터
    if (filters.year !== 'ALL' && !availableYearValues.includes(filters.year)) {
      onFiltersChange('year', 'ALL');
    }
  }, [filterOptions, filters, onFiltersChange]);

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide md:overflow-visible">
      <MultiFilterDropdown
        labelPrefix="경험 분류"
        options={filterOptions.availableCategories}
        selectedValues={filters.category}
        onSelect={(value) => onFiltersChange('category', value)}
        onReset={() => onReset('category')}
        width="min-w-[8.25rem]"
      />
      <FilterDropdown
        labelPrefix="팀·개인"
        options={filterOptions.availableActivityTypes}
        selectedValue={filters.activity}
        onSelect={(value) => onFiltersChange('activity', value)}
        width="min-w-[7.5rem]"
      />
      <FilterDropdown
        labelPrefix="연도"
        options={filterOptions.availableYears}
        selectedValue={filters.year}
        onSelect={(value) => onFiltersChange('year', value)}
        width="min-w-[6.5rem]"
      />
      <MultiFilterDropdown
        labelPrefix="핵심 역량"
        options={filterOptions.availableCoreCompetencies}
        selectedValues={filters.coreCompetency}
        onSelect={(value) => onFiltersChange('coreCompetency', value)}
        onReset={() => onReset('coreCompetency')}
        width="min-w-[8.25rem]"
      />
    </div>
  );
};

export default ExperienceFilters;

interface FilterOption {
  value: string;
  label: string;
}

interface ExperienceFilterOptions {
  availableCategories: FilterOption[];
  availableActivityTypes: FilterOption[];
  availableYears: FilterOption[];
  availableCoreCompetencies: FilterOption[];
}

const EXPERIENCE_FILTER_OPTIONS: ExperienceFilterOptions = {
  availableCategories: [],
  availableActivityTypes: [{ value: 'ALL', label: '전체' }],
  availableYears: [{ value: 'ALL', label: '전체' }],
  availableCoreCompetencies: [],
};
