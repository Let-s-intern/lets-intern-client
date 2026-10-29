'use client';

import { MypageApplication } from '@/api/application';
import type { MyLiveMentoringApplication } from '@/api/live-mentoring/liveMentoringSchema';
import { useGetMypageMagnetListQuery } from '@/api/magnet/magnet';
import { LIBRARY_VISIBLE_MAGNET_TYPES } from '@/api/magnet/magnetSchema';
import ApplySection from './ApplySection';
import CompleteSection from './CompleteSection';
import EmptySection from './EmptySection';
import LaunchAlertSection from './LaunchAlertSection';
import MyContentSection from './MyContentSection';
import ParticipateSection from './ParticipateSection';

interface AllSectionProps {
  programWaitingList: MypageApplication[];
  programInProgressList: MypageApplication[];
  programCompletedList: MypageApplication[];
  membershipInProgressList: MypageApplication[];
  membershipCompletedList: MypageApplication[];
  guidebookApplicationList: MypageApplication[];
  vodClassApplicationList: MypageApplication[];
  mentoringWaitingList: MyLiveMentoringApplication[];
  mentoringInProgressList: MyLiveMentoringApplication[];
  mentoringCompletedList: MyLiveMentoringApplication[];
  /** 멘토링 전용 API 조회 실패. magnet 조회 실패와 함께 "불러오지 못했어요" 로 띄운다. */
  mentoringError: boolean;
  onMentoringQuestionClick: (applicationId: number) => void;
  onVersionChangeClick: (applicationId: number) => void;
}

/*
  신청현황 전체 탭 — 상태 기준 통합 뷰. 비어 있는 구간은 통째로 감춘다.
  자료집·출시알림도 전역 빈 상태 판정에 필요해 여기서 조회한다(React Query 키 공유로 요청 중복 없음).
*/
const AllSection = ({
  programWaitingList,
  programInProgressList,
  programCompletedList,
  membershipInProgressList,
  membershipCompletedList,
  guidebookApplicationList,
  vodClassApplicationList,
  mentoringWaitingList,
  mentoringInProgressList,
  mentoringCompletedList,
  mentoringError,
  onMentoringQuestionClick,
  onVersionChangeClick,
}: AllSectionProps) => {
  const {
    data: libraryData,
    isLoading: isLibraryLoading,
    isError: isLibraryError,
  } = useGetMypageMagnetListQuery({
    typeList: [...LIBRARY_VISIBLE_MAGNET_TYPES],
  });
  const {
    data: launchAlertData,
    isLoading: isLaunchAlertLoading,
    isError: isLaunchAlertError,
  } = useGetMypageMagnetListQuery({ typeList: ['LAUNCH_ALERT'] });

  if (isLibraryLoading || isLaunchAlertLoading) return <></>;

  const hasError = mentoringError || isLibraryError || isLaunchAlertError;

  // LibrarySection 과 같은 방어 필터 — EVENT/LAUNCH_ALERT 가 자료집으로 새지 않게 한다.
  const visibleTypes = LIBRARY_VISIBLE_MAGNET_TYPES as readonly string[];
  const libraryMagnetList = (libraryData?.magnetList ?? []).filter((magnet) =>
    visibleTypes.includes(magnet.type),
  );
  const launchAlertCount = launchAlertData?.magnetList?.length ?? 0;

  const inProgressList = [
    ...programInProgressList,
    ...membershipInProgressList,
  ];
  const completedList = [...programCompletedList, ...membershipCompletedList];

  const inProgressCount =
    inProgressList.length + mentoringInProgressList.length;
  const waitingCount = programWaitingList.length + mentoringWaitingList.length;
  const myContentCount =
    guidebookApplicationList.length +
    vodClassApplicationList.length +
    libraryMagnetList.length;
  const completedCount = completedList.length + mentoringCompletedList.length;

  const isEmpty =
    inProgressCount === 0 &&
    waitingCount === 0 &&
    myContentCount === 0 &&
    completedCount === 0 &&
    launchAlertCount === 0;

  if (isEmpty) {
    // 조회에 실패한 소스가 있으면 섣불리 "없음" 으로 단정하지 않는다.
    if (hasError) {
      return (
        <p className="text-neutral-40 py-20 text-center">
          신청 내역을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
        </p>
      );
    }
    return (
      <EmptySection
        text="아직 신청 내역이 없어요"
        href="/program"
        buttonText="프로그램 둘러보기"
      />
    );
  }

  return (
    <>
      {hasError && (
        <p className="text-xsmall14 text-neutral-40 bg-neutral-95 rounded-sm px-4 py-3 text-center">
          일부 내역을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
        </p>
      )}
      {inProgressCount > 0 && (
        <ParticipateSection
          applicationList={inProgressList}
          mentoringList={mentoringInProgressList}
          onMentoringQuestionClick={onMentoringQuestionClick}
          onVersionChangeClick={onVersionChangeClick}
        />
      )}
      {waitingCount > 0 && (
        <ApplySection
          applicationList={programWaitingList}
          mentoringList={mentoringWaitingList}
          onMentoringQuestionClick={onMentoringQuestionClick}
          onVersionChangeClick={onVersionChangeClick}
          hasInProgress={inProgressCount > 0}
          hasCompleted={completedCount > 0}
        />
      )}
      {myContentCount > 0 && (
        <MyContentSection
          guidebookList={guidebookApplicationList}
          vodClassList={vodClassApplicationList}
          libraryMagnetList={libraryMagnetList}
        />
      )}
      {completedCount > 0 && (
        <CompleteSection
          applicationList={completedList}
          mentoringList={mentoringCompletedList}
          onMentoringQuestionClick={onMentoringQuestionClick}
          onVersionChangeClick={onVersionChangeClick}
        />
      )}
      {launchAlertCount > 0 && (
        <LaunchAlertSection title="출시 알림" hideWhenEmpty />
      )}
    </>
  );
};

export default AllSection;
