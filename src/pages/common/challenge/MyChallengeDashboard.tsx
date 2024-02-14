import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import DailyMissionSection from '../../../components/common/challenge/my-challenge/section/DailyMissionSection';
import OtherMissionSection from '../../../components/common/challenge/my-challenge/section/OtherMissionSection';
import axios from '../../../utils/axios';

const MyChallengeDashboard = () => {
  const [dailyMission, setDailyMission] = useState<any>();

  const { isLoading } = useQuery({
    queryKey: ['programs', 19, 'dashboard', 'my'],
    queryFn: async () => {
      const res = await axios.get('/program/19/dashboard/my');
      const data = res.data;
      console.log(data);
      setDailyMission(data.dailyMission);
      return data;
    },
  });

  if (isLoading || !dailyMission) {
    return <></>;
  }

  return (
    <main className="px-6">
      <header>
        <h1 className="text-2xl font-bold">개인 기록장</h1>
      </header>
      <DailyMissionSection dailyMission={dailyMission} />
      <OtherMissionSection />
    </main>
  );
};

export default MyChallengeDashboard;
