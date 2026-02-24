'use client';

import { FREQUENT_COMPARISON } from '../shared/comparisons';

interface RecommendedComparisonsProps {
  activeIndex: number | null;
  onSelect: (index: number) => void;
}

const RecommendedComparisons = ({
  activeIndex,
  onSelect,
}: RecommendedComparisonsProps) => {
  return (
    <div className="flex items-center gap-3">
      <p className="text-xs font-bold leading-4 text-[#3e4148]">
        추천 비교 조합
      </p>
      <div className="flex flex-wrap gap-2">
        {FREQUENT_COMPARISON.map((item, index) => {
          const isActive = activeIndex === index;
          return (
            <button
              key={item.title}
              type="button"
              onClick={() => onSelect(index)}
              className={`rounded-[20px] px-4 py-2 text-xs font-bold leading-4 transition-all ${
                isActive
                  ? 'border border-[#b8bbfb] bg-[#edeefe] text-[#5f66f6]'
                  : 'bg-[#e7e7e7] text-[#4c4f56] hover:bg-[#edeefe] hover:text-[#5f66f6]'
              }`}
            >
              {item.title}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendedComparisons;
