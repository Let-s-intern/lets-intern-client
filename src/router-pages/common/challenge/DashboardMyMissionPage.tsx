import MissionGuideSection from '@/components/common/challenge/my-challenge/MissionGuideSection';
import DailyMissionSection from '@/components/common/challenge/my-challenge/section/DailyMissionSection';
import MissionCalendarSection from '@/components/common/challenge/my-challenge/section/MissionCalendarSection';
import OtherMissionSection from '@/components/common/challenge/my-challenge/section/OtherMissionSection';
import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import dayjs from '@/lib/dayjs';
import axios from '@/utils/axios';
import MissionStatusMessage from '@components/common/challenge/my-challenge/MissionStatusMessage';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

const getIsChallengeDone = (endDate: string) => {
  return dayjs(new Date()).isAfter(dayjs(endDate));
};

const getIsChallengeSubmitDone = (endDate: string) => {
  return dayjs(new Date()).isAfter(dayjs(endDate).add(2, 'day'));
};

const DashboardMyMissionPage = () => {
  const params = useParams<{ programId: string }>();

  const { schedules, myDailyMission } = useCurrentChallenge();

  const { data: programData } = useQuery({
    queryKey: ['challenge', params.programId, 'application'],
    queryFn: async ({ queryKey }) => {
      const res = await axios.get(
        `/${queryKey[0]}/${queryKey[1]}/${queryKey[2]}`,
      );
      return res.data;
    },
  });

  let todayTh = myDailyMission?.dailyMission?.th ?? schedules.length + 1;
  const programEndDate = programData?.data?.endDate;
  const isChallengeDone = getIsChallengeDone(programEndDate);
  const isChallengeSubmitDone = programEndDate
    ? getIsChallengeSubmitDone(programEndDate)
    : undefined;
  todayTh = 0;
  return (
    <main className="px-6">
      <header>
        <h1 className="text-2xl font-bold">나의 미션</h1>
      </header>
      <div className="mb-4 mt-6">
        <MissionStatusMessage todayTh={todayTh} />
      </div>
      <MissionCalendarSection
        schedules={schedules}
        todayTh={todayTh}
        isDone={isChallengeDone}
      />
      <div className="mt-8">
        <MissionGuideSection todayTh={todayTh} />
      </div>
      {myDailyMission?.attendanceInfo && myDailyMission.dailyMission && (
        <DailyMissionSection myDailyMission={myDailyMission} />
      )}
      {typeof isChallengeSubmitDone === 'boolean' && (
        <OtherMissionSection todayTh={todayTh} isDone={isChallengeSubmitDone} />
      )}
    </main>
  );
};

export default DashboardMyMissionPage;
