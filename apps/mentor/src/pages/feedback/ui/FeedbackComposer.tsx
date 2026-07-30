'use client';

import { Suspense, lazy } from 'react';

import { twMerge } from '@/lib/twMerge';
import { feedbackModalDesign } from '@/pages/feedback/feedbackModalDesign';

// 에디터(Lexical)는 작성 화면에서만 필요 → 동적 임포트로 초기 번들에서 뺀다.
// (Vercel BP: bundle-dynamic-imports)
const FeedbackEditor = lazy(() => import('./FeedbackEditor'));

interface FeedbackComposerProps {
  /** Lexical editor state JSON 문자열. */
  initialEditorStateJsonString?: string;
  onChange: (jsonString: string) => void;
  isReadOnly: boolean;
  /** 멘티를 바꿀 때 에디터를 새로 마운트해 이전 본문이 남지 않게 한다. */
  editorKey?: string;
  /** 라벨 옆 보조 문구(예: "제출 완료되어 수정할 수 없습니다"). */
  hint?: string | null;
  isAbsent?: boolean;
  hasMentee?: boolean;
}

/**
 * 피드백 작성 카드 — 라벨 + 보조 문구 + 에디터. 서면·라이브 공통.
 *
 * 카드로 감싸 "여기부터 작성 영역"이 눈에 띄게 하고, 에디터가 카드 안에서
 * 남는 세로를 전부 차지하게 한다(min-h-0 + flex-1). 바깥에서 높이를 주면 된다.
 */
const FeedbackComposer = ({
  initialEditorStateJsonString,
  onChange,
  isReadOnly,
  editorKey,
  hint,
  isAbsent,
  hasMentee,
}: FeedbackComposerProps) => (
  <section
    className={twMerge(
      feedbackModalDesign.cardSurface,
      'flex min-h-0 flex-1 flex-col',
    )}
  >
    <div className="flex shrink-0 items-center gap-2">
      <p className="text-xs font-medium text-neutral-400">피드백 작성</p>
      {hint && <span className="text-xs text-neutral-400">· {hint}</span>}
    </div>
    <div className="mt-3 flex min-h-0 flex-1 flex-col">
      <Suspense fallback={null}>
        <FeedbackEditor
          key={editorKey}
          initialEditorStateJsonString={initialEditorStateJsonString}
          onChange={onChange}
          isReadOnly={isReadOnly}
          isAbsent={isAbsent}
          hasMentee={hasMentee}
        />
      </Suspense>
    </div>
  </section>
);

export default FeedbackComposer;
