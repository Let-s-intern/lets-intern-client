'use client';

import { useMemo, useState } from 'react';

import { CategoryTabs } from '@letscareer/ui';

import { useMentorHashTagListQuery } from '@/api/mentor-hash-tag/mentorHashTag';
import type { MentorHashTagItem } from '@/api/mentor-hash-tag/mentorHashTagSchema';
import { twMerge } from '@/lib/twMerge';

const MENTOR_HASH_TAG_TYPE_LABELS: Record<string, string> = {
  JOB: '관련 직무',
};

const getTypeLabel = (type: string) =>
  MENTOR_HASH_TAG_TYPE_LABELS[type] ?? type;

const ALL_OPTION = { value: 'all', label: '전체' };

interface MentorHashTagSectionProps {
  /** 선택된 태그 id. 값의 주인은 `ProfilePage` 다. */
  selectedIds: ReadonlySet<number>;
  onChange: (next: Set<number>) => void;
  /** 내 태그(선택 상태)를 부모가 아직 받아오는 중인지. 미선택 상태가 잠깐 비치는 것을 막는다. */
  isSelectionLoading: boolean;
}

/**
 * 해시태그(노출 필터링) 선택.
 *
 * 저장 버튼이 없다 — 프로필 화면의 저장은 하단 플로팅 바 하나뿐이다(LC-3266).
 * 예전에는 이 섹션이 자기 저장 버튼과 자기 mutation 을 갖고 있어서, 멘토가 "저장"을
 * 눌러도 해시태그만 빠진 채 저장되는 일이 있었다.
 */
export default function MentorHashTagSection({
  selectedIds,
  onChange,
  isSelectionLoading,
}: MentorHashTagSectionProps) {
  const { data: allTags, isLoading: isAllLoading } =
    useMentorHashTagListQuery();

  const [typeFilter, setTypeFilter] = useState('all');

  const typeOptions = useMemo(() => {
    const uniqueTypes = Array.from(
      new Set((allTags ?? []).map((tag) => tag.type)),
    );
    return [
      ALL_OPTION,
      ...uniqueTypes.map((type) => ({
        value: type,
        label: getTypeLabel(type),
      })),
    ];
  }, [allTags]);

  const visibleTags = useMemo(() => {
    const tags = allTags ?? [];
    return typeFilter === 'all'
      ? tags
      : tags.filter((tag) => tag.type === typeFilter);
  }, [allTags, typeFilter]);

  const toggleTag = (id: number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onChange(next);
  };

  const isLoading = isAllLoading || isSelectionLoading;

  return (
    <section className="border-neutral-80 bg-static-100 rounded-xl border p-5 md:p-6">
      <h2 className="text-xsmall16 md:text-small18 text-neutral-0 font-medium">
        해시태그(노출 필터링)
      </h2>

      {isLoading ? (
        <div className="text-xsmall14 text-neutral-40 py-4">로딩 중...</div>
      ) : (
        <div className="mt-4 flex flex-col gap-5 md:gap-6">
          <CategoryTabs
            options={typeOptions}
            selected={typeFilter}
            onChange={setTypeFilter}
            className="pl-0"
          />

          <div className="flex flex-wrap gap-2">
            {visibleTags.length === 0 ? (
              <span className="text-xsmall14 text-neutral-40">
                등록된 해시태그가 없습니다.
              </span>
            ) : (
              visibleTags.map((tag) => (
                <HashTagChip
                  key={tag.id}
                  tag={tag}
                  isSelected={selectedIds.has(tag.id)}
                  onToggle={() => toggleTag(tag.id)}
                />
              ))
            )}
          </div>
        </div>
      )}
    </section>
  );
}

interface HashTagChipProps {
  tag: MentorHashTagItem;
  isSelected: boolean;
  onToggle: () => void;
}

const HashTagChip = ({ tag, isSelected, onToggle }: HashTagChipProps) => (
  <button
    type="button"
    onClick={onToggle}
    aria-pressed={isSelected}
    className={twMerge(
      'md:text-xsmall14 text-xxsmall12 rounded-full border px-3 py-2 transition-colors',
      isSelected
        ? 'border-primary bg-primary-5 text-primary font-medium'
        : 'border-neutral-80 text-neutral-40 hover:bg-neutral-95',
    )}
  >
    # {tag.title}
  </button>
);
