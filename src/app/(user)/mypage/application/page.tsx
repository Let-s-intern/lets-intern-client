'use client';

import { useMypageApplicationsQuery } from '@/api/application';
import {
  APPLICATION_CATEGORY_OPTIONS,
  ApplicationCategory,
} from '@/domain/mypage/application/constants';
import ApplySection from '@/domain/mypage/application/section/ApplySection';
import CompleteSection from '@/domain/mypage/application/section/CompleteSection';
import ParticipateSection from '@/domain/mypage/application/section/ParticipateSection';
import CategoryChips from '@/domain/mypage/ui/button/CategoryChips';
import { useState } from 'react';

const Application = () => {
  const {
    data: applications,
    isLoading,
    refetch,
  } = useMypageApplicationsQuery();
  const [category, setCategory] = useState<ApplicationCategory>('PROGRAM');

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
    <main className="flex w-full flex-col gap-10">
      <div className="md:pt-5">
        <CategoryChips
          options={APPLICATION_CATEGORY_OPTIONS}
          selected={category}
          onChange={setCategory}
        />
      </div>
      <div className="flex w-full flex-col gap-16">
        <ApplySection
          applicationList={waitingApplicationList}
          refetch={() => refetch()}
        />
        <ParticipateSection applicationList={inProgressApplicationList} />
        <CompleteSection applicationList={completedApplicationList} />
      </div>
    </main>
  );
};

export default Application;
