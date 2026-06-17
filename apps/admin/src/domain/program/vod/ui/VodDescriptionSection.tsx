import LexicalContent from '@/common/lexical/LexicalContent';
import type { SerializedEditorState } from 'lexical';

interface VodDescriptionSectionProps {
  editorState: SerializedEditorState | null;
}

const VodDescriptionSection: React.FC<VodDescriptionSectionProps> = ({
  editorState,
}) => {
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

export default VodDescriptionSection;
