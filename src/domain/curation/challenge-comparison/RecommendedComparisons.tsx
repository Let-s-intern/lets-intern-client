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
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold text-neutral-50">추천 비교 조합</p>
      <div className="flex flex-wrap gap-2">
        {FREQUENT_COMPARISON.map((item, index) => {
          const isActive = activeIndex === index;
          return (
            <button
              key={item.title}
              type="button"
              onClick={() => onSelect(index)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                isActive
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                  : 'border-neutral-80 bg-white text-neutral-40 hover:border-indigo-300 hover:text-indigo-500'
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
