'use client';

import EditorApp from '@/common/lexical/EditorApp';
import LexicalContent from '@/common/lexical/LexicalContent';
import useIsCompleted from '../hooks/useIsCompleted';

interface FeedbackEditorAppProps {
  initialEditorStateJsonString?: string;
  onChange?: (jsonString: string) => void;
}

const FeedbackEditorApp = ({
  initialEditorStateJsonString,
  onChange,
}: FeedbackEditorAppProps) => {
  const { isCompleted, isLoading } = useIsCompleted();

  if (isLoading) return null;

  if (isCompleted && initialEditorStateJsonString) {
    try {
      const parsed = JSON.parse(initialEditorStateJsonString);
      return (
        <div className="bg-neutral-90 my-4 p-5">
          <LexicalContent node={parsed.root} />
        </div>
      );
    } catch {
      // 잘못된 JSON (빈 문자열 등) → 에디터 모드로 fallthrough
    }
  }

  return (
    <EditorApp
      initialEditorStateJsonString={initialEditorStateJsonString}
      onChange={onChange}
    />
  );
};

export default FeedbackEditorApp;
