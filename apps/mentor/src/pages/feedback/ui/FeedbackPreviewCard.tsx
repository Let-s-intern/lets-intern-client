'use client';

import LexicalContent from '@/common/lexical/LexicalContent';
import { twMerge } from '@/lib/twMerge';
import { feedbackModalDesign } from '@/pages/feedback/feedbackModalDesign';

import { PencilIcon } from './panelIcons';

interface FeedbackPreviewCardProps {
  /** 저장된 피드백 본문 (Lexical editor state JSON 문자열). */
  content?: string | null;
  /** 카드 클릭 시 — 작성 화면(크게 보기)으로 전환. */
  onOpen: () => void;
  /** 상태 보조 문구(예: "임시저장됨" / "제출 완료"). */
  statusLabel?: string | null;
}

/** JSON 파싱 실패까지 흡수해 렌더 가능한 root 만 돌려준다. */
function parseRoot(content?: string | null) {
  if (!content) return null;
  try {
    const parsed = JSON.parse(content);
    return parsed?.root ?? null;
  } catch {
    return null;
  }
}

/**
 * 작성한 피드백 미리보기 — 라이브 모달 기본 화면용.
 *
 * 기본 화면에는 예약 정보만 있어 "이 멘티 피드백을 썼는지"를 확인하려면 매번
 * 작성 화면을 열어야 했다. 읽기 전용 미리보기를 두어 한눈에 보이게 하고,
 * 카드를 누르면 그대로 작성 화면(전체화면)으로 넘어간다.
 *
 * 본문은 카드 안에서만 스크롤되므로 분량이 늘어도 바깥 레이아웃을 밀지 않는다.
 */
const FeedbackPreviewCard = ({
  content,
  onOpen,
  statusLabel,
}: FeedbackPreviewCardProps) => {
  const root = parseRoot(content);
  const hasContent = root != null;

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={
        hasContent ? '작성한 피드백 이어서 수정하기' : '피드백 작성하기'
      }
      className={twMerge(
        feedbackModalDesign.cardSurface,
        // 클릭 가능한 카드임을 커서와 테두리 강조로 알린다(배경은 칠하지 않는다 —
        // 다른 카드와 표면이 달라지면 비활성 영역처럼 읽힌다).
        'group flex min-h-0 flex-1 cursor-pointer flex-col text-left transition-colors hover:border-neutral-300',
      )}
    >
      <div className="flex shrink-0 items-center gap-2">
        <p className="text-xs font-medium text-neutral-400">작성한 피드백</p>
        {statusLabel && (
          <span className="text-xs text-neutral-400">· {statusLabel}</span>
        )}
        {/* 진입 단서는 항상 노출한다(호버에서만 뜨면 누를 수 있는지 알 수 없다).
            모양은 다른 진입 버튼과 같은 토큰을 쓴다. 카드 자체가 button 이라
            중첩을 피해 span 으로 렌더한다. */}
        <span
          className={twMerge(
            feedbackModalDesign.panelEntryButtonCompact,
            'ml-auto transition-colors group-hover:bg-neutral-100',
          )}
        >
          <PencilIcon size={14} />
          {hasContent ? '이어서 수정하기' : '피드백 작성하기'}
        </span>
      </div>

      {hasContent ? (
        <div className="text-xsmall14 mt-3 min-h-0 flex-1 overflow-y-auto text-neutral-700">
          <LexicalContent node={root} />
        </div>
      ) : (
        <div className="mt-3 flex min-h-0 flex-1 flex-col items-center justify-center gap-1">
          <p className="text-sm text-neutral-400">
            아직 작성한 피드백이 없습니다
          </p>
          <p className="text-xs text-neutral-300">눌러서 작성을 시작하세요</p>
        </div>
      )}
    </button>
  );
};

export default FeedbackPreviewCard;
