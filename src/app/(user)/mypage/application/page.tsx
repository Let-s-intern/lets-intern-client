'use client';

import { useMypageApplicationsQuery } from '@/api/application';
import {
  APPLICATION_CATEGORY_OPTIONS,
  ApplicationCategory,
} from '@/domain/mypage/application/constants';
import ApplySection from '@/domain/mypage/application/section/ApplySection';
import CompleteSection from '@/domain/mypage/application/section/CompleteSection';
import EmptySection from '@/domain/mypage/application/section/EmptySection';
import GuidebookSection from '@/domain/mypage/application/section/GuidebookSection';
import ParticipateSection from '@/domain/mypage/application/section/ParticipateSection';
import CategoryTabs from '@/domain/mypage/ui/nav/CategoryTabs';
import { useState } from 'react';

const Application = () => {
  const {
    data: applications,
    isLoading,
    refetch,
  } = useMypageApplicationsQuery();
  const [category, setCategory] = useState<ApplicationCategory>('PROGRAM');

  const programApplications =
    applications?.filter(
      (application) => application.programType !== 'GUIDEBOOK',
    ) ?? [];
  const programWaitingList = programApplications.filter(
    (application) => application.programStatusType === 'PREV',
  );
  const programInProgressList = programApplications.filter(
    (application) => application.programStatusType === 'PROCEEDING',
  );
  const programCompletedList = programApplications.filter(
    (application) => application.programStatusType === 'POST',
  );

  const guidebookApplicationList =
    applications?.filter(
      (application) => application.programType === 'GUIDEBOOK',
    ) ?? [];

  if (isLoading) return <></>;

  return (
    <main className="flex w-full flex-col gap-10">
      <div className="md:pt-5">
        <CategoryTabs
          options={APPLICATION_CATEGORY_OPTIONS}
          selected={category}
          onChange={setCategory}
        />
      </div>
      <div className="flex w-full flex-col gap-16">
        {category === 'PROGRAM' && (
          <>
            {programWaitingList.length === 0 &&
            programInProgressList.length === 0 &&
            programCompletedList.length === 0 ? (
              <EmptySection
                text="아직 신청한 프로그램이 없어요"
                href="/program"
                buttonText="프로그램 둘러보기"
              />
            ) : (
              <>
                <ApplySection applicationList={programWaitingList} />
                <ParticipateSection applicationList={programInProgressList} />
                <CompleteSection applicationList={programCompletedList} />
              </>
            )}
          </>
        )}

        {/* LIBRARY 탭 */}

        {category === 'GUIDEBOOK' && (
          <GuidebookSection applicationList={guidebookApplicationList} />
        )}
      </div>
    </main>
  );
};

export default Application;
