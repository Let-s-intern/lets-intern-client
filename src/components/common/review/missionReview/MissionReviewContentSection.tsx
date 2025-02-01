'use client';

import { programReviewParam, useGetProgramReview } from '@/api/review';
import { ChallengeType, PageInfo } from '@/schema';
import MuiPagination from '@components/common/program/pagination/MuiPagination';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import ReviewCard from '@components/ReviewCard';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const MissionReviewContentSection = () => {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);

  const challengeType = searchParams.get('challenge')?.toUpperCase();

  const challengeTypeList = challengeType
    ?.split(',')
    .map((value) => value as ChallengeType);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getProgramParams: programReviewParam = {
    types: ['MISSION_REVIEW'],
    challengeTypes: challengeTypeList,
    page: currentPage,
    size: 10,
  };

  const { data: reviewData, isLoading: reviewDataIsLoading } =
    useGetProgramReview(getProgramParams);

  useEffect(() => {
    if (reviewData) {
      setPageInfo(reviewData.pageInfo);
    }
  }, [reviewData, pageInfo]);

  return (
    <div className="w-full px-5 flex flex-col gap-y-6 md:pr-5 md:pl-0 lg:px-0 pb-12 md:pb-8">
      {reviewDataIsLoading ? (
        <LoadingContainer />
      ) : !reviewData || reviewData.reviewList.length < 1 ? (
        <div className="flex justify-center bg-neutral-95 rounded-ms text-xsmall14 text-neutral-40 items-center h-60">
          등록된 후기가 없습니다.
        </div>
      ) : (
        reviewData.reviewList.map((review) => (
          <ReviewCard
            key={review.reviewInfo.reviewId}
            review={review}
            showThumbnail
            expandable
          />
        ))
      )}
      {pageInfo && pageInfo.totalPages > 0 && (
        <MuiPagination
          page={currentPage}
          pageInfo={pageInfo}
          onChange={(event, page) => {
            handlePageChange(page);
          }}
        />
      )}
    </div>
  );
};

export default MissionReviewContentSection;
