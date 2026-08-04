'use client';

import { mentorHashTagListQueryOptions } from '@/api/mentor/mentor';
import { FULL_NAVBAR_HEIGHT_OFFSET } from '@/common/layout/header/NavBar';
import { twMerge } from '@/lib/twMerge';
import { useQuery } from '@tanstack/react-query';

import FilterChips from '../ui/FilterChips';

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
      <section
        className={twMerge(
          'bg-static-100 sticky z-20 min-h-10 w-full md:static md:mt-[54px] md:min-h-20',
          FULL_NAVBAR_HEIGHT_OFFSET,
        )}
      />
    );
  }

  return (
    <section
      className={twMerge(
        'bg-static-100 sticky z-20 flex w-full flex-col gap-5 py-2 md:static md:mt-12 md:gap-10 md:py-0',
        FULL_NAVBAR_HEIGHT_OFFSET,
      )}
    >
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
