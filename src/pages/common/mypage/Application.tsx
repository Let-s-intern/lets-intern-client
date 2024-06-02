import { useQuery } from '@tanstack/react-query';

import ApplySection from '../../../components/common/mypage/application/section/ApplySection';
import CompleteSection from '../../../components/common/mypage/application/section/CompleteSection';
import ParticipateSection from '../../../components/common/mypage/application/section/ParticipateSection';
import axios from '../../../utils/axios';
import { useState } from 'react';

export interface ApplicationType {
  id: number;
  status: string;
  programTitle: string;
  programStartDate: string;
  programEndDate: string;
  programType: string;
}

const Application = () => {
  const [applicationList, setApplicationList] = useState<ApplicationType[]>([]);

  const getApplicationList = useQuery({
    queryKey: ['application'],
    queryFn: async () => {
      const res = await axios.get('/application');
      setApplicationList(res.data.data.applicationList);
      console.log(res.data.data.applicationList);
      return res.data;
    },
  });

  const waitingApplicationList = applicationList.filter(
    (application) => application.status === 'WAITING',
  );
  const inProgressApplicationList = applicationList.filter(
    (application) => application.status === 'IN_PROGRESS',
  );
  const completedApplicationList = applicationList.filter(
    (application) => application.status === 'DONE',
  );

  const isLoading = getApplicationList.isLoading;

  if (isLoading) return <></>;

  return (
    <main className="flex flex-col gap-16 pb-20">
      <ApplySection applicationList={waitingApplicationList} />
      <ParticipateSection applicationList={inProgressApplicationList} />
      <CompleteSection applicationList={completedApplicationList} />
    </main>
  );
};

export default Application;
