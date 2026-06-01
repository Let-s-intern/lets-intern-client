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
}

const FeedbackEditor = ({
  initialEditorStateJsonString,
  onChange,
  isReadOnly,
  isAbsent = false,
}: FeedbackEditorProps) => {
  if (isAbsent) {
    return (
      <div
        className={twMerge(
          feedbackModalDesign.writtenEditorEmpty,
          'flex flex-1 flex-col items-center justify-center overflow-auto',
        )}
      >
        <p className="text-sm text-neutral-400">
          멘티가 아직 과제를 제출하지 않았습니다
        </p>
        <p className="mt-1 text-xs text-neutral-300">
          제출 후 피드백 작성이 가능합니다
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
    <EditorApp
      initialEditorStateJsonString={
        initialEditorStateJsonString || emptyEditorState
      }
      onChange={onChange}
    />
  );
};

export default FeedbackEditor;
