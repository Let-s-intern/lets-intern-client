'use client';

import type { SerializedEditorState } from 'lexical';
import { useMemo } from 'react';
import GuidebookBasicInfoSection from './ui/GuidebookBasicInfoSection';
import GuidebookDescriptionSection from './ui/GuidebookDescriptionSection';
import type { GuidebookPublicViewModel } from './utils/publicGuidebookMapping';

const GuidebookView: React.FC<{
  guidebook: GuidebookPublicViewModel;
  id: string;
}> = ({ guidebook }) => {
  const editorState = useMemo<SerializedEditorState | null>(() => {
    if (!guidebook.description) {
      return null;
    }

    try {
      return JSON.parse(guidebook.description) as SerializedEditorState;
    } catch {
      return null;
    }
  }, [guidebook.description]);

  return (
    <div className="w-full">
      <GuidebookBasicInfoSection guidebook={guidebook} />
      <GuidebookDescriptionSection editorState={editorState} />
    </div>
  );
};

export default GuidebookView;
