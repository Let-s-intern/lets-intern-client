'use client';

import EditorApp, { emptyEditorState } from '@/common/lexical/EditorApp';
import LexicalContent from '@/common/lexical/LexicalContent';
import { twMerge } from '@/lib/twMerge';
import { feedbackModalDesign } from '@/pages/feedback/feedbackModalDesign';
import {
  LATE_SUBMISSION_NOTICE,
  type WrittenSubmissionState,
} from '@/pages/feedback/utils/writtenSubmissionState';
import './FeedbackEditor.css';

interface FeedbackEditorProps {
  initialEditorStateJsonString?: string;
  onChange: (jsonString: string) => void;
  isReadOnly: boolean;
  /** 제출 상태 — 미제출·지각 제출은 작성을 막고 안내로 대체한다. */
  submissionState?: WrittenSubmissionState;
  /** 멘티가 선택되지 않은 상태 — 안내 placeholder 노출. */
  hasMentee?: boolean;
}

const FeedbackEditor = ({
  initialEditorStateJsonString,
  onChange,
  isReadOnly,
  submissionState = 'submitted',
  hasMentee = true,
}: FeedbackEditorProps) => {
  if (!hasMentee) {
    return (
      <div
        className={twMerge(
          feedbackModalDesign.writtenEditorEmpty,
          'flex flex-1 flex-col items-center justify-center overflow-auto',
        )}
      >
        <p className="text-sm text-neutral-400">멘티를 선택해주세요</p>
      </div>
    );
  }

  if (submissionState === 'notSubmitted') {
    return (
      <div
        className={twMerge(
          feedbackModalDesign.writtenEditorEmpty,
          'flex flex-1 flex-col items-center justify-center overflow-auto',
        )}
      >
        <p className="text-sm text-neutral-400">
          제출물이 없어 피드백을 작성할 수 없습니다
        </p>
        <p className="mt-1 text-xs text-neutral-300">
          멘티가 과제를 제출한 후 작성이 가능합니다
        </p>
      </div>
    );
  }

  // 지각 제출은 제출물이 있으므로 미제출과 문구가 다르다.
  // 이미 작성된 피드백이 있으면 아래 읽기 전용 분기로 내려보내 내용을 보존한다.
  const isLate = submissionState === 'late';
  const hasWrittenFeedback =
    !!initialEditorStateJsonString &&
    initialEditorStateJsonString !== emptyEditorState;

  if (isLate && !hasWrittenFeedback) {
    return (
      <div
        className={twMerge(
          feedbackModalDesign.writtenEditorEmpty,
          'flex flex-1 flex-col items-center justify-center overflow-auto',
        )}
      >
        <p className="text-sm text-neutral-400">{LATE_SUBMISSION_NOTICE}</p>
        <p className="mt-1 text-xs text-neutral-300">
          제출물 열람은 가능하지만 피드백 작성 대상이 아닙니다
        </p>
      </div>
    );
  }

  if ((isReadOnly || isLate) && initialEditorStateJsonString) {
    try {
      const parsed = JSON.parse(initialEditorStateJsonString);
      return (
        <div
          className={twMerge(
            feedbackModalDesign.writtenEditorSurface,
            'flex flex-1 flex-col overflow-auto',
          )}
        >
          <LexicalContent node={parsed.root} />
        </div>
      );
    } catch {
      return (
        <div
          className={twMerge(
            feedbackModalDesign.writtenEditorSurface,
            'flex flex-1 flex-col overflow-auto text-sm text-neutral-500',
          )}
        >
          피드백 내용을 표시할 수 없습니다.
        </div>
      );
    }
  }

  return (
    <div className="feedback-written-editor flex min-h-0 flex-1 flex-col overflow-hidden">
      <EditorApp
        initialEditorStateJsonString={
          initialEditorStateJsonString || emptyEditorState
        }
        onChange={onChange}
        // editor-shell 기본 block·my-5 를 덮어 래퍼 높이를 꽉 채우고
        // 툴바(상단)·본문이 정상 배치되도록 flex 컬럼으로 전환.
        // 내부(editor-container·scroller·editor) 보정은 FeedbackEditor.css
        // 의 `.feedback-written-editor` 스코프에서 처리.
        shellClassName="my-0 flex min-h-0 flex-1 flex-col"
      />
    </div>
  );
};

export default FeedbackEditor;
