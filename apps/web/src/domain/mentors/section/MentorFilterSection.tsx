'use client';

import { mentorHashTagListQueryOptions } from '@/api/mentor/mentor';
import { useQuery } from '@tanstack/react-query';

import FilterChips from '../ui/FilterChips';

/** 백엔드 해시태그 type 값 → 유저 페이지 표시 라벨. 어드민 표시 라벨과는 별개로 관리한다. */
const MENTOR_HASH_TAG_TYPE_LABELS: Record<string, string> = {
  JOB: '관심 직무',
};

const getTypeLabel = (type: string) =>
  MENTOR_HASH_TAG_TYPE_LABELS[type] ?? type;

const ALL_OPTION = { value: 'all', label: '전체' };

interface MentorFilterSectionProps {
  selected: Record<string, string>;
  onChange: (selected: Record<string, string>) => void;
}

const MentorFilterSection = ({
  selected,
  onChange,
}: MentorFilterSectionProps) => {
  const { data, isLoading } = useQuery(mentorHashTagListQueryOptions());
  const hashTags = data ?? [];

  const byType = new Map<string, { value: string; label: string }[]>();
  for (const tag of hashTags) {
    const options = byType.get(tag.type) ?? [];
    options.push({ value: String(tag.id), label: tag.title });
    byType.set(tag.type, options);
  }
  const groups = Array.from(byType.entries()).map(([type, options]) => ({
    type,
    label: getTypeLabel(type),
    options: [ALL_OPTION, ...options],
  }));

  if (isLoading) {
    return (
      <section className="mt-2 min-h-10 w-full md:mt-[54px] md:min-h-20" />
    );
  }

  return (
    <section className="mt-4 flex w-full flex-col gap-5 md:mt-12 md:gap-10">
      {groups.map((group) => (
        <div
          key={group.type}
          className="flex flex-row items-center gap-5 md:flex-col md:items-start"
        >
          <h2 className="text-xsmall14 md:text-small18 text-neutral-0 shrink-0 whitespace-nowrap font-semibold">
            {group.label}
          </h2>
          <div className="min-w-0 flex-1">
            <FilterChips
              options={group.options}
              selected={selected[group.type] ?? 'all'}
              onChange={(value) =>
                onChange({ ...selected, [group.type]: value })
              }
            />
          </div>
        </div>
      ))}
    </section>
  );
};

export default MentorFilterSection;
