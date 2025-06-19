import axiosV2 from '@/utils/axiosV2';
import { useQuery } from '@tanstack/react-query';
import { createContext, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import { getChallengeIdSchema, missionAdmin } from '../schema';
import axios from '../utils/axios';

type CurrentChallenge = z.infer<typeof getChallengeIdSchema> & { id: number };
type MissionList = z.infer<typeof missionAdmin>;

const currentChallengeContext = createContext<{
  currentChallenge?: CurrentChallenge | null;
  missionsOfCurrentChallenge?: MissionList | null;
  missionsOfCurrentChallengeRefetch: () => void;
}>({
  currentChallenge: null,
  missionsOfCurrentChallenge: null,
  missionsOfCurrentChallengeRefetch: () => {},
});

export const CurrentAdminChallengeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const params = useParams();

  const { data: currentChallenge } = useQuery({
    queryKey: ['admin', 'challenge', params.programId],
    queryFn: async () => {
      if (!params.programId) {
        return null;
      }
      const res = await axios.get(`/challenge/${params.programId}`);
      return {
        ...getChallengeIdSchema.parse(res.data.data),
        id: Number(params.programId),
      };
    },
  });

  const { data: missionsOfCurrentChallenge, refetch } = useQuery({
    queryKey: ['admin', 'challenge', params.programId, 'missions'],
    queryFn: async () => {
      const res = await axiosV2.get(
        `/admin/challenge/${params.programId}/mission`,
      );
      return missionAdmin.parse(res.data.data);
    },
    enabled: !!params.programId,
  });

  return (
    <currentChallengeContext.Provider
      value={{
        currentChallenge,
        missionsOfCurrentChallenge,
        missionsOfCurrentChallengeRefetch: refetch,
      }}
    >
      {children}
    </currentChallengeContext.Provider>
  );
};

export const useAdminCurrentChallenge = () => {
  return useContext(currentChallengeContext);
};

export const useAdminMissionsOfCurrentChallenge = () => {
  return (
    useContext(currentChallengeContext).missionsOfCurrentChallenge
      ?.missionList ?? []
  );
};

export const useAdminChallengeTitle = () => {
  return useContext(currentChallengeContext).currentChallenge?.title ?? '';
};

/** TODO: [나중에...] queryKey 방식으로 수정 */
export const useMissionsOfCurrentChallengeRefetch = () => {
  return useContext(currentChallengeContext).missionsOfCurrentChallengeRefetch;
};
