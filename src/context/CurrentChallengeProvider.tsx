import { useQuery } from '@tanstack/react-query';
import { createContext, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
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
} from '../schema';
import useAuthStore from '../store/useAuthStore';
import axios from '../utils/axios';

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
  isLoading: boolean;
}>({
  currentChallenge: null,
  schedules: emptySchedules,
  dailyMission: null,
  myDailyMission: null,
  submittedMissions: [],
  remainingMissions: [],
  absentMissions: [],
  isLoading: true,
});

export const CurrentChallengeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const params = useParams();
  const { isLoggedIn } = useAuthStore();

  const { data: currentChallenge, isLoading: isChallengeLoading } = useQuery({
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

  const { data: schedules = [], isLoading: isSchedulesLoading } = useQuery({
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

  const { data: dailyMission, isLoading: isDailyMissionLoading } = useQuery({
    enabled: isLoggedIn,
    queryKey: ['challenge', params.programId, 'daily-mission'],
    queryFn: async () => {
      const res = await axios.get(
        `/challenge/${params.programId}/daily-mission`,
      );
      return dailyMissionSchema.parse(res.data.data).dailyMission;
    },
  });

  const { data: myDailyMission, isLoading: isMyDailyMissionLoading } = useQuery(
    {
      enabled: isLoggedIn,
      queryKey: ['challenge', params.programId, 'my', 'daily-mission'],
      queryFn: async () => {
        const res = await axios.get(
          `/challenge/${params.programId}/my/daily-mission`,
        );
        return myDailyMissionSchema.parse(res.data.data);
      },
    },
  );

  const {
    data: submittedMissions = [],
    isLoading: isSubmittedMissionsLoading,
  } = useQuery({
    enabled: isLoggedIn,
    queryKey: ['challenge', params.programId, 'missions', 'submitted'],
    queryFn: async () => {
      const res = await axios.get(
        `/challenge/${params.programId}/missions?type=SUBMITTED`,
      );
      return myChallengeMissionsByType.parse(res.data.data).missionList;
    },
  });

  const {
    data: remainingMissions = [],
    isLoading: isRemainingMissionsLoading,
  } = useQuery({
    enabled: isLoggedIn,
    queryKey: ['challenge', params.programId, 'missions', 'remaining'],
    queryFn: async () => {
      const res = await axios.get(
        `/challenge/${params.programId}/missions?type=REMAINING`,
      );
      return myChallengeMissionsByType.parse(res.data.data).missionList;
    },
  });

  const { data: absentMissions = [], isLoading: isAbsentMissionsLoading } =
    useQuery({
      enabled: isLoggedIn,
      queryKey: ['challenge', params.programId, 'missions', 'absent'],
      queryFn: async () => {
        const res = await axios.get(
          `/challenge/${params.programId}/missions?type=ABSENT`,
        );
        return myChallengeMissionsByType.parse(res.data.data).missionList;
      },
    });

  const isLoading =
    isChallengeLoading ||
    isSchedulesLoading ||
    isDailyMissionLoading ||
    isMyDailyMissionLoading ||
    isSubmittedMissionsLoading ||
    isRemainingMissionsLoading ||
    isAbsentMissionsLoading;

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
        isLoading,
      }}
    >
      {children}
    </currentChallengeContext.Provider>
  );
};

export const useCurrentChallenge = () => {
  return useContext(currentChallengeContext);
};
