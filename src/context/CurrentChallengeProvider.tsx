import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import {
  challengeSchedule,
  DailyMission,
  dailyMissionSchema,
  getChallengeId,
  MyChallengeMissionByType,
  myChallengeMissionsByType,
  MyDailyMission,
  myDailyMission as myDailyMissionSchema,
  Schedule,
} from '../schema';
import axios from '../utils/axios';

type CurrentChallenge = z.infer<typeof getChallengeId> & { id: number };

const emptySchedules: Schedule[] = [];

const currentChallengeContext = createContext<{
  currentChallenge?: CurrentChallenge | null;
  schedules: Schedule[];
  dailyMission?: DailyMission | null;
  myDailyMission?: MyDailyMission | null;
  submittedMissions: MyChallengeMissionByType[];
  remainingMissions: MyChallengeMissionByType[];
  absentMissions: MyChallengeMissionByType[]
}>({
  currentChallenge: null,
  schedules: emptySchedules,
  dailyMission: null,
  myDailyMission: null,
  submittedMissions: [],
  remainingMissions: [],
  absentMissions: []
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

  const { data: myDailyMission } = useQuery({
    queryKey: ['challenge', params.programId, 'my', 'daily-mission'],
    queryFn: async () => {
      const res = await axios.get(
        `/challenge/${params.programId}/my/daily-mission`,
      );
      return myDailyMissionSchema.parse(res.data.data);
    },
  });

  const { data: submittedMissions = [] } = useQuery({
    queryKey: ['challenge', params.programId, 'missions', 'submitted'],
    queryFn: async () => {
      const res = await axios.get(
        `/challenge/${params.programId}/missions?type=SUBMITTED`,
      );
      return myChallengeMissionsByType.parse(res.data.data).missionList;
    },
  });

  const { data: remainingMissions = [] } = useQuery({
    queryKey: ['challenge', params.programId, 'missions', 'remaining'],
    queryFn: async () => {
      const res = await axios.get(
        `/challenge/${params.programId}/missions?type=REMAINING`,
      );
      return myChallengeMissionsByType.parse(res.data.data).missionList;
    },
  });

  const { data: absentMissions = [] } = useQuery({
    queryKey: ['challenge', params.programId, 'missions', 'absent'],
    queryFn: async () => {
      const res = await axios.get(
        `/challenge/${params.programId}/missions?type=ABSENT`,
      );
      return myChallengeMissionsByType.parse(res.data.data).missionList;
    },
  });

  // useEffect(() => {
  //   console.log("submittedMissions", submittedMissions);
  // }, [submittedMissions]);

  // useEffect(() => {
  //   console.log("remainingMissions", remainingMissions);
  // }, [remainingMissions]);

  // useEffect(() => {
  //   console.log("absentMissions", absentMissions);
  // }, [absentMissions]);

  // useEffect(() => {
  //   console.log("missions", missions);
  // }, [missions]);

  useEffect(() => {
    console.log('schedules', schedules);
  }, [schedules]);

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

export const useCurrentChallenge = () => {
  return useContext(currentChallengeContext);
};
