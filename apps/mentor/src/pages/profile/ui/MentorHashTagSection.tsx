'use client';

import { useEffect, useMemo, useState } from 'react';

import { CategoryTabs } from '@letscareer/ui';

import {
  useMentorHashTagListQuery,
  useMyMentorHashTagListQuery,
  usePutMyMentorHashTag,
} from '@/api/mentor-hash-tag/mentorHashTag';
import type { MentorHashTagItem } from '@/api/mentor-hash-tag/mentorHashTagSchema';
import SolidButton from '@/common/button/SolidButton';
import MentorAlertModal from '@/common/modal/MentorAlertModal';
import { useMentorAlert } from '@/hooks/useMentorAlert';
import { twMerge } from '@/lib/twMerge';

const MENTOR_HASH_TAG_TYPE_LABELS: Record<string, string> = {
  JOB: '관련 직무',
};

const getTypeLabel = (type: string) =>
  MENTOR_HASH_TAG_TYPE_LABELS[type] ?? type;

const ALL_OPTION = { value: 'all', label: '전체' };

export default function MentorHashTagSection() {
  const { data: allTags, isLoading: isAllLoading } =
    useMentorHashTagListQuery();
  const { data: myTags, isLoading: isMyLoading } =
    useMyMentorHashTagListQuery();
  const putMutation = usePutMyMentorHashTag();
  const { alertProps, showAlert } = useMentorAlert();

  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!myTags) return;
    const ids = new Set(myTags.map((tag) => tag.id));
    setSelectedIds(ids);
    setSavedIds(ids);
  }, [myTags]);

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
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const isDirty = useMemo(() => {
    if (selectedIds.size !== savedIds.size) return true;
    for (const id of selectedIds) {
      if (!savedIds.has(id)) return true;
    }
    return false;
  }, [selectedIds, savedIds]);

  const handleSave = async () => {
    try {
      await putMutation.mutateAsync({
        mentorHashTagIdList: Array.from(selectedIds),
      });
      setSavedIds(new Set(selectedIds));
      showAlert({ title: '해시태그가 저장되었습니다.', variant: 'success' });
    } catch {
      showAlert({ title: '저장에 실패했습니다.', variant: 'error' });
    }
  };

  const isLoading = isAllLoading || isMyLoading;

  return (
    <section className="border-neutral-80 bg-static-100 rounded-xl border p-5 md:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xsmall16 md:text-small18 text-neutral-0 font-medium">
          해시태그(노출 필터링)
        </h2>
        <SolidButton
          size="xs"
          onClick={handleSave}
          disabled={!isDirty || putMutation.isPending}
        >
          해시태그 저장
        </SolidButton>
      </div>

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

      <MentorAlertModal {...alertProps} />
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
