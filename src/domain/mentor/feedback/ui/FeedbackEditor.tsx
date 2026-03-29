'use client';

import EditorApp, {
  emptyEditorState,
} from '@/domain/admin/lexical/EditorApp';
import LexicalContent from '@/domain/blog/ui/LexicalContent';

interface FeedbackEditorProps {
  initialEditorStateJsonString?: string;
  onChange: (jsonString: string) => void;
  isReadOnly: boolean;
}

const FeedbackEditor = ({
  initialEditorStateJsonString,
  onChange,
  isReadOnly,
}: FeedbackEditorProps) => {
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
