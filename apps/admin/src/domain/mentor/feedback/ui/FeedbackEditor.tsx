import EditorApp, {
  emptyEditorState,
} from '@/common/lexical/EditorApp';
import LexicalContent from '@/common/lexical/LexicalContent';

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
      <div className="flex flex-1 flex-col items-center justify-center overflow-auto rounded-xl border border-dashed border-neutral-200 bg-neutral-50/50 p-8">
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
