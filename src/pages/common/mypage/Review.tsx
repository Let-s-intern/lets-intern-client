import { useMemo } from 'react';
import { useMypageApplicationsQuery } from '../../../api/application';
import DoneSection from '../../../components/common/mypage/review/section/DoneSection';
import WaitingSection from '../../../components/common/mypage/review/section/WaitingSection';

const Review = () => {
  const { data: applications } = useMypageApplicationsQuery();

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
    <main className="flex w-full flex-col gap-16 px-5 pb-20">
      <WaitingSection applicationList={waitingList} />
      <DoneSection applicationList={doneList} />
    </main>
  );
};

export default Review;
