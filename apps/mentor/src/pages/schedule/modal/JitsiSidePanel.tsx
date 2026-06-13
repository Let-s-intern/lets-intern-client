import { feedbackModalDesign } from '@/pages/feedback/feedbackModalDesign';
import { twMerge } from '@/lib/twMerge';
import MenteeLinkPanel from '@/pages/feedback/ui/MenteeLinkPanel';
import { isNotionUrl } from '@/pages/feedback/utils/notion';

interface JitsiSidePanelProps {
  /** 멘티 사전 질문(사전 Q&A). 없으면 사전 Q&A 영역을 숨긴다. */
  preQuestion?: string;
  /** 멘티 제출물(노션 등) URL. 없으면 빈 상태 안내. */
  submissionUrl?: string;
  menteeName: string;
}

/** 외부 링크(체인) 아이콘 — 제출물 보기 버튼용. */
const LinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path
      d="M6.5 9.5L9.5 6.5M7 4.5l.8-.8a2.3 2.3 0 113.3 3.3l-.8.8M9 11.5l-.8.8a2.3 2.3 0 11-3.3-3.3l.8-.8"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Jitsi 모달 좌측 자료 패널 — 상단 사전 Q&A · 하단 제출물.
 *
 * - 사전 Q&A: `preQuestion`이 있을 때만 노출.
 * - 제출물: 노션 링크면 `MenteeLinkPanel` 임베드 재사용, 아니면 "제출물 보기" 외부 링크,
 *   둘 다 없으면 빈 상태 안내.
 */
const JitsiSidePanel = ({
  preQuestion,
  submissionUrl,
  menteeName,
}: JitsiSidePanelProps) => {
  const hasPreQuestion = !!preQuestion && preQuestion.trim().length > 0;
  const hasSubmission = !!submissionUrl;
  const isNotionSubmission = hasSubmission && isNotionUrl(submissionUrl);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      {hasPreQuestion && (
        <section
          className={twMerge(
            feedbackModalDesign.cardSurface,
            'flex min-h-0 flex-col',
          )}
        >
          <p className="text-xs font-medium text-neutral-400">사전 Q&amp;A</p>
          <p className={twMerge('mt-3', feedbackModalDesign.qnaBody)}>
            {preQuestion}
          </p>
        </section>
      )}

      <div className="flex min-h-0 flex-1 flex-col">
        {isNotionSubmission ? (
          <MenteeLinkPanel
            onClose={() => {}}
            link={submissionUrl!}
            menteeName={menteeName}
          />
        ) : hasSubmission ? (
          <section
            className={twMerge(
              feedbackModalDesign.cardSurface,
              'flex flex-col gap-3',
            )}
          >
            <p className="text-xs font-medium text-neutral-400">제출물</p>
            <a
              href={submissionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={feedbackModalDesign.outlineButton}
            >
              <LinkIcon />
              제출물 보기
            </a>
          </section>
        ) : (
          <section
            className={twMerge(
              feedbackModalDesign.cardSurface,
              'flex min-h-0 flex-1 flex-col items-center justify-center gap-2 text-center',
            )}
          >
            <p className="text-sm font-medium text-neutral-500">
              제출물이 없습니다
            </p>
            <p className="text-xs text-neutral-400">
              멘티가 제출한 자료가 없습니다.
            </p>
          </section>
        )}
      </div>
    </div>
  );
};

export default JitsiSidePanel;
