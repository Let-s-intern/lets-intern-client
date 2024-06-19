import dayjs from 'dayjs';
import { useEffect } from 'react';
import DailyMissionSection from '../../../components/common/challenge/my-challenge/section/DailyMissionSection';
import MissionCalendarSection from '../../../components/common/challenge/my-challenge/section/MissionCalendarSection';
import OtherMissionSection from '../../../components/common/challenge/my-challenge/section/OtherMissionSection';
import { useCurrentChallenge } from '../../../context/CurrentChallengeProvider';
import { Schedule } from '../../../schema';

// TODO: [나중에...] 외부로 빼야 함
const getIsDone = (schedules: Schedule[]) => {
  const last = schedules.reduce((acc, schedule) => {
    const endDate = dayjs(schedule.missionInfo.endDate) ?? dayjs('2000-01-01');
    if (acc.isBefore(endDate)) {
      return endDate;
    }
    return acc;
  }, dayjs('2000-01-01'));

  console.log(last.toISOString());
  return last.isBefore(dayjs());
};

const MyChallengeDashboard = () => {
  const { schedules, myDailyMission } = useCurrentChallenge();

  // const [missionList, setMissionList] = useState<any>();
  // const [dailyMission, setDailyMission] = useState<any>();
  // const [todayTh, setTodayTh] = useState<number>(0);
  // const [isDone, setIsDone] = useState<boolean>(false);
  // const [isLoading, setIsLoading] = useState<boolean>(true);

  // const { data: myDailyMission } = useQuery({
  //   enabled: Boolean(currentChallenge?.id),
  //   queryKey: ['challenge', currentChallenge?.id, 'my', 'daily-mission'],
  //   queryFn: async () => {
  //     const res = await axios.get(
  //       `/challenge/${currentChallenge?.id}/my/daily-mission`,
  //     );
  //     return myDailyMissionSchema.parse(res.data.data);
  //   },
  // });

  const todayTh = myDailyMission?.dailyMission.th ?? schedules.length + 1;

  // useQuery({
  //   queryKey: ['programs', params.programId, 'dashboard', 'my'],
  //   queryFn: async () => {
  //     const res = await axios.get(`/program/${params.programId}/dashboard/my`);
  //     const data = res.data;

  //     console.log(data);

  //     setMissionList(data.missionList);
  //     setDailyMission(data.dailyMission);
  //     setTodayTh(
  //       data.dailyMission ? data.dailyMission.th : data.missionList.length + 1,
  //     );
  //     setIsDone(data.isDone);
  //     setIsLoading(false);

  //     return data;
  //   },
  // });

  // if (isLoading) {
  //   return <></>;
  // }

  const isDone = getIsDone(schedules);

  return (
    <main className="px-6">
      <header>
        <h1 className="text-2xl font-bold">개인 기록장</h1>
      </header>
      <MissionCalendarSection
        schedules={schedules}
        todayTh={todayTh}
        isDone={isDone}
      />
      {myDailyMission && (
        <DailyMissionSection myDailyMission={myDailyMission} />
      )}
      <OtherMissionSection todayTh={todayTh} isDone={isDone} />
    </main>
  );
};

export default MyChallengeDashboard;
