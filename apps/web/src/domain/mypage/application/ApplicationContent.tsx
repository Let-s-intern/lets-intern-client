'use client';

import { mypageApplicationsQueryOptions } from '@/api/application';
import { CategoryTabs } from '@letscareer/ui';
import {
  APPLICATION_CATEGORY_OPTIONS,
  ApplicationCategory,
  filterMentoringCategory,
} from '@/domain/mypage/application/constants';
import ApplySection from '@/domain/mypage/application/section/ApplySection';
import CompleteSection from '@/domain/mypage/application/section/CompleteSection';
import EmptySection from '@/domain/mypage/application/section/EmptySection';
import GuidebookSection from '@/domain/mypage/application/section/GuidebookSection';
import LaunchAlertSection from '@/domain/mypage/application/section/LaunchAlertSection';
import LibrarySection from '@/domain/mypage/application/section/LibrarySection';
import MentoringSection, {
  resolvePhase,
} from '@/domain/mypage/application/section/MentoringSection';
import { useMyLiveMentoringApplicationsQuery } from '@/api/live-mentoring/liveMentoring';
import { SHOW_LIVE_MENTORING_NAV } from '@/domain/live-mentoring/constants';
import QuestionModal from '@/domain/live-mentoring/question/QuestionModal';
import ParticipateSection from '@/domain/mypage/application/section/ParticipateSection';
import VodClassSection from '@/domain/mypage/application/section/VodClassSection';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';

const ApplicationContent = () => {
  const { data: applications } = useSuspenseQuery(
    mypageApplicationsQueryOptions,
  );
  const [category, setCategory] = useState<ApplicationCategory>('PROGRAM');
  const [openMentoringId, setOpenMentoringId] = useState<number | null>(null);
  /*
    1대1 라이브 멘토링은 전용 API 로 온다. 프로그램 탭의 세 구간에 함께 담고, 멘토링 탭을
    열지도 이 건수로 정한다 — React Query 가 같은 키를 합치므로 요청이 늘지는 않는다.
  */
  const { data: mentoringData } = useMyLiveMentoringApplicationsQuery();
  const mentoringList = mentoringData?.applicationList ?? [];
  const now = new Date();
  const mentoringWaitingList = mentoringList.filter(
    (application) => resolvePhase(application, now) === 'upcoming',
  );
  const mentoringInProgressList = mentoringList.filter(
    (application) => resolvePhase(application, now) === 'ongoing',
  );
  const mentoringCompletedList = mentoringList.filter(
    (application) => resolvePhase(application, now) === 'ended',
  );

  const categoryOptions = filterMentoringCategory(
    APPLICATION_CATEGORY_OPTIONS,
    SHOW_LIVE_MENTORING_NAV || mentoringList.length > 0,
  );

  /*
    라이브 멘토링은 이 목록에서 빼고 전용 API 의 `MentoringApplicationCard` 로 그린다.

    `GET /api/v2/user/applications` 도 라이브 멘토링을 내려주지만, 그 응답에는 질문
    작성 여부가 없어 `멘토링 질문 작성/수정/확인` 라벨을 만들 수 없다. 전용 API
    (`/live-mentoring/applications/my`)는 그 정보를 갖고 있어 `질문` 과 `멘토링 입장`
    두 버튼을 제대로 그린다.

    여기서 빼지 않으면 같은 신청이 한 구간 안에서 두 번 뜬다.
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

  const isProgramEmpty =
    programWaitingList.length === 0 &&
    programInProgressList.length === 0 &&
    programCompletedList.length === 0 &&
    mentoringList.length === 0;

  const openMentoring =
    mentoringList.find(
      (application) => application.applicationId === openMentoringId,
    ) ?? null;

  return (
    <main className="flex w-full flex-col gap-8 md:gap-10">
      <div className="-mx-5 -mt-[18px] md:mx-0 md:mt-0">
        <CategoryTabs
          options={categoryOptions}
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
                  1대1 라이브 멘토링도 같은 구간에 함께 담는다(LC-3301).
                  `멘토링 질문 작성` 과 `멘토링 입장` 버튼이 붙은 전용 카드를 그대로 쓴다.
                */}
                <ApplySection
                  applicationList={programWaitingList}
                  mentoringList={mentoringWaitingList}
                  onMentoringQuestionClick={setOpenMentoringId}
                  hasInProgress={
                    programInProgressList.length +
                      mentoringInProgressList.length >
                    0
                  }
                  hasCompleted={
                    programCompletedList.length +
                      mentoringCompletedList.length >
                    0
                  }
                />
                <ParticipateSection
                  applicationList={programInProgressList}
                  mentoringList={mentoringInProgressList}
                  onMentoringQuestionClick={setOpenMentoringId}
                />
                <CompleteSection
                  applicationList={programCompletedList}
                  mentoringList={mentoringCompletedList}
                  onMentoringQuestionClick={setOpenMentoringId}
                />
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

      {openMentoring && (
        <QuestionModal
          applicationId={openMentoring.applicationId}
          // 시작한 뒤에는 읽기만 한다. `MentoringSection` 과 같은 규칙이다.
          readOnly={resolvePhase(openMentoring, now) !== 'upcoming'}
          onClose={() => setOpenMentoringId(null)}
        />
      )}
    </main>
  );
};

export default ApplicationContent;
