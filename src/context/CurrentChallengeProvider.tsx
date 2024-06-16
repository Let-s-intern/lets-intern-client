import { useQuery } from '@tanstack/react-query';
import { createContext, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import { getChallengeId, missionAdmin } from '../schema';
import axios from '../utils/axios';

type CurrentChallenge = z.infer<typeof getChallengeId> & { id: number };
type MissionList = z.infer<typeof missionAdmin>;

const currentChallengeContext = createContext<{
  currentChallenge?: CurrentChallenge | null;
  missionsOfCurrentChallenge?: MissionList | null;
}>({});

export const CurrentChallengeProvider = ({
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
        ...getChallengeId.parse(res.data.data),
        id: Number(params.programId),
      };
    },
  });

  const { data: missionsOfCurrentChallenge } = useQuery({
    queryKey: ['admin', 'challenge', params.programId, 'missions'],
    queryFn: async () => {
      if (!params.programId) {
        return null;
      }
      const res = await axios.get(`/mission/${params.programId}/admin`);
      return missionAdmin.parse(res.data.data);
    },
  });

  return (
    <currentChallengeContext.Provider
      value={{ currentChallenge, missionsOfCurrentChallenge }}
    >
      {children}
    </currentChallengeContext.Provider>
  );
};

export const useCurrentChallenge = () => {
  return useContext(currentChallengeContext);
};

export const useMissionsOfCurrentChallenge = () => {
  return (
    useContext(currentChallengeContext).missionsOfCurrentChallenge
      ?.missionList ?? []
  );
};
