import { useQuery } from '@tanstack/react-query';

import ApplySection from '../../../components/common/mypage/application/section/ApplySection';
import CompleteSection from '../../../components/common/mypage/application/section/CompleteSection';
import ParticipateSection from '../../../components/common/mypage/application/section/ParticipateSection';
import axios from '../../../utils/axios';

export interface ApplicationType {
  id: number;
  status: string;
  programId: number;
  programType: string;
  programStatusType: string;
  programTitle: string;
  programShortDesc: string;
  programThumbnail: string;
  programStartDate: string;
  programEndDate: string;
  reviewId: number | null;
  paymentId: number | null;
}

const Application = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['user', 'applications'],
    queryFn: async () => {
      const res = await axios.get('/user/applications');
      return res.data.data as { applicationList: ApplicationType[] };
    },
  });

  const waitingApplicationList =
    data?.applicationList?.filter(
      (application) => application.status === 'WAITING',
    ) || [];
  const inProgressApplicationList =
    data?.applicationList?.filter(
      (application) => application.status === 'IN_PROGRESS',
    ) || [];
  const completedApplicationList =
    data?.applicationList?.filter(
      (application) => application.status === 'DONE',
    ) || [];

  if (isLoading) return <></>;

  return (
    <main className="flex w-full flex-col gap-16 px-5 pb-20">
      <ApplySection
        applicationList={waitingApplicationList}
        refetch={() => refetch()}
      />
      <ParticipateSection applicationList={inProgressApplicationList} />
      <CompleteSection applicationList={completedApplicationList} />
    </main>
  );
};

export default Application;
