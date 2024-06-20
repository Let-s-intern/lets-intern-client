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
  programShortDesc: string;
  programStartDate: string;
  programEndDate: string;
  programType: string;
  programId: number;
  reviewId: number | null;
}

const Application = () => {
  const [applicationList, setApplicationList] = useState<ApplicationType[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ['user', 'applications'],
    queryFn: async () => {
      const res = await axios.get('/user/applications');
      setApplicationList(res.data.data.applicationList);
      console.log(res.data.data);
      return res.data;
    },
  });

  const waitingApplicationList =
    data?.data?.applicationList.filter(
      (application: ApplicationType) => application.status === 'WAITING',
    ) || [];
  const inProgressApplicationList =
    data?.data?.applicationList.filter(
      (application: ApplicationType) => application.status === 'IN_PROGRESS',
    ) || [];
  const completedApplicationList =
    data?.data?.applicationList.filter(
      (application: ApplicationType) => application.status === 'DONE',
    ) || [];

  if (isLoading) return <></>;

  return (
    <main className="flex w-full flex-col gap-16 pb-20">
      <ApplySection applicationList={waitingApplicationList} />
      <ParticipateSection applicationList={inProgressApplicationList} />
      <CompleteSection applicationList={completedApplicationList} />
    </main>
  );
};

export default Application;
