import type { LiveMentorSort } from '@/api/live-mentoring/liveMentoring';
import { SORT_OPTIONS } from '../constants';

interface SortSelectProps {
  value: LiveMentorSort;
  onChange: (value: LiveMentorSort) => void;
}

/** 정렬 셀렉트 (평점순/후기순/최신순). */
const SortSelect = ({ value, onChange }: SortSelectProps) => {
  return (
    <select
      aria-label="정렬"
      value={value}
      onChange={(e) => onChange(e.target.value as LiveMentorSort)}
      className="border-neutral-80 text-xsmall14 text-neutral-30 rounded-sm border px-3 py-1.5"
    >
      {SORT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SortSelect;
