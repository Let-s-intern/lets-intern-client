import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import axios from '../../../utils/axios';
import MissionCalendarSection from '../../../components/common/challenge/my-challenge/section/MissionCalendarSection';
import DailyMissionSection from '../../../components/common/challenge/my-challenge/section/DailyMissionSection';
import OtherMissionSection from '../../../components/common/challenge/my-challenge/section/OtherMissionSection';

const MyChallengeDashboard = () => {
  const params = useParams();

  const [missionList, setMissionList] = useState<any>();
  const [dailyMission, setDailyMission] = useState<any>();
  const [todayTh, setTodayTh] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useQuery({
    queryKey: ['programs', params.programId, 'dashboard', 'my'],
    queryFn: async () => {
      const res = await axios.get(`/program/${params.programId}/dashboard/my`);
      const data = res.data;

      console.log(data);

      setMissionList(data.missionList);
      setDailyMission(data.dailyMission);
      setTodayTh(
        data.dailyMission ? data.dailyMission.th : data.missionList.length + 1,
      );
      setIsDone(data.isDone);
      setIsLoading(false);

      return data;
    },
  });

  if (isLoading) {
    return <></>;
  }

  return (
    <main className="px-6">
      <header>
        <h1 className="text-2xl font-bold">개인 기록장</h1>
      </header>
      <MissionCalendarSection
        missionList={missionList}
        todayTh={todayTh}
        isDone={isDone}
      />
      {dailyMission && <DailyMissionSection dailyMission={dailyMission} />}
      <OtherMissionSection todayTh={todayTh} isDone={isDone} />
    </main>
  );
};

export default MyChallengeDashboard;
