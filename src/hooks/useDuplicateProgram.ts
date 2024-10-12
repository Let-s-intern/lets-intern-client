import {
  getChallenge,
  getLive,
  getVod,
  usePostChallengeMutation,
} from '@/api/program';
import { ProgramTypeUpperCase } from '@/schema';
import { useCallback } from 'react';

export const useDuplicateProgram = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  const postChallenge = usePostChallengeMutation({
    successCallback,
    errorCallback,
  });

  const postLive = usePostChallengeMutation({
    successCallback,
    errorCallback,
  });

  const postVod = usePostChallengeMutation({
    successCallback,
    errorCallback,
  });

  return useCallback(
    async ({ id, type }: { id: number; type: ProgramTypeUpperCase }) => {
      switch (type) {
        case 'CHALLENGE': {
          const challenge = await getChallenge(id);
          console.log(challenge);
          return;
        }

        case 'LIVE': {
          const live = await getLive(id);
          console.log(live);
          return;
        }
        case 'VOD': {
          const vod = await getVod(id);
          console.log(vod);
          return;
        }
        case 'REPORT':
          throw new Error('Not implemented');
      }
    },
    [],
  );
};
