'use client';

import { useMypageApplicationsQuery } from '@/api/application';
import CategoryTabs from '@/common/ui/CategoryTabs';
import {
  APPLICATION_CATEGORY_OPTIONS,
  ApplicationCategory,
} from '@/domain/mypage/application/constants';
import ApplySection from '@/domain/mypage/application/section/ApplySection';
import CompleteSection from '@/domain/mypage/application/section/CompleteSection';
import EmptySection from '@/domain/mypage/application/section/EmptySection';
import GuidebookSection from '@/domain/mypage/application/section/GuidebookSection';
import LibrarySection from '@/domain/mypage/application/section/LibrarySection';
import ParticipateSection from '@/domain/mypage/application/section/ParticipateSection';
import VodClassSection from '@/domain/mypage/application/section/VodClassSection';
import { useState } from 'react';

const Application = () => {
  const { data: applications, isLoading } = useMypageApplicationsQuery();
  const [category, setCategory] = useState<ApplicationCategory>('PROGRAM');

  const programApplications =
    applications?.filter(
      (application) =>
        application.programType !== 'GUIDEBOOK' &&
        application.programType !== 'VOD',
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

  const vodClassApplicationList =
    applications?.filter((application) => application.programType === 'VOD') ??
    [];

  if (isLoading) return <></>;

  const isProgramEmpty =
    programWaitingList.length === 0 &&
    programInProgressList.length === 0 &&
    programCompletedList.length === 0;

  return (
    <main className="flex w-full flex-col gap-8 md:gap-10">
      <div>
        <CategoryTabs
          options={APPLICATION_CATEGORY_OPTIONS}
          selected={category}
          onChange={setCategory}
          className="-mx-5 -mt-[18px] md:-mx-0 md:-mt-0"
        />
      </div>
      <div className="flex w-full flex-col gap-16">
        {category === 'PROGRAM' && (
          <>
            {isProgramEmpty ? (
              <EmptySection
                text="아직 신청한 프로그램이 없어요"
                href="/program"
                buttonText="프로그램 둘러보기"
              />
            ) : (
              <>
                <ApplySection
                  applicationList={programWaitingList}
                  hasInProgress={programInProgressList.length > 0}
                  hasCompleted={programCompletedList.length > 0}
                />
                <ParticipateSection applicationList={programInProgressList} />
                <CompleteSection applicationList={programCompletedList} />
              </>
            )}
          </>
        )}

        {category === 'LIBRARY' && <LibrarySection />}

        {category === 'GUIDEBOOK' && (
          <GuidebookSection applicationList={guidebookApplicationList} />
        )}
        {category === 'VOD' && (
          <VodClassSection applicationList={vodClassApplicationList} />
        )}
      </div>
    </main>
  );
};

export default Application;
