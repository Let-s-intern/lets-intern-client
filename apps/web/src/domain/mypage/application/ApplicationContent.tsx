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
import { useMyLiveMentoringApplicationsQuery } from '@/api/live-mentoring/liveMentoring';
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
    1대1 라이브 멘토링은 전용 API 로 온다. 프로그램 탭의 빈 상태를 판단하려면 여기서도
    건수를 알아야 한다 — React Query 가 같은 키를 합치므로 요청이 늘지는 않는다.
  */
  const { data: mentoringData } = useMyLiveMentoringApplicationsQuery();
  const mentoringCount = mentoringData?.applicationList?.length ?? 0;

  /*
    라이브 멘토링은 이 목록에서 빼고 `MentoringSection` 으로 그린다.

    `GET /api/v2/user/applications` 도 라이브 멘토링을 내려주지만, 그 응답에는 질문
    작성 여부가 없어 `멘토링 질문 작성/수정/확인` 라벨을 만들 수 없다. 전용 API
    (`/live-mentoring/applications/my`)를 쓰는 `MentoringSection` 은 그 정보를 갖고
    있어 `질문` 과 `멘토링 입장` 두 버튼을 제대로 그린다.

    여기서 빼지 않으면 같은 신청이 프로그램 탭 안에서 두 번 뜬다.
  */
  const programApplications =
    applications?.filter(
      (application) =>
        application.programType !== 'GUIDEBOOK' &&
        application.programType !== 'VOD' &&
        application.programType !== 'LIVE_MENTORING',
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

  const hasProgramApplications =
    programWaitingList.length > 0 ||
    programInProgressList.length > 0 ||
    programCompletedList.length > 0;

  const isProgramEmpty =
    programWaitingList.length === 0 &&
    programInProgressList.length === 0 &&
    programCompletedList.length === 0 &&
    mentoringCount === 0;

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
                {/*
                  프로그램 신청이 하나도 없으면 세 구간을 통째로 감춘다.
                  감추지 않으면 "참여 예정인 프로그램이 없어요" 세 줄이 뜬 아래에
                  멘토링 카드가 붙어, 없다고 해놓고 보여주는 화면이 된다.
                */}
                {hasProgramApplications && (
                  <>
                    <ApplySection
                      applicationList={programWaitingList}
                      hasInProgress={programInProgressList.length > 0}
                      hasCompleted={programCompletedList.length > 0}
                    />
                    <ParticipateSection
                      applicationList={programInProgressList}
                    />
                    <CompleteSection applicationList={programCompletedList} />
                  </>
                )}
                {/*
                  1대1 라이브 멘토링도 커리어 성장 프로그램에 함께 보여준다.
                  `멘토링 질문 작성` 과 `멘토링 입장` 버튼이 붙은 전용 카드를 그대로 쓴다.
                */}
                <MentoringSection showEmptyState={false} />
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
