'use client';

import { useMemo } from 'react';

import { useGetAllApplicationsForReviewQuery } from '@/api/review/review';
import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import DoneSection from '@/domain/mypage/review/section/DoneSection';
import WaitingSection from '@/domain/mypage/review/section/WaitingSection';

const ReviewContent = () => {
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

const Review = () => {
  return (
    <AsyncBoundary>
      <ReviewContent />
    </AsyncBoundary>
  );
};

export default Review;
