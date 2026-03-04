'use client';

interface FeedbackEditorProps {
  initialContent: string | null;
  onChange: (content: string) => void;
  readOnly: boolean;
}

const FeedbackEditor = ({
  initialContent,
  onChange,
  readOnly,
}: FeedbackEditorProps) => {
  return (
    <div className="flex flex-1 flex-col">
      <textarea
        className="flex-1 resize-none rounded-md border border-gray-300 p-4 text-sm leading-relaxed text-gray-800 placeholder-gray-400 outline-none transition-colors focus:border-gray-500 disabled:bg-gray-50 disabled:text-gray-500"
        placeholder="Markdown Editor"
        value={initialContent ?? ''}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        disabled={readOnly}
      />
    </div>
  );
};

export default FeedbackEditor;
