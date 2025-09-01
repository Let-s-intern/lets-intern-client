import {
  challengeSchedule,
  DailyMission,
  dailyMissionSchema,
  getChallengeIdSchema,
  MyChallengeMissionByType,
  myChallengeMissionsByType,
  MyDailyMission,
  myDailyMission as myDailyMissionSchema,
  Schedule,
} from '@/schema';
import useAuthStore from '@/store/useAuthStore';
import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { createContext, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { z } from 'zod';

type CurrentChallenge = z.infer<typeof getChallengeIdSchema> & { id: number };

const emptySchedules: Schedule[] = [];

const currentChallengeContext = createContext<{
  currentChallenge?: CurrentChallenge | null;
  schedules: Schedule[];
  dailyMission?: DailyMission | null;
  myDailyMission?: MyDailyMission | null;
  submittedMissions: MyChallengeMissionByType[];
  remainingMissions: MyChallengeMissionByType[];
  absentMissions: MyChallengeMissionByType[];
}>({
  currentChallenge: null,
  schedules: emptySchedules,
  dailyMission: null,
  myDailyMission: null,
  submittedMissions: [],
  remainingMissions: [],
  absentMissions: [],
});

export const OldCurrentChallengeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const params = useParams();
  const { isLoggedIn } = useAuthStore();

  const { data: currentChallenge } = useQuery({
    enabled: isLoggedIn,
    queryKey: ['challenge', params.programId],
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

  const { data: schedules = [] } = useQuery({
    enabled: isLoggedIn,
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
    enabled: isLoggedIn,
    queryKey: ['challenge', params.programId, 'daily-mission'],
    queryFn: async () => {
      const res = await axios.get(
        `/challenge/${params.programId}/daily-mission`,
      );
      return dailyMissionSchema.parse(res.data.data).dailyMission;
    },
  });

  const { data: myDailyMission } = useQuery({
    enabled: isLoggedIn,
    queryKey: ['challenge', params.programId, 'my', 'daily-mission'],
    queryFn: async () => {
      const res = await axios.get(
        `/challenge/${params.programId}/my/daily-mission`,
      );
      return myDailyMissionSchema.parse(res.data.data);
    },
  });

  const { data: submittedMissions = [] } = useQuery({
    enabled: isLoggedIn,
    queryKey: ['challenge', params.programId, 'missions', 'submitted'],
    queryFn: async () => {
      const res = await axios.get(
        `/challenge/${params.programId}/missions?type=SUBMITTED`,
      );
      return myChallengeMissionsByType.parse(res.data.data).missionList;
    },
  });

  const { data: remainingMissions = [] } = useQuery({
    enabled: isLoggedIn,
    queryKey: ['challenge', params.programId, 'missions', 'remaining'],
    queryFn: async () => {
      const res = await axios.get(
        `/challenge/${params.programId}/missions?type=REMAINING`,
      );
      return myChallengeMissionsByType.parse(res.data.data).missionList;
    },
  });

  const { data: absentMissions = [] } = useQuery({
    enabled: isLoggedIn,
    queryKey: ['challenge', params.programId, 'missions', 'absent'],
    queryFn: async () => {
      const res = await axios.get(
        `/challenge/${params.programId}/missions?type=ABSENT`,
      );
      return myChallengeMissionsByType.parse(res.data.data).missionList;
    },
  });

  return (
    <currentChallengeContext.Provider
      value={{
        currentChallenge,
        schedules: schedules ?? emptySchedules,
        dailyMission,
        myDailyMission,
        submittedMissions,
        remainingMissions,
        absentMissions,
      }}
    >
      {children}
    </currentChallengeContext.Provider>
  );
};

export const useOldCurrentChallenge = () => {
  return useContext(currentChallengeContext);
};
