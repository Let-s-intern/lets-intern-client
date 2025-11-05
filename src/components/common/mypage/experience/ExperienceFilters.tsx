import { useGetUserExperienceFiltersQuery } from '@/api/experience';
import { ActivityType, CategoryType } from '@/api/experienceSchema';
import { convertFilterResToUiFormat } from '@/utils/experience';
import { FilterDropdown } from '@components/common/challenge/my-challenge/section/mission-submit-list-form/components/ExperienceSelectModal/components/FilterDropdown';
import { MultiFilterDropdown } from '@components/common/challenge/my-challenge/section/mission-submit-list-form/components/ExperienceSelectModal/components/MultiFilterDropdown';
import { useMemo } from 'react';

export interface Filters {
  category: CategoryType[];
  activity: ActivityType | 'ALL';
  year: string;
  coreCompetency: string[];
}

interface ExperienceFiltersProps {
  filters: Filters;
  onFiltersChange: (filterType: keyof Filters, value: string) => void;
}

const ExperienceFilters = ({
  filters,
  onFiltersChange,
}: ExperienceFiltersProps) => {
  const { data: userExperienceFilters } = useGetUserExperienceFiltersQuery();

  const filterOptions = useMemo(
    () =>
      userExperienceFilters
        ? convertFilterResToUiFormat(userExperienceFilters)
        : EXPERIENCE_FILTER_OPTIONS,
    [userExperienceFilters],
  );

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
      <MultiFilterDropdown
        labelPrefix="경험 분류"
        options={filterOptions.availableCategories}
        selectedValues={filters.category}
        onSelect={(value) => onFiltersChange('category', value)}
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
