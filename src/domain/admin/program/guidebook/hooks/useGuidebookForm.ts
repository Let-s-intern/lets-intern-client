import { useEffect, useState } from 'react';

import type { CreateGuidebookReq, GuidebookIdSchema } from '@/schema';

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
  const [input, setInput] = useState<CreateGuidebookReq>(() => {
    if (mode === 'create') {
      return initialGuidebookInput;
    }

    if (initialGuidebook) {
      return guidebookToFormInput(initialGuidebook);
    }

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
    if (mode !== 'edit' || !initialGuidebook) {
      return;
    }

    setInput(guidebookToFormInput(initialGuidebook));
    setResourceSource(
      initialGuidebook.contentFileUrl && !initialGuidebook.contentUrl
        ? 'file'
        : 'url',
    );
  }, [mode, initialGuidebook]);

  const isReady = mode === 'create' || Boolean(initialGuidebook);

  return {
    input,
    setInput,
    resourceSource,
    setResourceSource,
    isReady,
  };
};
