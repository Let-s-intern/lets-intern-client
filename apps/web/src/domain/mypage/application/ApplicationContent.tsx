'use client';

import { mypageApplicationsQueryOptions } from '@/api/application';
import { CategoryTabs } from '@letscareer/ui';
import {
  APPLICATION_CATEGORY_OPTIONS,
  ApplicationCategory,
} from '@/domain/mypage/application/constants';
import ApplySection from '@/domain/mypage/application/section/ApplySection';
import CompleteSection from '@/domain/mypage/application/section/CompleteSection';
import EmptySection from '@/domain/mypage/application/section/EmptySection';
import GuidebookSection from '@/domain/mypage/application/section/GuidebookSection';
import LaunchAlertSection from '@/domain/mypage/application/section/LaunchAlertSection';
import LibrarySection from '@/domain/mypage/application/section/LibrarySection';
import MentoringSection from '@/domain/mypage/application/section/MentoringSection';
import ParticipateSection from '@/domain/mypage/application/section/ParticipateSection';
import VodClassSection from '@/domain/mypage/application/section/VodClassSection';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';

const ApplicationContent = () => {
  const { data: applications } = useSuspenseQuery(
    mypageApplicationsQueryOptions,
  );
  const [category, setCategory] = useState<ApplicationCategory>('PROGRAM');

  /*
    라이브 멘토링은 전용 탭에서 별도 API(`/live-mentoring/applications/my`)로 그린다.

    task 는 여기에 `programType !== 'LIVE_MENTORING'` 을 방어용으로 더하라고 했지만
    넣지 않았다. `ProgramTypeEnum` 에 그 값이 없어서 서버가 보내면 필터에 닿기 전에
    `mypageApplicationsSchema.parse` 가 먼저 던진다 — 카드가 두 번 뜨는 것보다
    시끄럽게 실패하는 편이 낫고, 비교문 자체가 타입 오류다.
  */
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

  const isProgramEmpty =
    programWaitingList.length === 0 &&
    programInProgressList.length === 0 &&
    programCompletedList.length === 0;

  return (
    <main className="flex w-full flex-col gap-8 md:gap-10">
      <div className="-mx-5 -mt-[18px] md:mx-0 md:mt-0">
        <CategoryTabs
          options={APPLICATION_CATEGORY_OPTIONS}
          selected={category}
          onChange={setCategory}
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

        {category === 'MENTORING' && <MentoringSection />}

        {category === 'LIBRARY' && <LibrarySection />}

        {category === 'GUIDEBOOK' && (
          <GuidebookSection applicationList={guidebookApplicationList} />
        )}
        {category === 'VOD' && (
          <VodClassSection applicationList={vodClassApplicationList} />
        )}
        {category === 'LAUNCH_ALERT' && <LaunchAlertSection />}
      </div>
    </main>
  );
};

export default ApplicationContent;
