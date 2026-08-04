'use client';

import { useMentorHashTagListQuery } from '@/api/mentor/mentor';
import { useMemo, useState } from 'react';

import FilterChips from '../ui/FilterChips';

/** 백엔드 해시태그 type 값 → 유저 페이지 표시 라벨. 어드민 표시 라벨과는 별개로 관리한다. */
const MENTOR_HASH_TAG_TYPE_LABELS: Record<string, string> = {
  JOB: '관심 직무',
};

const getTypeLabel = (type: string) =>
  MENTOR_HASH_TAG_TYPE_LABELS[type] ?? type;

const ALL_OPTION = { value: 'all', label: '전체' };

const MentorFilterSection = () => {
  const { data } = useMentorHashTagListQuery();
  const hashTags = useMemo(() => data ?? [], [data]);

  const groups = useMemo(() => {
    const byType = new Map<string, { value: string; label: string }[]>();
    for (const tag of hashTags) {
      const options = byType.get(tag.type) ?? [];
      options.push({ value: String(tag.id), label: tag.title });
      byType.set(tag.type, options);
    }
    return Array.from(byType.entries()).map(([type, options]) => ({
      type,
      label: getTypeLabel(type),
      options: [ALL_OPTION, ...options],
    }));
  }, [hashTags]);

  const [selected, setSelected] = useState<Record<string, string>>({});

  return (
    <section className="mt-12 flex w-full flex-col gap-10">
      {groups.map((group) => (
        <div key={group.type} className="flex flex-col gap-5">
          <h2 className="text-small18 text-neutral-0 font-semibold">
            {group.label}
          </h2>
          <FilterChips
            options={group.options}
            selected={selected[group.type] ?? 'all'}
            onChange={(value) =>
              setSelected((prev) => ({ ...prev, [group.type]: value }))
            }
          />
        </div>
      ))}
    </section>
  );
};

export default MentorFilterSection;
