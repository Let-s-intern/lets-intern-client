'use client';

import { GetReview, useGetProgramReview } from '@/api/review';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import MoreHeader from '@components/common/ui/MoreHeader';
import ReviewCard from '@components/ReviewCard';
import { useEffect, useState } from 'react';

const ProgramReviewSection = () => {
  const [reviewData, setReviewData] = useState<GetReview[] | null>(null);

  const { data: totalReview } = useGetProgramReview({ size: 4 });

  const { data: missionReview, isLoading: missionIsLoading } =
    useGetProgramReview({ size: 1, types: ['MISSION_REVIEW'] });
  const { data: challengeReview, isLoading: challengeIsLoading } =
    useGetProgramReview({ size: 1, types: ['CHALLENGE_REVIEW'] });
  const { data: liveReview, isLoading: liveIsLoading } = useGetProgramReview({
    size: 1,
    types: ['LIVE_REVIEW'],
  });
  const { data: reportReview, isLoading: reportIsLoading } =
    useGetProgramReview({ size: 1, types: ['REPORT_REVIEW'] });

  useEffect(() => {
    if (missionReview && challengeReview && liveReview && reportReview) {
      setReviewData([
        missionReview.reviewList[0],
        challengeReview.reviewList[0],
        liveReview.reviewList[0],
        reportReview.reviewList[0],
      ]);
    }
  }, [missionReview, challengeReview, liveReview, reportReview]);

  const isLoading =
    missionIsLoading || challengeIsLoading || liveIsLoading || reportIsLoading;

  return (
    <section className="w-full flex pt-6 pb-9 md:p-0 flex-col gap-y-6">
      <MoreHeader
        title="프로그램 참여 후기"
        subtitle={`${totalReview?.pageInfo.totalElements ?? '-'}개`}
      />
      {isLoading || !reviewData ? (
        <div className="flex justify-center items-center h-40">
          <LoadingContainer />
        </div>
      ) : (
        <div className="grid grid-rows-4 grid-cols-1 md:grid-rows-1 md:grid-cols-4 gap-6 md:gap-3">
          {reviewData.map((review) => (
            <ReviewCard
              key={review.reviewInfo.reviewId}
              review={review}
              missionTitleClamp={1}
              expandable
              reviewItemNums={2}
              href={`/review/${review.reviewInfo.type === 'MISSION_REVIEW' ? 'mission' : 'program'}${review.reviewInfo.type !== 'MISSION_REVIEW' ? `?program=${review.reviewInfo.type?.toLowerCase()}` : ''}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProgramReviewSection;
