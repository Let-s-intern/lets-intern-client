import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import {
  challengeSchedule,
  DailyMission,
  dailyMissionSchema,
  getChallengeId,
  Schedule,
} from '../schema';
import axios from '../utils/axios';

type CurrentChallenge = z.infer<typeof getChallengeId> & { id: number };

const emptySchedules: Schedule[] = [];

const currentChallengeContext = createContext<{
  currentChallenge?: CurrentChallenge | null;
  schedules: Schedule[];
  dailyMission?: DailyMission | null;
}>({
  currentChallenge: null,
  schedules: emptySchedules,
});

export const CurrentChallengeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const params = useParams();

  const { data: currentChallenge } = useQuery({
    queryKey: ['challenge', params.programId],
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

  const { data: schedules = [] } = useQuery({
    queryKey: ['challenge', params.programId, 'schedule'],
    queryFn: async () => {
      if (!params.programId) {
        return null;
      }
      const res = await axios.get(`/challenge/${params.programId}/schedule`);
      return challengeSchedule.parse(res.data.data).scheduleList;
    },
  });

  const { data: dailyMission } = useQuery({
    queryKey: ['challenge', params.programId, 'daily-mission'],
    queryFn: async () => {
      const res = await axios.get(
        `/challenge/${params.programId}/daily-mission`,
      );
      return dailyMissionSchema.parse(res.data.data).dailyMission;
    },
  });

  useEffect(() => {
    console.log("schedules", schedules);
  }, [schedules]);

  return (
    <currentChallengeContext.Provider
      value={{
        currentChallenge,
        schedules: schedules ?? emptySchedules,
        dailyMission,
      }}
    >
      {children}
    </currentChallengeContext.Provider>
  );
};

export const useCurrentChallenge = () => {
  return useContext(currentChallengeContext);
};
