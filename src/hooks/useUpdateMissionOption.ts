import { usePatchChallengeOption } from '@/api/challengeOption';
import { usePatchMission } from '@/api/mission';
import { useMissionsOfCurrentChallengeRefetch } from '@/context/CurrentAdminChallengeProvider';
import { NO_OPTION_ID } from '@/utils/constants';
import { useCallback } from 'react';

export const useUpdateMissionOption = () => {
  const patchMission = usePatchMission();
  const patchOption = usePatchChallengeOption();
  const refetchMissions = useMissionsOfCurrentChallengeRefetch();

  const updateMissionOption = useCallback(
    async ({
      missionId,
      missionType,
      challengeOptionId,
    }: {
      missionId: number;
      missionType?: string | null;
      challengeOptionId: number;
    }) => {
      await Promise.all([
        patchMission.mutateAsync({
          missionId,
          missionType,
          challengeOptionId,
        }),
        challengeOptionId === NO_OPTION_ID
          ? null
          : patchOption.mutateAsync({
              challengeOptionId,
              isFeedback: true,
            }),
      ]);

      refetchMissions();
    },
    [patchMission, patchOption, refetchMissions],
  );

  return { updateMissionOption };
};
