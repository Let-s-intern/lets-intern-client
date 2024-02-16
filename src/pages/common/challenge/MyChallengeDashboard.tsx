import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import DailyMissionSection from '../../../components/common/challenge/my-challenge/section/DailyMissionSection';
import OtherMissionSection from '../../../components/common/challenge/my-challenge/section/OtherMissionSection';
import axios from '../../../utils/axios';
import MissionCalendarSection from '../../../components/common/challenge/my-challenge/section/MissionCalendarSection';

const MyChallengeDashboard = () => {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [missionList, setMissionList] = useState<any>();
  const [dailyMission, setDailyMission] = useState<any>();
  const [todayTh, setTodayTh] = useState<number>();

  const { isLoading } = useQuery({
    queryKey: ['programs', params.programId, 'dashboard', 'my'],
    queryFn: async () => {
      const res = await axios.get(`/program/${params.programId}/dashboard/my`);
      const data = res.data;

      console.log(data);

      setMissionList(data.missionList);
      setDailyMission(data.dailyMission);
      setTodayTh(data.dailyMission.th);

      return data;
    },
  });

  useEffect(() => {}, [searchParams, setSearchParams]);

  if (isLoading || !dailyMission || !todayTh) {
    return <></>;
  }

  return (
    <main className="px-6">
      <header>
        <h1 className="text-2xl font-bold">개인 기록장</h1>
      </header>
      <MissionCalendarSection missionList={missionList} todayTh={todayTh} />
      <DailyMissionSection dailyMission={dailyMission} />
      <OtherMissionSection />
    </main>
  );
};

export default MyChallengeDashboard;
