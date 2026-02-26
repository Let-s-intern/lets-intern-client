'use client';

import EditorApp, { emptyEditorState } from '@/domain/admin/lexical/EditorApp';
import type { CreateGuidebookReq } from '@/schema';
import type React from 'react';

interface GuidebookDetailContentSectionProps {
  input: CreateGuidebookReq;
  setInput: React.Dispatch<React.SetStateAction<CreateGuidebookReq>>;
}

const GuidebookDetailContentSection: React.FC<
  GuidebookDetailContentSectionProps
> = ({ input, setInput }) => {
  const initialState =
    input.description && input.description.trim().length > 0
      ? input.description
      : emptyEditorState;

  return (
    <section className="max-w-[1120px]">
      <EditorApp
        initialEditorStateJsonString={initialState}
        onChange={(json) =>
          setInput((prev) => ({
            ...prev,
            description: json,
          }))
        }
      />
    </section>
  );
};

export default GuidebookDetailContentSection;
