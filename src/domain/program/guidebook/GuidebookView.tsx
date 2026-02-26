'use client';

import type { GuidebookIdSchema } from '@/schema';
import type { SerializedEditorState } from 'lexical';
import { useMemo } from 'react';
import GuidebookBasicInfoSection from './ui/GuidebookBasicInfoSection';
import GuidebookDescriptionSection from './ui/GuidebookDescriptionSection';

const GuidebookView: React.FC<{
  guidebook: GuidebookIdSchema;
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
