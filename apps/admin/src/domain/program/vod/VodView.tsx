import type { SerializedEditorState } from 'lexical';
import { useMemo } from 'react';
import VodBasicInfoSection from './ui/VodBasicInfoSection';
import VodDescriptionSection from './ui/VodDescriptionSection';
import type { VodPublicViewModel } from './utils/publicVodMapping';

const VodView: React.FC<{
  vod: VodPublicViewModel;
  id: string;
}> = ({ vod }) => {
  const editorState = useMemo<SerializedEditorState | null>(() => {
    if (!vod.description) {
      return null;
    }

    try {
      return JSON.parse(vod.description) as SerializedEditorState;
    } catch {
      return null;
    }
  }, [vod.description]);

  return (
    <div className="w-full">
      <VodBasicInfoSection vod={vod} />
      <VodDescriptionSection editorState={editorState} />
    </div>
  );
};

export default VodView;
