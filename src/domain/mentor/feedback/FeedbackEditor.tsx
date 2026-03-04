'use client';

import EditorApp, {
  emptyEditorState,
} from '@/domain/admin/lexical/EditorApp';
import LexicalContent from '@/domain/blog/ui/LexicalContent';

interface FeedbackEditorProps {
  initialEditorStateJsonString?: string;
  onChange: (jsonString: string) => void;
  readOnly: boolean;
}

const FeedbackEditor = ({
  initialEditorStateJsonString,
  onChange,
  readOnly,
}: FeedbackEditorProps) => {
  if (readOnly && initialEditorStateJsonString) {
    try {
      const parsed = JSON.parse(initialEditorStateJsonString);
      return (
        <div className="flex flex-1 flex-col overflow-auto rounded-md border border-gray-200 bg-gray-50 p-4">
          <LexicalContent node={parsed.root} />
        </div>
      );
    } catch {
      return (
        <div className="flex flex-1 flex-col overflow-auto rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
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
