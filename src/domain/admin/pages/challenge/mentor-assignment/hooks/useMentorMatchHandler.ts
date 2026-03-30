'use client';

import { usePostAdminChallengeMentorMatch } from '@/api/mentor/mentor';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { useQueryClient } from '@tanstack/react-query';
import { PaybackParticipantsQueryKey } from './usePaybackParticipants';

const useMentorMatchHandler = (programId: string) => {
  const mutation = usePostAdminChallengeMentorMatch();
  const queryClient = useQueryClient();
  const { snackbar } = useAdminSnackbar();

  const handleMatch = async (params: {
    challengeMentorId: number;
    applicationIds: number[];
  }) => {
    await mutation.mutateAsync({
      challengeId: Number(programId),
      challengeMentorId: params.challengeMentorId,
      challengeApplicationIdList: params.applicationIds,
    });
    queryClient.invalidateQueries({
      queryKey: [PaybackParticipantsQueryKey],
    });
  };

  return { handleMatch, isPending: mutation.isPending, snackbar };
};

export default useMentorMatchHandler;
