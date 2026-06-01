'use client';

import EditorApp, { emptyEditorState } from '@/common/lexical/EditorApp';
import LexicalContent from '@/common/lexical/LexicalContent';
import { twMerge } from '@/lib/twMerge';
import { feedbackModalDesign } from '@/pages/feedback/feedbackModalDesign';

interface FeedbackEditorProps {
  initialEditorStateJsonString?: string;
  onChange: (jsonString: string) => void;
  isReadOnly: boolean;
  isAbsent?: boolean;
  /** 멘티가 선택되지 않은 상태 — 안내 placeholder 노출. */
  hasMentee?: boolean;
}

const FeedbackEditor = ({
  initialEditorStateJsonString,
  onChange,
  isReadOnly,
  isAbsent = false,
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

  if (isAbsent) {
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

  if (isReadOnly && initialEditorStateJsonString) {
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
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <EditorApp
        initialEditorStateJsonString={
          initialEditorStateJsonString || emptyEditorState
        }
        onChange={onChange}
      />
    </div>
  );
};

export default FeedbackEditor;
