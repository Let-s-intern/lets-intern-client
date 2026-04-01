'use client';

import EditorApp, {
  emptyEditorState,
} from '@/domain/admin/lexical/EditorApp';
import LexicalContent from '@/domain/blog/ui/LexicalContent';

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
      <div className="flex flex-1 flex-col items-center justify-center gap-4 overflow-auto rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-200">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 12h6m-3-3v6m-7 4h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              stroke="#9CA3AF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-neutral-500">
            멘티가 아직 과제를 제출하지 않았습니다
          </p>
          <p className="mt-1 text-xs text-neutral-400">
            제출 후 피드백 작성이 가능합니다
          </p>
        </div>
      </div>
    );
  }

  if (isReadOnly && initialEditorStateJsonString) {
    try {
      const parsed = JSON.parse(initialEditorStateJsonString);
      return (
        <div className="flex flex-1 flex-col overflow-auto rounded-xl border border-gray-200 bg-white p-6">
          <LexicalContent node={parsed.root} />
        </div>
      );
    } catch {
      return (
        <div className="flex flex-1 flex-col overflow-auto rounded-xl border border-gray-200 bg-white p-6 text-sm text-neutral-500">
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
