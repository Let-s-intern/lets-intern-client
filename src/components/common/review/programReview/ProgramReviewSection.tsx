'use client';

import { useGetProgramReview } from '@/api/review';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import MoreHeader from '@components/common/ui/MoreHeader';
import ReviewCard from '@components/ReviewCard';

const ProgramReviewSection = () => {
  const { data: reviewData, isLoading: reviewDataIsLoading } =
    useGetProgramReview({ size: 3 });

  return (
    <section className="w-full flex flex-col gap-y-6">
      <MoreHeader
        title="프로그램 참여 후기"
        subtitle={`${reviewData?.pageInfo.totalElements ?? 'NN'}개`}
        href="/review/program"
      />
      {reviewDataIsLoading ? (
        <div className="flex justify-center items-center h-40">
          <LoadingContainer />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-5">
          {reviewData?.reviewList?.map((review) => (
            <ReviewCard
              key={review.reviewInfo.reviewId}
              review={review}
              missionTitleClamp={1}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProgramReviewSection;
