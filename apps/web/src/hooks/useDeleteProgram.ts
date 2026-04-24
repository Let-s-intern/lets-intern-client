import {
  useDeleteChallengeMutation,
  useDeleteGuidebookMutation,
  useDeleteLiveMutation,
  useDeleteVodMutation,
} from '@/api/program';
import { ProgramTypeUpperCase } from '@/schema';
import { useCallback } from 'react';

export const useDeleteProgram = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  const deleteChallenge = useDeleteChallengeMutation({
    successCallback,
    errorCallback,
  });
  const deleteLive = useDeleteLiveMutation({
    successCallback,
    errorCallback,
  });
  const deleteVod = useDeleteVodMutation({
    successCallback,
    errorCallback,
  });
  const deleteGuidebook = useDeleteGuidebookMutation({
    successCallback,
    errorCallback,
  });
  return useCallback(
    (arg: { type: ProgramTypeUpperCase; id: number }) => {
      switch (arg.type) {
        case 'CHALLENGE':
          return deleteChallenge.mutateAsync(arg.id);
        case 'LIVE':
          return deleteLive.mutateAsync(arg.id);
        case 'VOD':
          return deleteVod.mutateAsync(arg.id);
        case 'GUIDEBOOK':
          return deleteGuidebook.mutateAsync(arg.id);
        case 'REPORT':
          throw new Error('Not implemented');
      }
    },
    [deleteChallenge, deleteLive, deleteVod, deleteGuidebook],
  );
};
