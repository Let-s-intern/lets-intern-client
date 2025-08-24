'use client';

import { useMypageApplicationsQuery } from '@/api/application';
import ApplySection from '@/components/common/mypage/application/section/ApplySection';
import CompleteSection from '@/components/common/mypage/application/section/CompleteSection';
import ParticipateSection from '@/components/common/mypage/application/section/ParticipateSection';

const Application = () => {
  const {
    data: applications,
    isLoading,
    refetch,
  } = useMypageApplicationsQuery();

  const waitingApplicationList =
    applications?.filter(
      (application) => application.programStatusType === 'PREV',
    ) || [];
  const inProgressApplicationList =
    applications?.filter(
      (application) => application.programStatusType === 'PROCEEDING',
    ) || [];
  const completedApplicationList =
    applications?.filter(
      (application) => application.programStatusType === 'POST',
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