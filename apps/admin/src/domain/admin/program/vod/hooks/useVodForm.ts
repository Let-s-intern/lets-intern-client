import { useEffect, useState } from 'react';

import type { VodIdSchema } from '@/schema';
import type { ContentProgramFormInput } from '../../programContentTypes';

import { initialVodInput, vodToFormInput } from '../utils/vodMapping';

type VodFormMode = 'create' | 'edit';

interface UseVodFormOptions {
  mode: VodFormMode;
  initialVod?: VodIdSchema;
}

export const useVodForm = ({ mode, initialVod }: UseVodFormOptions) => {
  const [isReady, setIsReady] = useState(mode === 'create');
  const [input, setInput] = useState<ContentProgramFormInput>(() => {
    if (mode === 'create') return initialVodInput;
    if (initialVod) return vodToFormInput(initialVod);
    return initialVodInput;
  });

  const [resourceSource, setResourceSource] = useState<'url' | 'file'>(() => {
    if (mode === 'edit' && initialVod) {
      return initialVod.vodInfo.contentFileUrl && !initialVod.vodInfo.contentUrl
        ? 'file'
        : 'url';
    }
    return 'url';
  });

  useEffect(() => {
    if (mode !== 'edit' || !initialVod) return;

    setInput(vodToFormInput(initialVod));
    setResourceSource(
      initialVod.vodInfo.contentFileUrl && !initialVod.vodInfo.contentUrl
        ? 'file'
        : 'url',
    );
    setIsReady(true);
  }, [mode, initialVod]);

  return { input, setInput, resourceSource, setResourceSource, isReady };
};
