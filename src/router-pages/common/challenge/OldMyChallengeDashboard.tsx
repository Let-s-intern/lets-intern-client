import DailyMissionSection from '@/components/common/challenge/my-challenge/section/DailyMissionSection';
import MissionCalendarSection from '@/components/common/challenge/my-challenge/section/MissionCalendarSection';
import OtherMissionSection from '@/components/common/challenge/my-challenge/section/OtherMissionSection';
import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import dayjs from '@/lib/dayjs';
import { Schedule } from '@/schema';
import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

// TODO: [나중에...] 외부로 빼야 함
const getIsDone = (schedules: Schedule[]) => {
  const last = schedules.reduce((acc, schedule) => {
    const endDate = dayjs(schedule.missionInfo.endDate) ?? dayjs('2000-01-01');
    if (acc.isBefore(endDate)) {
      return endDate;
    }
    return acc;
  }, dayjs('2000-01-01'));

  return last.isBefore(dayjs());
};

const getIsChallengeDone = (endDate: string) => {
  return dayjs(new Date()).isAfter(dayjs(endDate));
};

const getIsChallengeSubmitDone = (endDate: string) => {
  return dayjs(new Date()).isAfter(dayjs(endDate).add(2, 'day'));
};

const OldMyChallengeDashboard = () => {
  const params = useParams<{ programId: string }>();

  const { schedules, myDailyMission } = useCurrentChallenge();

  const todayTh = myDailyMission?.dailyMission?.th ?? schedules.length + 1;

  const { data: programData } = useQuery({
    queryKey: ['challenge', params.programId, 'application'],
    queryFn: async ({ queryKey }) => {
      const res = await axios.get(
        `/${queryKey[0]}/${queryKey[1]}/${queryKey[2]}`,
      );
      return res.data;
    },
  });

  const programEndDate = programData?.data?.endDate;

  const isChallengeDone = getIsChallengeDone(programEndDate);
  const isChallengeSubmitDone = programEndDate
    ? getIsChallengeSubmitDone(programEndDate)
    : undefined;

  return (
    <main className="px-6">
      <header>
        <h1 className="text-2xl font-bold">나의 기록장</h1>
      </header>
      <MissionCalendarSection
        schedules={schedules}
        todayTh={todayTh}
        isDone={isChallengeDone}
      />
      {myDailyMission?.attendanceInfo && myDailyMission.dailyMission && (
        <DailyMissionSection myDailyMission={myDailyMission} />
      )}
      {typeof isChallengeSubmitDone === 'boolean' && (
        <OtherMissionSection todayTh={todayTh} isDone={isChallengeSubmitDone} />
      )}
    </main>
  );
};

export default OldMyChallengeDashboard;
