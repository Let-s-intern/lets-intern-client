import { FilterDropdown } from '@components/common/challenge/my-challenge/section/mission-submit-list-form/components/ExperienceSelectModal/components/FilterDropdown';

const options = [
  { value: 'latest', label: '최신 순' },
  { value: 'recentlyModified', label: '최근 수정일 순' },
  { value: 'oldest', label: '오래된 순' },
];

interface SortFilterDropdownProps {
  sortBy: string;
  onSortChange: (value: string) => void;
}

const SortFilterDropdown = ({
  sortBy,
  onSortChange,
}: SortFilterDropdownProps) => {
  return (
    <FilterDropdown
      options={options}
      selectedValue={sortBy}
      onSelect={onSortChange}
      width="w-64"
      className="w-[8.25rem] border-none"
    />
  );
};

export default SortFilterDropdown;
