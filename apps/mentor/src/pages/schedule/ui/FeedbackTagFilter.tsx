'use client';

import LiveFeedbackIcon from '@/common/icon/feedback/LiveFeedbackIcon';
import LiveFeedbackOpenIcon from '@/common/icon/feedback/LiveFeedbackOpenIcon';
import WrittenFeedbackIcon from '@/common/icon/feedback/WrittenFeedbackIcon';
import { twMerge } from '@/lib/twMerge';

import {
  FEEDBACK_TAGS,
  type FeedbackTagDescriptor,
  type FeedbackTagType,
} from '../constants/feedbackTag';

interface FeedbackTagFilterProps {
  /** 선택된 피드백 태그들 — 빈 집합이면 "전체" 모드 */
  selectedTags: ReadonlySet<FeedbackTagType>;
  /** 단일 태그 토글 */
  onToggle: (tag: FeedbackTagType) => void;
  /** "전체" 클릭 — 모든 선택 해제 */
  onClearAll: () => void;
}

/**
 * 일정 카드 / 캘린더 필터 — 피드백 종류 기반 (PRD-0503 #4).
 *
 * 디자인 참조: `.claude/tasks/피드백 테그.png`
 *  [전체] [💬 서면 피드백] [▶ LIVE 피드백] [📅 LIVE 피드백 일정 오픈]
 *
 * 챌린지명 기반 색상 태그를 폐기하고 피드백 종류로 분류한다.
 */
const FeedbackTagFilter = ({
  selectedTags,
  onToggle,
  onClearAll,
}: FeedbackTagFilterProps) => {
  const isAllSelected = selectedTags.size === 0;

  return (
    <div className="flex flex-wrap items-center gap-2 md:gap-3">
      <button
        type="button"
        onClick={onClearAll}
        className={twMerge(
          'rounded-md border border-neutral-80 bg-white px-3 py-1.5 text-xs font-medium leading-5 transition-colors',
          isAllSelected
            ? 'border-primary bg-primary text-white'
            : 'text-neutral-500 hover:bg-neutral-50',
        )}
      >
        전체
      </button>
      {FEEDBACK_TAGS.map((tag) => (
        <FeedbackTagButton
          key={tag.type}
          tag={tag}
          isSelected={selectedTags.has(tag.type)}
          onToggle={() => onToggle(tag.type)}
        />
      ))}
    </div>
  );
};

interface FeedbackTagButtonProps {
  tag: FeedbackTagDescriptor;
  isSelected: boolean;
  onToggle: () => void;
}

/** 단일 태그 버튼 — 아이콘 + 라벨, 선택 시 active 색상으로 전환 */
const FeedbackTagButton = ({
  tag,
  isSelected,
  onToggle,
}: FeedbackTagButtonProps) => {
  const colorClass = isSelected ? tag.activeClass : tag.inactiveClass;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={twMerge(
        'flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium leading-5 transition-colors',
        colorClass,
      )}
      aria-pressed={isSelected}
    >
      <FeedbackTagIcon type={tag.type} />
      {tag.label}
    </button>
  );
};

/** 피드백 종류별 아이콘 */
const FeedbackTagIcon = ({ type }: { type: FeedbackTagType }) => {
  if (type === 'written') {
    return <WrittenFeedbackIcon size={14} className="shrink-0" />;
  }
  if (type === 'live') {
    return <LiveFeedbackIcon size={14} className="shrink-0" />;
  }
  return <LiveFeedbackOpenIcon size={14} className="shrink-0" />;
};

export default FeedbackTagFilter;
