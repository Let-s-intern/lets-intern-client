'use client';

import { useMemo } from 'react';

import { useGetAllApplicationsForReviewQuery } from '@/api/review';
import DoneSection from '@/domain/mypage/review/section/DoneSection';
import WaitingSection from '@/domain/mypage/review/section/WaitingSection';

const Review = () => {
  const { data: applications } = useGetAllApplicationsForReviewQuery();

  const doneList = useMemo(() => {
    return (
      applications?.filter(
        (application) =>
          application.programStatusType !== 'PREV' &&
          application.reviewId !== null,
      ) || []
    );
  }, [applications]);

  const waitingList = useMemo(() => {
    return (
      applications?.filter(
        (application) =>
          application.programStatusType !== 'PREV' &&
          application.reviewId === null,
      ) || []
    );
  }, [applications]);

  return (
    <main className="flex w-full flex-col gap-16">
      <WaitingSection applicationList={waitingList} />
      <DoneSection applicationList={doneList} />
    </main>
  );
};

export default Review;
