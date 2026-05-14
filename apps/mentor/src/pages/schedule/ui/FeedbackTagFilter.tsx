'use client';

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

/** 피드백 종류별 아이콘 — currentColor로 버튼 텍스트 색상을 상속 */
const FeedbackTagIcon = ({ type }: { type: FeedbackTagType }) => {
  if (type === 'written') {
    return (
      <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="shrink-0" aria-hidden>
        <path
          d="M4.66634 16.6009L5.93631 15.585L5.94565 15.5778C6.21041 15.366 6.34401 15.2591 6.49307 15.1829C6.6268 15.1146 6.7694 15.0649 6.9165 15.0347C7.08231 15.0007 7.25503 15.0007 7.60173 15.0007H14.8359C15.7675 15.0007 16.2338 15.0007 16.59 14.8192C16.9036 14.6594 17.1587 14.4042 17.3185 14.0906C17.5 13.7344 17.5 13.2686 17.5 12.337V5.99808C17.5 5.06648 17.5 4.59999 17.3185 4.24382C17.1587 3.93021 16.9031 3.67543 16.5895 3.51564C16.233 3.33398 15.7669 3.33398 14.8335 3.33398H5.16683C4.23341 3.33398 3.76635 3.33398 3.40983 3.51564C3.09623 3.67543 2.84144 3.93021 2.68166 4.24382C2.5 4.60033 2.5 5.06739 2.5 6.00081V15.56C2.5 16.4481 2.5 16.892 2.68205 17.1201C2.84037 17.3184 3.08036 17.4338 3.33415 17.4335C3.62596 17.4332 3.97287 17.1557 4.66634 16.6009Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (type === 'live') {
    return (
      <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="shrink-0" aria-hidden>
        <path
          d="M12.4997 16.666H7.49967M3.33301 11.4995V6.83284C3.33301 5.89942 3.33301 5.43237 3.51466 5.07585C3.67445 4.76224 3.92924 4.50746 4.24284 4.34767C4.59936 4.16602 5.06642 4.16602 5.99984 4.16602H13.9998C14.9333 4.16602 15.3993 4.16602 15.7558 4.34767C16.0694 4.50746 16.3251 4.76224 16.4849 5.07585C16.6663 5.43202 16.6663 5.89851 16.6663 6.83011V11.5019C16.6663 12.4335 16.6663 12.8993 16.4849 13.2555C16.3251 13.5691 16.0694 13.8247 15.7558 13.9845C15.3997 14.166 14.9338 14.166 14.0022 14.166H5.9971C5.0655 14.166 4.59901 14.166 4.24284 13.9845C3.92924 13.8247 3.67445 13.5691 3.51466 13.2555C3.33301 12.899 3.33301 12.4329 3.33301 11.4995ZM12.083 9.16602L8.33301 6.66602V11.666L12.083 9.16602Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="shrink-0" aria-hidden>
      <path
        d="M3.33301 6.66602H16.6663M3.33301 6.66602V13.9995C3.33301 14.9329 3.33301 15.3994 3.51466 15.7559C3.67445 16.0695 3.92924 16.3247 4.24284 16.4845C4.59901 16.666 5.0655 16.666 5.9971 16.666H14.0027C14.9343 16.666 15.4001 16.666 15.7562 16.4845C16.0698 16.3247 16.3251 16.0695 16.4849 15.7559C16.6663 15.3997 16.6663 14.9339 16.6663 14.0023V6.66602M3.33301 6.66602V5.99951C3.33301 5.06609 3.33301 4.59903 3.51466 4.24251C3.67445 3.92891 3.92924 3.67413 4.24284 3.51434C4.59936 3.33268 5.06642 3.33268 5.99984 3.33268H6.66634M16.6663 6.66602V5.99677C16.6663 5.06518 16.6663 4.59868 16.4849 4.24251C16.3251 3.92891 16.0698 3.67413 15.7562 3.51434C15.3997 3.33268 14.9333 3.33268 13.9998 3.33268H13.333M6.66634 3.33268H13.333M6.66634 3.33268V1.66602M13.333 3.33268V1.66602M12.083 11.666H9.99967M9.99967 11.666H7.91634M9.99967 11.666V9.58268M9.99967 11.666V13.7493"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default FeedbackTagFilter;
