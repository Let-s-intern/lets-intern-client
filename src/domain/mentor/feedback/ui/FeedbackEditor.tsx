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
        <div className="flex flex-1 flex-col overflow-auto rounded-lg border border-neutral-300 bg-white p-7">
          <LexicalContent node={parsed.root} />
        </div>
      );
    } catch {
      return (
        <div className="flex flex-1 flex-col overflow-auto rounded-lg border border-neutral-300 bg-white p-7 text-sm text-neutral-500">
          피드백 내용을 표시할 수 없습니다.
        </div>
      );
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
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
