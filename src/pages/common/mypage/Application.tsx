import { useQuery } from '@tanstack/react-query';

import ApplySection from '../../../components/common/mypage/application/section/ApplySection';
import CompleteSection from '../../../components/common/mypage/application/section/CompleteSection';
import ParticipateSection from '../../../components/common/mypage/application/section/ParticipateSection';
import axios from '../../../utils/axios';
import { useState } from 'react';

const Application = () => {
  const [applicationList, setApplicationList] = useState<
    {
      id: number;
      status: string;
      programTitle: string;
      programStartDate: string;
      programEndDate: string;
    }[]
  >([]);

  const getApplicationList = useQuery({
    queryKey: ['application'],
    queryFn: async () => {
      const res = await axios.get('/application');
      setApplicationList(res.data.data.applicationList);
      return res.data;
    },
  });

  const isLoading = getApplicationList.isLoading;

  if (isLoading) return <></>;

  return (
    <main className="flex flex-col gap-16 pb-20">
      <ApplySection applicationList={applicationList} />
      <ParticipateSection />
      <CompleteSection />
    </main>
  );
};

export default Application;
