import { useEffect, useState } from 'react';

import type { GuidebookIdSchema } from '@/schema';
import type { ContentProgramFormInput } from '../../programContentTypes';

import {
  guidebookToFormInput,
  initialGuidebookInput,
} from '../utils/guidebookMapping';

type GuidebookFormMode = 'create' | 'edit';

interface UseGuidebookFormOptions {
  mode: GuidebookFormMode;
  initialGuidebook?: GuidebookIdSchema;
}

export const useGuidebookForm = ({
  mode,
  initialGuidebook,
}: UseGuidebookFormOptions) => {
  const [isReady, setIsReady] = useState(mode === 'create');
  const [input, setInput] = useState<ContentProgramFormInput>(() => {
    if (mode === 'create') return initialGuidebookInput;
    if (initialGuidebook) return guidebookToFormInput(initialGuidebook);
    return initialGuidebookInput;
  });

  const [resourceSource, setResourceSource] = useState<'url' | 'file'>(() => {
    if (mode === 'edit' && initialGuidebook) {
      return initialGuidebook.contentFileUrl && !initialGuidebook.contentUrl
        ? 'file'
        : 'url';
    }
    return 'url';
  });

  useEffect(() => {
    if (mode !== 'edit' || !initialGuidebook) return;

    setInput(guidebookToFormInput(initialGuidebook));
    setResourceSource(
      initialGuidebook.contentFileUrl && !initialGuidebook.contentUrl
        ? 'file'
        : 'url',
    );
    setIsReady(true);
  }, [mode, initialGuidebook]);

  return { input, setInput, resourceSource, setResourceSource, isReady };
};
