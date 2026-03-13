'use client';

import LexicalContent from '@/domain/blog/ui/LexicalContent';
import type { SerializedEditorState } from 'lexical';

interface GuidebookDescriptionSectionProps {
  editorState: SerializedEditorState | null;
}

const GuidebookDescriptionSection: React.FC<
  GuidebookDescriptionSectionProps
> = ({ editorState }) => {
  if (
    !editorState?.root ||
    typeof editorState.root !== 'object' ||
    !('type' in editorState.root)
  ) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-[1000px] flex-col justify-center px-5 md:px-10 md:pb-[130px] lg:px-0">
      <LexicalContent node={editorState.root} />
    </div>
  );
};

export default GuidebookDescriptionSection;
