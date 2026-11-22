'use client';

import GuidebookDescriptionSection from '@/domain/program/guidebook/ui/GuidebookDescriptionSection';
import type { GuidebookPublicViewModel } from '@/domain/program/guidebook/utils/publicGuidebookMapping';
import type { SerializedEditorState } from 'lexical';
import { useMemo } from 'react';

/** '템플릿으로 혼자' 일 때 챌린지 본문 대신 보이는 가이드북 상세 본문 */
function TemplateGuidebookDetail({
  guidebook,
}: {
  guidebook: GuidebookPublicViewModel;
}) {
  const editorState = useMemo<SerializedEditorState | null>(() => {
    if (!guidebook.description) return null;
    try {
      return JSON.parse(guidebook.description) as SerializedEditorState;
    } catch {
      return null;
    }
  }, [guidebook.description]);

  return <GuidebookDescriptionSection editorState={editorState} />;
}

export default TemplateGuidebookDetail;
