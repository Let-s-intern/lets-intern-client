import { Sortable } from '@/api/experience/experienceSchema';
import { FilterDropdown } from '@/domain/challenge/my-challenge/section/mission-submit-list-form/components/ExperienceSelectModal/components/FilterDropdown';

const options = [
  { value: 'LATEST', label: '최신 순' },
  { value: 'RECENTLY_EDITED', label: '최근 수정일 순' },
  { value: 'OLDEST', label: '오래된 순' },
];

interface SortFilterDropdownProps {
  sortBy: Sortable;
  onSortChange: (value: Sortable) => void;
}

const SortFilterDropdown = ({
  sortBy,
  onSortChange,
}: SortFilterDropdownProps) => {
  return (
    <FilterDropdown
      labelPrefix="정렬"
      isHideLabel={true}
      options={options}
      selectedValue={sortBy}
      onSelect={(value) => onSortChange(value as Sortable)}
      width="w-64"
      className="w-[8.25rem] border-none"
    />
  );
};

export default SortFilterDropdown;
