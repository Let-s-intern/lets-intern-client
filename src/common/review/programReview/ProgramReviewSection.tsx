'use client';

import { GetReview, useGetProgramReview } from '@/api/review';
import LoadingContainer from '@/common/ui/loading/LoadingContainer';
import MoreHeader from '@/common/ui/MoreHeader';
import ReviewCard from '@/domain/review/ReviewCard';
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
    const reviews: GetReview[] = [];

    if ((missionReview?.reviewList.length ?? 0) > 0) {
      reviews.push(missionReview?.reviewList[0] as GetReview);
    }

    if ((challengeReview?.reviewList.length ?? 0) > 0) {
      reviews.push(challengeReview?.reviewList[0] as GetReview);
    }

    if ((liveReview?.reviewList.length ?? 0) > 0) {
      reviews.push(liveReview?.reviewList[0] as GetReview);
    }

    if ((reportReview?.reviewList.length ?? 0) > 0) {
      reviews.push(reportReview?.reviewList[0] as GetReview);
    }
    setReviewData(reviews);
  }, [missionReview, challengeReview, liveReview, reportReview]);

  const isLoading =
    missionIsLoading || challengeIsLoading || liveIsLoading || reportIsLoading;

  return (
    <section className="flex w-full flex-col gap-y-6 pb-9 pt-6 md:p-0">
      <MoreHeader
        subtitle={`${totalReview?.pageInfo.totalElements ?? '-'}개`}
        gaText="프로그램 참여 후기"
      >
        프로그램 참여 후기{' '}
      </MoreHeader>
      {isLoading || !reviewData ? (
        <div className="flex h-40 items-center justify-center">
          <LoadingContainer />
        </div>
      ) : (
        <div className="flex flex-col gap-6 md:grid md:grid-cols-4 md:grid-rows-1 md:gap-3">
          {reviewData.map((review, i) => (
            <ReviewCard
              key={(review.reviewInfo.type ?? '') + review.reviewInfo.reviewId}
              review={review}
              reviewItemLineClamp={2}
              missionTitleClamp={1}
              reviewItemNums={2}
              href={`/review/${review.reviewInfo.type === 'MISSION_REVIEW' ? 'mission' : 'program'}${review.reviewInfo.type !== 'MISSION_REVIEW' ? `?program=${review.reviewInfo.type?.toLowerCase()}` : ''}`}
              className={i === 0 ? 'mission_review' : 'program_review'}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProgramReviewSection;
