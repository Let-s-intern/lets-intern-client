'use client';

import EditorApp, { emptyEditorState } from '@/common/lexical/EditorApp';
import type React from 'react';

import type { ContentProgramFormInput } from './programContentTypes';

interface ProgramContentEditorSectionProps {
  input: ContentProgramFormInput;
  setInput: React.Dispatch<React.SetStateAction<ContentProgramFormInput>>;
}

const ProgramContentEditorSection: React.FC<
  ProgramContentEditorSectionProps
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
          setInput((prev) => ({ ...prev, description: json }))
        }
      />
    </section>
  );
};

export default ProgramContentEditorSection;
