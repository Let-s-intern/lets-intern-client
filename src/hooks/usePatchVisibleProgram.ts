import {
  usePatchChallengeMutation,
  usePatchLiveMutation,
  usePatchVodMutation,
} from '@/api/program';
import { ProgramTypeUpperCase } from '@/schema';
import { useCallback } from 'react';

export const usePatchVisibleProgram = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  const patchChallenge = usePatchChallengeMutation({
    successCallback,
    errorCallback,
  });
  const patchLive = usePatchLiveMutation({
    successCallback,
    errorCallback,
  });
  const patchVod = usePatchVodMutation({
    successCallback,
    errorCallback,
  });

  return useCallback(
    (arg: { type: ProgramTypeUpperCase; id: number; isVisible: boolean }) => {
      switch (arg.type) {
        case 'CHALLENGE':
          return patchChallenge.mutateAsync({
            challengeId: arg.id,
            isVisible: arg.isVisible,
          });
        case 'LIVE':
          return patchLive.mutateAsync({
            liveId: arg.id,
            isVisible: arg.isVisible,
          });
        case 'VOD':
          return patchVod.mutateAsync({
            vodId: arg.id,
            isVisible: arg.isVisible,
          });
        case 'GUIDEBOOK':
        case 'REPORT':
          throw new Error('Not implemented');
      }
    },
    [patchChallenge, patchLive, patchVod],
  );
};
