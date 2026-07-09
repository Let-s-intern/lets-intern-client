import type { LiveMentorCategoryFilter } from '@/api/live-mentoring/liveMentoring';
import { twMerge } from '@/lib/twMerge';
import { CATEGORY_FILTERS } from '../constants';

interface CategoryFilterProps {
  value: LiveMentorCategoryFilter;
  onChange: (value: LiveMentorCategoryFilter) => void;
}

/** 카테고리 필터 칩 (전체/자소서/이력서/포폴). */
const CategoryFilter = ({ value, onChange }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORY_FILTERS.map((filter) => {
        const active = filter.value === value;
        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => onChange(filter.value)}
            className={twMerge(
              'text-xsmall14 rounded-full border px-4 py-1.5 font-medium transition',
              active
                ? 'border-primary bg-primary text-white'
                : 'border-neutral-80 text-neutral-30 hover:border-primary',
            )}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
