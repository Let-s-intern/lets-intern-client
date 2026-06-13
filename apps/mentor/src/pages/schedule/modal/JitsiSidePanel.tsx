import { useState } from 'react';

import { twMerge } from '@/lib/twMerge';
import MenteeLinkPanel from '@/pages/feedback/ui/MenteeLinkPanel';
import { isNotionUrl } from '@/pages/feedback/utils/notion';

interface JitsiSidePanelProps {
  /** 멘티 사전 질문(사전 Q&A). 없으면 사전 Q&A 영역을 숨긴다. */
  preQuestion?: string;
  /** 멘티 제출물(노션 등) URL. 없으면 빈 상태 안내. */
  submissionUrl?: string;
  menteeName: string;
  /** 폰 프레임(좁은 폭)에서 표시 — 노션 임베드를 모바일 뷰(native)로 렌더. */
  mobileView?: boolean;
}

/** 외부 링크(체인) 아이콘 — 제출물 새 탭 열기용. */
const ExternalLinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path
      d="M6 3.5H3.5V12.5H12.5V10M9.5 3.5H12.5V6.5M12.5 3.5L7 9"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 접기/펼치기 chevron — open 이면 위쪽. */
const Chevron = ({ open }: { open: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden
    className={twMerge(
      'shrink-0 text-neutral-400 transition-transform duration-200',
      open ? 'rotate-180' : '',
    )}
  >
    <path
      d="M4 6L8 10L12 6"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface CollapsibleSectionProps {
  title: string;
  open: boolean;
  onToggle: () => void;
  /** 헤더 우측에 들어갈 부가 액션(예: 새 탭 열기). chevron 앞에 배치. */
  headerAction?: React.ReactNode;
  /** open 일 때 남은 세로 공간을 채울지 여부(제출물 임베드용). */
  grow?: boolean;
  children: React.ReactNode;
}

/** 헤더 클릭으로 접고 펼치는 섹션. */
const CollapsibleSection = ({
  title,
  open,
  onToggle,
  headerAction,
  grow,
  children,
}: CollapsibleSectionProps) => (
  <section
    className={twMerge(
      'flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white',
      grow && open ? 'min-h-0 flex-1' : 'shrink-0',
    )}
  >
    <div className="flex items-center justify-between gap-1">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex flex-1 items-center justify-between gap-2 px-4 py-3 text-left hover:bg-neutral-50"
      >
        <span className="text-sm font-semibold text-neutral-800">{title}</span>
        <span className="flex items-center gap-1.5">
          {headerAction}
          <Chevron open={open} />
        </span>
      </button>
    </div>
    {open && (
      <div className="flex min-h-0 flex-1 flex-col border-t border-neutral-100">
        {children}
      </div>
    )}
  </section>
);

/**
 * Jitsi 모달 좌측 자료 패널 — 사전 Q&A · 제출물을 각각 접고 펼칠 수 있는 아코디언.
 *
 * - 사전 Q&A: `preQuestion`이 있을 때만 노출.
 * - 제출물: 노션이면 `MenteeLinkPanel`(헤더 숨김) 임베드 재사용, 아니면 "새 탭에서 열기",
 *   둘 다 없으면 빈 상태 안내.
 */
const JitsiSidePanel = ({
  preQuestion,
  submissionUrl,
  menteeName,
  mobileView,
}: JitsiSidePanelProps) => {
  const hasPreQuestion = !!preQuestion && preQuestion.trim().length > 0;
  const hasSubmission = !!submissionUrl;
  const isNotionSubmission = hasSubmission && isNotionUrl(submissionUrl);

  const [qnaOpen, setQnaOpen] = useState(true);
  const [submissionOpen, setSubmissionOpen] = useState(true);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      {hasPreQuestion && (
        <CollapsibleSection
          title="사전 Q&A"
          open={qnaOpen}
          onToggle={() => setQnaOpen((v) => !v)}
        >
          <p className="whitespace-pre-wrap px-4 py-3 text-sm leading-6 text-neutral-700">
            {preQuestion}
          </p>
        </CollapsibleSection>
      )}

      <CollapsibleSection
        title={`${menteeName} 님의 제출물`}
        open={submissionOpen}
        onToggle={() => setSubmissionOpen((v) => !v)}
        grow={isNotionSubmission}
        headerAction={
          hasSubmission ? (
            <a
              href={submissionUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="새 탭에서 열기"
              aria-label="제출물 새 탭에서 열기"
              onClick={(e) => e.stopPropagation()}
              className="flex h-6 w-6 items-center justify-center rounded text-neutral-500 hover:bg-neutral-100"
            >
              <ExternalLinkIcon />
            </a>
          ) : undefined
        }
      >
        {isNotionSubmission ? (
          <div className="min-h-0 flex-1 p-2">
            <MenteeLinkPanel
              hideHeader
              fit={mobileView ? 'native' : 'scale'}
              onClose={() => setSubmissionOpen(false)}
              link={submissionUrl!}
              menteeName={menteeName}
            />
          </div>
        ) : hasSubmission ? (
          <div className="p-4">
            <a
              href={submissionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              <ExternalLinkIcon />새 탭에서 열기
            </a>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-1 px-4 py-8 text-center">
            <p className="text-sm font-medium text-neutral-500">
              제출물이 없습니다
            </p>
            <p className="text-xs text-neutral-400">
              멘티가 제출한 자료가 없습니다.
            </p>
          </div>
        )}
      </CollapsibleSection>
    </div>
  );
};

export default JitsiSidePanel;
