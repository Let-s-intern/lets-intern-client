import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import DailyMissionSection from '../../../components/common/challenge/my-challenge/section/DailyMissionSection';
import OtherMissionSection from '../../../components/common/challenge/my-challenge/section/OtherMissionSection';
import axios from '../../../utils/axios';

const MyChallenge = () => {
  const [dailyMission, setDailyMission] = useState<any>();

  const { isLoading } = useQuery({
    queryKey: ['programs', 19, 'dashboard', 'my'],
    queryFn: async () => {
      const res = await axios.get('/program/19/dashboard/my');
      const data = res.data;
      setDailyMission(data.dailyMission);
      return data;
    },
  });

  if (isLoading || !dailyMission) {
    return <main>...</main>;
  }

  return (
    <main className="mx-auto max-w-[50rem]">
      <h1 className="text-2xl font-bold">개인 기록장</h1>
      <DailyMissionSection dailyMission={dailyMission} />
      <OtherMissionSection />
    </main>
  );
};

export default MyChallenge;
