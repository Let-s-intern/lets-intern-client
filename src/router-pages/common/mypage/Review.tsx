import { useMemo } from 'react';

import { useGetAllApplicationsForReviewQuery } from '@/api/review';
import DoneSection from '@/components/common/mypage/review/section/DoneSection';
import WaitingSection from '@/components/common/mypage/review/section/WaitingSection';

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
    <section className="flex w-full flex-col gap-16 px-5 pb-20">
      <WaitingSection applicationList={waitingList} />
      <DoneSection applicationList={doneList} />
    </section>
  );
};

export default Review;
